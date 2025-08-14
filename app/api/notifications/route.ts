import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

// メモリストレージ（実際の実装ではデータベースを使用）
let notificationsStore: any[] = []

export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/notifications',
      attributes: {
        'http.method': 'GET',
        'http.route': '/api/notifications',
      },
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') || 'all'
        const limit = Math.min(Math.max(Number(searchParams.get('limit') || '50'), 1), 100)
        const offset = Math.max(Number(searchParams.get('offset') || '0'), 0)

        // フィルタリング
        let filtered = [...notificationsStore]
        if (filter === 'unread') {
          filtered = filtered.filter(n => !n.read)
        }

        // ソート（新しい順）
        filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        // ページネーション
        const total = filtered.length
        const items = filtered.slice(offset, offset + limit)

        return NextResponse.json({
          success: true,
          items,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch notifications',
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
      name: 'POST /api/notifications',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/notifications',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { type, title, message, priority = 'normal', relatedEventId, actionUrl, metadata } = body

        // 入力検証
        if (!type || !title || !message) {
          return NextResponse.json(
            {
              success: false,
              message: 'Missing required fields: type, title, message',
            },
            { status: 400 }
          )
        }

        // 通知を作成
        const notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          title,
          message,
          priority,
          read: false,
          createdAt: new Date().toISOString(),
          relatedEventId,
          actionUrl,
          metadata
        }

        // ストアに追加
        notificationsStore.unshift(notification)

        // 最大1000件まで保持
        if (notificationsStore.length > 1000) {
          notificationsStore = notificationsStore.slice(0, 1000)
        }

        // Sentryにログ
        Sentry.captureMessage('Notification created', {
          level: 'info',
          tags: {
            action: 'notification.created',
            type: notification.type,
            priority: notification.priority
          },
          extra: {
            notificationId: notification.id,
            title: notification.title
          }
        })

        return NextResponse.json({
          success: true,
          data: notification
        }, { status: 201 })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create notification',
          },
          { status: 500 }
        )
      }
    }
  )
}

export async function PATCH(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'PATCH /api/notifications',
      attributes: {
        'http.method': 'PATCH',
        'http.route': '/api/notifications',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { action, notificationId, notificationIds } = body

        switch (action) {
          case 'mark-read':
            if (notificationId) {
              const notification = notificationsStore.find(n => n.id === notificationId)
              if (notification) {
                notification.read = true
              }
            }
            break

          case 'mark-all-read':
            notificationsStore.forEach(n => {
              n.read = true
            })
            break

          case 'mark-multiple-read':
            if (notificationIds && Array.isArray(notificationIds)) {
              notificationsStore.forEach(n => {
                if (notificationIds.includes(n.id)) {
                  n.read = true
                }
              })
            }
            break

          default:
            return NextResponse.json(
              {
                success: false,
                message: 'Invalid action',
              },
              { status: 400 }
            )
        }

        return NextResponse.json({
          success: true,
          message: 'Notifications updated'
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to update notifications',
          },
          { status: 500 }
        )
      }
    }
  )
}

export async function DELETE(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'DELETE /api/notifications',
      attributes: {
        'http.method': 'DELETE',
        'http.route': '/api/notifications',
      },
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const notificationId = searchParams.get('id')
        const clearAll = searchParams.get('clearAll') === 'true'

        if (clearAll) {
          notificationsStore = []
          return NextResponse.json({
            success: true,
            message: 'All notifications cleared'
          })
        }

        if (notificationId) {
          notificationsStore = notificationsStore.filter(n => n.id !== notificationId)
          return NextResponse.json({
            success: true,
            message: 'Notification deleted'
          })
        }

        return NextResponse.json(
          {
            success: false,
            message: 'No notification ID provided',
          },
          { status: 400 }
        )
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to delete notification',
          },
          { status: 500 }
        )
      }
    }
  )
}