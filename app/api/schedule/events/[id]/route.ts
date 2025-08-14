import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createAuditLog, calculateDiff } from '@/lib/audit-log'
import { checkScheduleConflict, reportConflictToSentry } from '@/lib/conflict-detection'
import { mockEvents, mockUsers } from '@/lib/mock-data'
import { sendScheduleNotification, generateEventUpdateEmailHtml } from '@/lib/email-notifications'

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

        // メール通知を送信（非同期、失敗してもメインの処理は継続）
        const changes = calculateDiff(beforeData, updatedEvent)
        if (Object.keys(changes).length > 0) {
          // 担当者のメールアドレスを取得（実際はDBから取得）
          const workerInfo = mockUsers[updatedEvent.workerId] || mockUsers['worker-1']
          const workerEmail = `${workerInfo.name.replace(/\s+/g, '')}@example.com`

          const emailHtml = generateEventUpdateEmailHtml({
            eventTitle: updatedEvent.title,
            eventDate: updatedEvent.date,
            eventTime: `${updatedEvent.startTime} - ${updatedEvent.endTime}`,
            workerName: workerInfo.name,
            siteName: `現場${updatedEvent.siteId}`, // 実際はサイト情報から取得
            changes,
            updatedBy: user.name,
          })

          // 非同期でメール送信（エラーは記録するが処理は継続）
          sendScheduleNotification({
            to: workerEmail,
            subject: `【HVAC Scheduler】スケジュール変更通知 - ${updatedEvent.title}`,
            html: emailHtml,
            eventId: eventId,
            eventType: 'schedule.update',
          }).catch(error => {
            console.error('Failed to send email notification:', error)
            Sentry.captureException(error, {
              tags: { component: 'email-notification' },
              extra: { eventId, workerEmail },
            })
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