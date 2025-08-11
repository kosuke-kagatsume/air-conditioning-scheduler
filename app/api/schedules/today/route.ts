import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cache, CacheTTL } from '@/lib/cache/redis'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
  // レート制限チェック
  const rateLimitResponse = await rateLimitMiddleware(req)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const userId = req.headers.get('x-user-id')
    const today = new Date()
    const cacheKey = `schedules:today:${userId || 'all'}:${today.toDateString()}`

    // キャッシュから取得を試みる
    const cachedSchedules = await cache.get(cacheKey)
    if (cachedSchedules) {
      return NextResponse.json(cachedSchedules, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        }
      })
    }

    // データベースから取得
    const schedules = await prisma.event.findMany({
      where: {
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        ...(userId && { workerId: userId })
      },
      include: {
        project: {
          select: {
            name: true,
            location: true,
            company: {
              select: { name: true }
            }
          }
        },
        manager: {
          select: { name: true, email: true }
        },
        worker: {
          select: { name: true, email: true }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    // キャッシュに保存（1分間）
    await cache.set(cacheKey, schedules, CacheTTL.SHORT)

    return NextResponse.json(schedules, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      }
    })
  } catch (error) {
    console.error('Error fetching today schedules:', error)
    
    // エラー時はフォールバック
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  // レート制限チェック
  const rateLimitResponse = await rateLimitMiddleware(req)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await req.json()
    const userId = req.headers.get('x-user-id')

    // 新しいスケジュールを作成
    const schedule = await prisma.event.create({
      data: {
        ...body,
        managerId: userId || body.managerId,
      },
      include: {
        project: true,
        manager: true,
        worker: true,
      }
    })

    // 関連するキャッシュを無効化
    await cache.invalidatePattern(`schedules:*`)

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}