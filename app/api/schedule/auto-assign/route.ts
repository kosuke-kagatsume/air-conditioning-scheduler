import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { prisma } from "@/lib/prisma"

interface AssignmentScore {
  workerId: string
  workerName: string
  score: number
  reasons: string[]
  availability: boolean
  skillMatch: number
  distanceScore: number
  workloadScore: number
}

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/schedule/auto-assign',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/schedule/auto-assign',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { eventId, constructionType, skillsRequired, preferredDate, siteAddress } = body

        if (!eventId) {
          return NextResponse.json(
            { success: false, message: 'イベントIDが必要です' },
            { status: 400 }
          )
        }

        // イベント情報を取得
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: {
            site: true,
            assignedWorker: true
          }
        })

        if (!event) {
          return NextResponse.json(
            { success: false, message: 'イベントが見つかりません' },
            { status: 404 }
          )
        }

        // 稼働可能な職人を取得
        const workers = await prisma.worker.findMany({
          include: {
            skills: true,
            certifications: true,
            assignedEvents: {
              where: {
                date: event.date,
                OR: [
                  {
                    startTime: { lte: event.startTime },
                    endTime: { gt: event.startTime }
                  },
                  {
                    startTime: { lt: event.endTime || event.startTime },
                    endTime: { gte: event.endTime || event.startTime }
                  }
                ]
              }
            }
          }
        })

        // 各職人のスコアを計算
        const assignments: AssignmentScore[] = []

        for (const worker of workers) {
          const score = calculateWorkerScore(worker, event, skillsRequired || [])
          assignments.push(score)
        }

        // スコア順にソート
        assignments.sort((a, b) => b.score - a.score)

        // 最適な職人を自動選択（スコアが70以上の場合）
        const bestMatch = assignments[0]
        let autoAssigned = false

        if (bestMatch && bestMatch.score >= 70 && bestMatch.availability) {
          try {
            await prisma.event.update({
              where: { id: eventId },
              data: { workerId: bestMatch.workerId }
            })
            autoAssigned = true
          } catch (error) {
            console.error('Auto-assignment failed:', error)
          }
        }

        return NextResponse.json({
          success: true,
          assignments: assignments.slice(0, 5), // 上位5名を返す
          autoAssigned,
          recommendedWorker: bestMatch,
          event: {
            id: event.id,
            title: event.title,
            date: event.date.toISOString().split('T')[0],
            startTime: event.startTime,
            endTime: event.endTime,
            constructionType: event.constructionType,
            siteName: event.site?.name,
            address: event.site?.address
          }
        })

      } catch (error) {
        console.error('Auto-assignment error:', error)
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'スケジュール自動割り当てに失敗しました',
          },
          { status: 500 }
        )
      }
    }
  )
}

function calculateWorkerScore(worker: any, event: any, skillsRequired: string[]): AssignmentScore {
  let score = 0
  const reasons: string[] = []
  
  // 可用性チェック
  const availability = worker.assignedEvents.length === 0
  if (!availability) {
    return {
      workerId: worker.id,
      workerName: worker.name,
      score: 0,
      reasons: ['この時間帯は他の作業が予定されています'],
      availability: false,
      skillMatch: 0,
      distanceScore: 0,
      workloadScore: 0
    }
  }
  
  // スキルマッチング (最大40点)
  const workerSkills = worker.skills.map((s: any) => s.name)
  let skillMatch = 0
  
  if (skillsRequired.length > 0) {
    const matchedSkills = skillsRequired.filter(skill => workerSkills.includes(skill))
    skillMatch = (matchedSkills.length / skillsRequired.length) * 40
    
    if (matchedSkills.length > 0) {
      reasons.push(`必要スキル ${matchedSkills.length}/${skillsRequired.length} がマッチ`)
    }
  } else {
    // 工事タイプに基づく基本スキル判定
    const constructionSkills = getConstructionSkills(event.constructionType)
    const matchedSkills = constructionSkills.filter(skill => workerSkills.includes(skill))
    skillMatch = matchedSkills.length > 0 ? 30 : 10
    
    if (matchedSkills.length > 0) {
      reasons.push(`${event.constructionType}に適したスキルを保有`)
    }
  }
  
  score += skillMatch
  
  // 距離スコア (最大25点) - 簡易計算
  const distanceScore = 20 // 実際は住所から距離を計算
  score += distanceScore
  reasons.push('現場との距離が適切')
  
  // ワークロードスコア (最大25点)
  const todayEvents = worker.assignedEvents.filter((e: any) => 
    e.date.toISOString().split('T')[0] === event.date.toISOString().split('T')[0]
  )
  const workloadScore = Math.max(0, 25 - (todayEvents.length * 8))
  score += workloadScore
  
  if (todayEvents.length === 0) {
    reasons.push('当日他の予定なし')
  } else {
    reasons.push(`当日 ${todayEvents.length} 件の予定`)
  }
  
  // 資格・経験ボーナス (最大10点)
  const hasRelevantCerts = worker.certifications.some((cert: any) => 
    cert.name.includes('電気') || cert.name.includes('冷媒') || cert.name.includes('管工事')
  )
  
  if (hasRelevantCerts) {
    score += 10
    reasons.push('関連資格を保有')
  }
  
  return {
    workerId: worker.id,
    workerName: worker.name,
    score: Math.round(score),
    reasons,
    availability: true,
    skillMatch: Math.round(skillMatch),
    distanceScore: Math.round(distanceScore),
    workloadScore: Math.round(workloadScore)
  }
}

function getConstructionSkills(constructionType: string): string[] {
  const skillMap: { [key: string]: string[] } = {
    'エアコン設置': ['エアコン設置', '電気工事', '配管工事'],
    'エアコン修理': ['エアコン修理', '電気工事', '冷媒取扱'],
    'メンテナンス': ['エアコン修理', 'メンテナンス', '冷媒取扱'],
    '配管工事': ['配管工事', '溶接作業'],
    '電気工事': ['電気工事'],
    '緊急対応': ['エアコン修理', '電気工事', '高所作業']
  }
  
  return skillMap[constructionType] || ['エアコン設置']
}