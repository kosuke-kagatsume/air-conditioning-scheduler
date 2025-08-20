import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { mockEvents } from '@/lib/mockData'

// TODO: Prismaクライアントが利用可能になったら以下のコードを有効化
// import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/schedule',
      attributes: {
        'http.method': 'GET',
        'http.route': '/api/schedule',
      },
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get('from')
        const to = searchParams.get('to')
        const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? '200'), 1), 200)

        // 現在はモックデータを使用
        let events = Array.isArray(mockEvents) ? mockEvents : Object.values(mockEvents)

        // 日付フィルタリング
        if (from || to) {
          events = events.filter((event: any) => {
            const eventDate = event.date
            
            let include = true
            
            if (from) {
              include = include && eventDate >= from
            }
            
            if (to) {
              include = include && eventDate <= to
            }
            
            return include
          })
        }

        // 日付順でソート
        events.sort((a: any, b: any) => {
          const dateA = new Date(a.date + 'T' + a.startTime)
          const dateB = new Date(b.date + 'T' + b.startTime)
          return dateA.getTime() - dateB.getTime()
        })

        // 制限適用
        events = events.slice(0, limit)

        // レスポンス形式を統一
        const items = events.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.date + 'T' + event.startTime).toISOString(),
          end: new Date(event.date + 'T' + (event.endTime || event.startTime)).toISOString(),
          workerId: event.workerId,
          status: event.status,
          siteId: event.id.split('-')[0], // イベントIDから仮のサイトIDを生成
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
        }))

        // パフォーマンス測定
        Sentry.setMeasurement('schedule.events.count', items.length, 'none')

        return NextResponse.json({
          success: true,
          items,
          pagination: {
            total: items.length,
            limit,
            from,
            to,
          },
        })

        /* TODO: Prismaを使用する場合の実装
        const where: any = {
          // テナント分離（将来実装）
          // companyId: getCurrentUser().tenantId
        }

        if (from || to) {
          where.AND = [
            from ? { 
              OR: [
                { date: { gte: new Date(from) } },
                { 
                  date: { equals: new Date(from).toISOString().split('T')[0] },
                  endTime: { gte: new Date(from).toTimeString().slice(0, 5) }
                }
              ]
            } : {},
            to ? { 
              OR: [
                { date: { lte: new Date(to) } },
                {
                  date: { equals: new Date(to).toISOString().split('T')[0] },
                  startTime: { lte: new Date(to).toTimeString().slice(0, 5) }
                }
              ]
            } : {},
          ].filter(condition => Object.keys(condition).length > 0)
        }

        const events = await prisma.event.findMany({
          where,
          orderBy: [
            { date: 'asc' },
            { startTime: 'asc' }
          ],
          take: limit,
          include: {
            site: {
              select: { id: true, name: true }
            },
            assignedWorker: {
              select: { id: true, name: true }
            }
          },
        })

        const items = events.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.date.toISOString().split('T')[0] + 'T' + event.startTime).toISOString(),
          end: new Date(event.date.toISOString().split('T')[0] + 'T' + (event.endTime || event.startTime)).toISOString(),
          workerId: event.workerId,
          workerName: event.assignedWorker?.name,
          status: event.status,
          siteId: event.siteId,
          siteName: event.site?.name,
          constructionType: event.constructionType,
          estimatedHours: event.estimatedHours,
          notes: event.notes,
        }))

        return NextResponse.json({
          success: true,
          items,
          pagination: {
            total: items.length,
            limit,
            from,
            to,
          },
        })
        */
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch schedule events',
          },
          { status: 500 }
        )
      }
    }
  )
}

// スケジュール作成エンドポイント（将来実装）
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/schedule',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/schedule',
      },
    },
    async () => {
      try {
        const body = await request.json()
        
        // TODO: Prismaを使用してイベント作成
        // const event = await prisma.event.create({ data: body })
        
        return NextResponse.json(
          {
            success: false,
            message: 'Event creation not implemented yet',
          },
          { status: 501 }
        )
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create schedule event',
          },
          { status: 500 }
        )
      }
    }
  )
}