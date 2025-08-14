import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createAuditLog, calculateDiff } from '@/lib/audit-log'
import { checkScheduleConflict, reportConflictToSentry } from '@/lib/conflict-detection'
import { mockEvents } from '@/lib/mock-data'

// ユーザー情報を取得する仮の関数（実際は認証から取得）
function getCurrentUser() {
  return {
    id: 'user-1',
    name: '山田太郎',
    tenantId: 'tenant-1',
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'PATCH /api/schedule/events/[id]',
      attributes: {
        'http.method': 'PATCH',
        'http.route': '/api/schedule/events/[id]',
        'event.id': params.id,
      },
    },
    async () => {
      try {
        const eventId = params.id
        const updates = await request.json()
        const user = getCurrentUser()

        // 既存のイベントを取得
        const existingEvent = mockEvents[eventId]
        if (!existingEvent) {
          return NextResponse.json(
            { success: false, message: 'Event not found' },
            { status: 404 }
          )
        }

        // 衝突検知: 同一職人の時間重複をチェック
        if (updates.workerId || updates.date || updates.startTime || updates.endTime) {
          const targetWorkerId = updates.workerId || existingEvent.workerId
          const targetDate = updates.date || existingEvent.date
          const targetStartTime = updates.startTime || existingEvent.startTime
          const targetEndTime = updates.endTime || existingEvent.endTime

          const conflictResult = checkScheduleConflict(
            mockEvents,
            eventId,
            targetWorkerId,
            targetDate,
            targetStartTime,
            targetEndTime
          )

          if (conflictResult.hasConflict) {
            const conflict = conflictResult.conflictingEvents[0]
            
            // Sentryに衝突情報を送信
            reportConflictToSentry(eventId, targetWorkerId, conflictResult, {
              date: targetDate,
              startTime: targetStartTime,
              endTime: targetEndTime,
            })

            return NextResponse.json(
              { 
                success: false, 
                error: 'Schedule conflict detected',
                message: conflictResult.message,
                conflictingEvent: {
                  id: conflict.id,
                  title: conflict.title,
                  date: conflict.date,
                  startTime: conflict.startTime,
                  endTime: conflict.endTime,
                }
              },
              { status: 409 }
            )
          }
        }

        // 更新前のデータを保存
        const beforeData = { ...existingEvent }

        // イベントを更新
        const updatedEvent = {
          ...existingEvent,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        mockEvents[eventId] = updatedEvent

        // 監査ログを記録
        await createAuditLog({
          tenantId: user.tenantId,
          userId: user.id,
          userName: user.name,
          action: 'event.update',
          entity: 'ScheduleEvent',
          entityId: eventId,
          before: beforeData,
          after: updatedEvent,
          metadata: {
            changes: calculateDiff(beforeData, updatedEvent),
            updateFields: Object.keys(updates),
          },
        })

        // 職人割当が変更された場合の追加ログ
        if (updates.workerId && updates.workerId !== existingEvent.workerId) {
          await createAuditLog({
            tenantId: user.tenantId,
            userId: user.id,
            userName: user.name,
            action: 'assignee.change',
            entity: 'ScheduleEvent',
            entityId: eventId,
            before: { workerId: existingEvent.workerId },
            after: { workerId: updates.workerId },
            metadata: {
              previousWorker: existingEvent.workerId,
              newWorker: updates.workerId,
            },
          })

          // Sentryにカスタムイベント送信
          Sentry.captureMessage('Worker assignment changed', {
            level: 'info',
            tags: {
              action: 'assignee.change',
              eventId: eventId,
            },
          })
        }

        return NextResponse.json({
          success: true,
          data: updatedEvent,
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          { success: false, message: 'Failed to update event' },
          { status: 500 }
        )
      }
    }
  )
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'DELETE /api/schedule/events/[id]',
      attributes: {
        'http.method': 'DELETE',
        'http.route': '/api/schedule/events/[id]',
        'event.id': params.id,
      },
    },
    async () => {
      try {
        const eventId = params.id
        const user = getCurrentUser()

        // 既存のイベントを取得
        const existingEvent = mockEvents[eventId]
        if (!existingEvent) {
          return NextResponse.json(
            { success: false, message: 'Event not found' },
            { status: 404 }
          )
        }

        // イベントを削除
        delete mockEvents[eventId]

        // 監査ログを記録
        await createAuditLog({
          tenantId: user.tenantId,
          userId: user.id,
          userName: user.name,
          action: 'event.delete',
          entity: 'ScheduleEvent',
          entityId: eventId,
          before: existingEvent,
          after: null,
          metadata: {
            deletedAt: new Date().toISOString(),
            reason: request.headers.get('X-Delete-Reason') || 'Not specified',
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Event deleted successfully',
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          { success: false, message: 'Failed to delete event' },
          { status: 500 }
        )
      }
    }
  )
}