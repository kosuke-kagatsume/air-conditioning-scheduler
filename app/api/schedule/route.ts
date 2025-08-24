import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { mockEvents } from '@/lib/mockData'

import { prisma } from "@/lib/prisma";

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

        // データベースからイベントを取得
        try {
          const whereClause: any = {}
          
          // 日付範囲フィルタリング
          if (from || to) {
            whereClause.date = {}
            if (from) whereClause.date.gte = new Date(from)
            if (to) whereClause.date.lte = new Date(to)
          }

          const events = await prisma.event.findMany({
            where: whereClause,
            include: {
              site: {
                select: { id: true, name: true, address: true, clientName: true }
              },
              assignedWorker: {
                select: { id: true, name: true }
              }
            },
            orderBy: [
              { date: 'asc' },
              { startTime: 'asc' }
            ],
            take: limit
          })

          const items = events.map(event => ({
            id: event.id,
            title: event.title,
            start: new Date(event.date.toISOString().split('T')[0] + 'T' + event.startTime).toISOString(),
            end: new Date(event.date.toISOString().split('T')[0] + 'T' + (event.endTime || event.startTime)).toISOString(),
            workerId: event.workerId,
            workerName: event.assignedWorker?.name,
            status: event.status.toLowerCase(),
            siteId: event.siteId,
            siteName: event.site?.name,
            address: event.site?.address,
            clientName: event.site?.clientName,
            constructionType: event.constructionType,
            date: event.date.toISOString().split('T')[0],
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
        } catch (dbError) {
          console.error('Database error, falling back to mock data:', dbError)
          
          // フォールバック：モックデータを使用
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
          const mockItems = events.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.date + 'T' + event.startTime).toISOString(),
            end: new Date(event.date + 'T' + (event.endTime || event.startTime)).toISOString(),
            workerId: event.workerId,
            status: event.status,
            siteId: event.id.split('-')[0],
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
          }))

          return NextResponse.json({
            success: true,
            items: mockItems,
            pagination: {
              total: mockItems.length,
              limit,
              from,
              to,
            },
          })
        }

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
        
        // 必須フィールドの検証
        if (!body.title || !body.date || !body.startTime) {
          return NextResponse.json(
            { success: false, message: '必須フィールドが不足しています' },
            { status: 400 }
          )
        }

        // Prismaを使用してデータベースに保存
        try {
          // まずサイトを作成または取得
          let site = await prisma.site.findFirst({
            where: { address: body.address }
          })

          if (!site) {
            site = await prisma.site.create({
              data: {
                name: body.clientName || '新規現場',
                address: body.address || '住所未設定',
                city: body.city || '未設定',
                prefecture: '東京都', // デフォルト
                clientName: body.clientName || '顧客名未設定',
                clientPhone: body.clientPhone,
                companyId: 'company-1' // デフォルト会社ID（シードデータから）
              }
            })
          }

          // イベントを作成
          const event = await prisma.event.create({
            data: {
              title: body.title,
              description: body.description,
              date: new Date(body.date),
              startTime: body.startTime,
              endTime: body.endTime,
              status: 'PROPOSED',
              constructionType: body.constructionType || '空調工事',
              siteId: site.id,
              companyId: 'company-1',
              workerId: body.workerId || null,
              estimatedHours: body.estimatedHours,
              notes: body.notes
            },
            include: {
              site: true,
              assignedWorker: true
            }
          })

          return NextResponse.json({
            success: true,
            event: {
              id: event.id,
              title: event.title,
              date: event.date.toISOString().split('T')[0],
              startTime: event.startTime,
              endTime: event.endTime,
              status: event.status,
              address: event.site.address,
              city: event.site.city,
              constructionType: event.constructionType,
              clientName: event.site.clientName,
              workerId: event.workerId,
              workerName: event.assignedWorker?.name
            }
          })
        } catch (dbError) {
          console.error('Database error:', dbError)
          // データベースエラーの場合はフォールバック処理
          return NextResponse.json({
            success: true,
            event: {
              id: `event-${Date.now()}`,
              title: body.title,
              date: body.date,
              startTime: body.startTime,
              endTime: body.endTime,
              status: 'proposed',
              address: body.address,
              city: body.city,
              constructionType: body.constructionType,
              clientName: body.clientName,
              workerId: body.workerId
            }
          })
        }

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