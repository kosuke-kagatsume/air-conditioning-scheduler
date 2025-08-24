// AI自動スケジューリングエンジン
// 職人のスキル、位置、稼働状況を考慮した最適配置

import { prisma } from '@/lib/prisma'

// スケジューリング要因の重み付け
const WEIGHTS = {
  SKILL_MATCH: 0.35,        // スキルマッチ度
  DISTANCE: 0.25,           // 移動距離
  WORKLOAD_BALANCE: 0.20,   // 負荷分散
  EXPERIENCE: 0.10,         // 経験値
  CUSTOMER_RATING: 0.10,    // 顧客評価
} as const

// 作業タイプ別の必要スキル定義
const REQUIRED_SKILLS: Record<string, string[]> = {
  'エアコン新設': ['エアコン設置', '電気工事', '配管工事'],
  'エアコン修理': ['エアコン修理', '故障診断', '電気工事'],
  'メンテナンス': ['エアコンメンテナンス', '清掃', '点検'],
  '配管工事': ['配管工事', '溶接', '水道工事'],
  '電気工事': ['電気工事', '第二種電気工事士'],
  '緊急対応': ['故障診断', 'エアコン修理', '緊急対応'],
}

// 東京23区の座標（簡易版）
const TOKYO_DISTRICTS: Record<string, { lat: number; lng: number }> = {
  '千代田区': { lat: 35.6940, lng: 139.7535 },
  '中央区': { lat: 35.6707, lng: 139.7720 },
  '港区': { lat: 35.6581, lng: 139.7514 },
  '新宿区': { lat: 35.6938, lng: 139.7036 },
  '文京区': { lat: 35.7089, lng: 139.7522 },
  '台東区': { lat: 35.7127, lng: 139.7800 },
  '墨田区': { lat: 35.7107, lng: 139.8013 },
  '江東区': { lat: 35.6729, lng: 139.8173 },
  '品川区': { lat: 35.6092, lng: 139.7302 },
  '目黒区': { lat: 35.6414, lng: 139.6982 },
  '大田区': { lat: 35.5614, lng: 139.7161 },
  '世田谷区': { lat: 35.6464, lng: 139.6530 },
  '渋谷区': { lat: 35.6640, lng: 139.6982 },
  '中野区': { lat: 35.7077, lng: 139.6638 },
  '杉並区': { lat: 35.6994, lng: 139.6364 },
  '豊島区': { lat: 35.7263, lng: 139.7155 },
  '北区': { lat: 35.7527, lng: 139.7337 },
  '荒川区': { lat: 35.7362, lng: 139.7832 },
  '板橋区': { lat: 35.7512, lng: 139.7096 },
  '練馬区': { lat: 35.7357, lng: 139.6516 },
  '足立区': { lat: 35.7756, lng: 139.8046 },
  '葛飾区': { lat: 35.7474, lng: 139.8474 },
  '江戸川区': { lat: 35.7066, lng: 139.8684 },
}

// 職人の評価データ型
interface WorkerScore {
  workerId: string
  workerName: string
  score: number
  factors: {
    skillMatch: number
    distance: number
    workloadBalance: number
    experience: number
    customerRating: number
  }
  details: {
    matchedSkills: string[]
    missingSkills: string[]
    distanceKm: number
    currentJobsToday: number
    totalExperience: number
    averageRating: number
  }
}

// スケジュール提案データ型
export interface ScheduleSuggestion {
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  requiredSkills: string[]
  recommendations: WorkerScore[]
  autoAssigned?: {
    workerId: string
    workerName: string
    reason: string
  }
}

// 距離計算（ハヴァーサイン公式）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 地区から座標を取得
function getDistrictCoordinates(address: string): { lat: number; lng: number } | null {
  for (const [district, coords] of Object.entries(TOKYO_DISTRICTS)) {
    if (address.includes(district)) {
      return coords
    }
  }
  // デフォルト：東京駅
  return { lat: 35.6812, lng: 139.7671 }
}

// スキルマッチ度計算
function calculateSkillMatch(workerSkills: string[], requiredSkills: string[]): {
  score: number
  matched: string[]
  missing: string[]
} {
  const matched = workerSkills.filter(skill => requiredSkills.includes(skill))
  const missing = requiredSkills.filter(skill => !workerSkills.includes(skill))
  const score = requiredSkills.length > 0 
    ? matched.length / requiredSkills.length 
    : 1

  return { score, matched, missing }
}

// 職人の稼働状況を取得
async function getWorkerWorkload(workerId: string, date: Date): Promise<number> {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const jobCount = await prisma.event.count({
    where: {
      workerId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        in: ['SCHEDULED', 'IN_PROGRESS']
      }
    }
  })

  return jobCount
}

// 職人のスコアリング
async function scoreWorker(
  worker: any,
  event: any,
  requiredSkills: string[]
): Promise<WorkerScore> {
  // スキルマッチ度
  const workerSkills = worker.workerProfile?.skills?.map((s: any) => s.name) || []
  const skillMatch = calculateSkillMatch(workerSkills, requiredSkills)

  // 距離計算
  const workerLocation = worker.workerProfile?.workAreas?.[0] || '東京都'
  const eventLocation = event.site?.address || event.location || '東京都'
  const workerCoords = getDistrictCoordinates(workerLocation)
  const eventCoords = getDistrictCoordinates(eventLocation)
  
  let distance = 0
  if (workerCoords && eventCoords) {
    distance = calculateDistance(
      workerCoords.lat, workerCoords.lng,
      eventCoords.lat, eventCoords.lng
    )
  }
  // 距離スコア（0-50kmを0-1に正規化、近いほど高スコア）
  const distanceScore = Math.max(0, 1 - (distance / 50))

  // 負荷分散スコア
  const currentJobs = await getWorkerWorkload(worker.id, event.date)
  const maxDailyJobs = worker.workerProfile?.maxDailySlots || 3
  const workloadScore = Math.max(0, 1 - (currentJobs / maxDailyJobs))

  // 経験値スコア
  const completedJobs = worker.workerProfile?.completedJobs || 0
  const experienceScore = Math.min(1, completedJobs / 100)

  // 顧客評価スコア
  const rating = worker.workerProfile?.rating || 3
  const ratingScore = rating / 5

  // 総合スコア計算
  const totalScore = 
    skillMatch.score * WEIGHTS.SKILL_MATCH +
    distanceScore * WEIGHTS.DISTANCE +
    workloadScore * WEIGHTS.WORKLOAD_BALANCE +
    experienceScore * WEIGHTS.EXPERIENCE +
    ratingScore * WEIGHTS.CUSTOMER_RATING

  return {
    workerId: worker.id,
    workerName: worker.name,
    score: totalScore,
    factors: {
      skillMatch: skillMatch.score,
      distance: distanceScore,
      workloadBalance: workloadScore,
      experience: experienceScore,
      customerRating: ratingScore
    },
    details: {
      matchedSkills: skillMatch.matched,
      missingSkills: skillMatch.missing,
      distanceKm: Math.round(distance * 10) / 10,
      currentJobsToday: currentJobs,
      totalExperience: completedJobs,
      averageRating: rating
    }
  }
}

// メイン関数：スケジュール最適化提案
export async function generateScheduleSuggestions(
  eventId?: string,
  dateRange?: { from: Date; to: Date }
): Promise<ScheduleSuggestion[]> {
  // 未割り当てのイベントを取得
  const whereClause: any = {
    workerId: null,
    status: 'SCHEDULED'
  }

  if (eventId) {
    whereClause.id = eventId
  }

  if (dateRange) {
    whereClause.date = {
      gte: dateRange.from,
      lte: dateRange.to
    }
  } else {
    // デフォルト：今後7日間
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)
    whereClause.date = {
      gte: today,
      lte: nextWeek
    }
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    include: {
      site: true
    }
  })

  // 利用可能な職人を取得
  const workers = await prisma.user.findMany({
    where: {
      role: {
        in: ['WORKER', 'MASTER_WORKER']
      },
      isActive: true
    },
    include: {
      workerProfile: {
        include: {
          skills: true
        }
      }
    }
  })

  // 各イベントに対して職人をスコアリング
  const suggestions: ScheduleSuggestion[] = []

  for (const event of events) {
    // 作業タイプから必要スキルを取得
    const requiredSkills = REQUIRED_SKILLS[event.constructionType || ''] || []

    // 全職人をスコアリング
    const workerScores: WorkerScore[] = []
    for (const worker of workers) {
      const score = await scoreWorker(worker, event, requiredSkills)
      workerScores.push(score)
    }

    // スコア順にソート
    workerScores.sort((a, b) => b.score - a.score)

    // 自動割り当て候補（スコア0.7以上）
    const topCandidate = workerScores[0]
    const autoAssign = topCandidate && topCandidate.score >= 0.7
      ? {
          workerId: topCandidate.workerId,
          workerName: topCandidate.workerName,
          reason: generateAssignmentReason(topCandidate)
        }
      : undefined

    suggestions.push({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date.toISOString(),
      eventLocation: event.site?.address || '',
      requiredSkills,
      recommendations: workerScores.slice(0, 5), // 上位5名
      autoAssigned: autoAssign
    })
  }

  return suggestions
}

// 割り当て理由の生成
function generateAssignmentReason(score: WorkerScore): string {
  const reasons: string[] = []

  if (score.factors.skillMatch >= 0.8) {
    reasons.push(`必要スキル完全一致`)
  } else if (score.factors.skillMatch >= 0.5) {
    reasons.push(`主要スキル保有`)
  }

  if (score.factors.distance >= 0.8) {
    reasons.push(`現場まで${score.details.distanceKm}km`)
  }

  if (score.factors.workloadBalance >= 0.7) {
    reasons.push(`本日の稼働余裕あり`)
  }

  if (score.factors.customerRating >= 0.9) {
    reasons.push(`高評価(★${score.details.averageRating})`)
  }

  return reasons.join('、')
}

// 自動割り当て実行
export async function executeAutoAssignment(
  eventId: string,
  workerId: string
): Promise<boolean> {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { 
        workerId,
        status: 'SCHEDULED',
        updatedAt: new Date()
      }
    })

    // 通知を送信（通知システムと連携）
    // await notifyWorkerAssigned(workerId, eventTitle, location)

    return true
  } catch (error) {
    console.error('Auto assignment failed:', error)
    return false
  }
}