import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createAuditLog } from '@/lib/audit-log'

// ユーザー情報を取得する仮の関数（実際は認証から取得）
function getCurrentUser() {
  return {
    id: 'user-1',
    name: '山田太郎',
    tenantId: 'tenant-1',
  }
}

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'dispatch.worker.assign',
      name: 'POST /api/schedule/assign',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/schedule/assign',
        'dispatch.type': 'worker.assign',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { eventId, workerId, workerName, startTime, endTime, notes } = body
        const user = getCurrentUser()

        // 入力検証
        if (!eventId || !workerId) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'Event ID and Worker ID are required' 
            },
            { status: 400 }
          )
        }

        // 割当データの作成
        const assignment = {
          id: `assign-${Date.now()}`,
          eventId,
          workerId,
          workerName: workerName || `Worker ${workerId}`,
          startTime: startTime || '09:00',
          endTime: endTime || '17:00',
          notes: notes || '',
          assignedBy: user.id,
          assignedAt: new Date().toISOString(),
          status: 'ASSIGNED',
        }

        // 監査ログを記録
        await createAuditLog({
          tenantId: user.tenantId,
          userId: user.id,
          userName: user.name,
          action: 'event.assign',
          entity: 'ScheduleEvent',
          entityId: eventId,
          before: null,
          after: assignment,
          metadata: {
            workerId,
            workerName: workerName || `Worker ${workerId}`,
            assignmentId: assignment.id,
            startTime: assignment.startTime,
            endTime: assignment.endTime,
            notes: assignment.notes,
          },
        })

        // パフォーマンス測定
        Sentry.setMeasurement('assignment.processing_time', Date.now(), 'millisecond')
        
        // カスタムイベントをSentryに送信
        Sentry.captureMessage('Worker assigned to event', {
          level: 'info',
          tags: {
            action: 'worker.assign',
            eventId: eventId,
            workerId: workerId,
          },
          extra: {
            assignment,
          },
        })

        return NextResponse.json({
          success: true,
          data: assignment,
          message: 'Worker assigned successfully',
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to assign worker' 
          },
          { status: 500 }
        )
      }
    }
  )
}

// 割当解除のエンドポイント
export async function DELETE(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'dispatch.worker.unassign',
      name: 'DELETE /api/schedule/assign',
      attributes: {
        'http.method': 'DELETE',
        'http.route': '/api/schedule/assign',
        'dispatch.type': 'worker.unassign',
      },
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')
        const workerId = searchParams.get('workerId')
        const user = getCurrentUser()

        if (!eventId || !workerId) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'Event ID and Worker ID are required' 
            },
            { status: 400 }
          )
        }

        // 割当解除の記録
        const unassignment = {
          eventId,
          workerId,
          unassignedBy: user.id,
          unassignedAt: new Date().toISOString(),
          reason: searchParams.get('reason') || 'Not specified',
        }

        // 監査ログを記録
        await createAuditLog({
          tenantId: user.tenantId,
          userId: user.id,
          userName: user.name,
          action: 'worker.remove',
          entity: 'ScheduleEvent',
          entityId: eventId,
          before: { workerId, status: 'ASSIGNED' },
          after: { workerId: null, status: 'UNASSIGNED' },
          metadata: {
            workerId,
            reason: unassignment.reason,
            unassignedAt: unassignment.unassignedAt,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Worker unassigned successfully',
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to unassign worker' 
          },
          { status: 500 }
        )
      }
    }
  )
}