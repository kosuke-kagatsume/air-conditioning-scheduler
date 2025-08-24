import { NextRequest } from 'next/server'
import { pusherServer, CHANNELS, EVENTS } from '@/lib/pusher'
import { handleApiError, successResponse, validateRequestBody } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await validateRequestBody<{
      type: keyof typeof EVENTS
      title: string
      message: string
      severity: 'info' | 'warning' | 'error' | 'success'
      targetType: 'global' | 'company' | 'user' | 'workers' | 'admins'
      targetId?: string
      data?: any
    }>(request, ['type', 'title', 'message', 'severity', 'targetType'])

    // 通知データを構築
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: body.type,
      title: body.title,
      message: body.message,
      severity: body.severity,
      timestamp: new Date(),
      data: body.data,
      isRead: false,
    }

    // チャンネルを決定
    let channel: string
    switch (body.targetType) {
      case 'global':
        channel = CHANNELS.GLOBAL
        break
      case 'company':
        if (!body.targetId) throw new Error('Company ID is required')
        channel = CHANNELS.COMPANY(body.targetId)
        break
      case 'user':
        if (!body.targetId) throw new Error('User ID is required')
        channel = CHANNELS.USER(body.targetId)
        break
      case 'workers':
        channel = CHANNELS.WORKERS
        break
      case 'admins':
        channel = CHANNELS.ADMINS
        break
      default:
        throw new Error('Invalid target type')
    }

    // Pusherで通知を送信
    await pusherServer.trigger(channel, body.type, notification)

    // データベースに通知履歴を保存
    if (body.targetType === 'user' && body.targetId) {
      await prisma.notification.create({
        data: {
          userId: body.targetId,
          type: body.type as any,
          title: body.title,
          message: body.message,
          data: body.data || {},
          isRead: false,
        }
      })
    }

    return successResponse(
      { notification },
      '通知を送信しました'
    )
  } catch (error) {
    return handleApiError(error, '通知の送信に失敗しました')
  }
}

// 通知一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      throw new Error('User ID is required')
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      }
    })

    return successResponse({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit,
    })
  } catch (error) {
    return handleApiError(error, '通知の取得に失敗しました')
  }
}