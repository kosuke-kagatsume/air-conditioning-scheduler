import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getAuditLogs } from '@/lib/audit-log'

// ユーザー情報を取得する仮の関数（実際は認証から取得）
function getCurrentUser() {
  return {
    id: 'user-1',
    name: '山田太郎',
    tenantId: 'tenant-1',
    role: 'ADMIN', // 管理者のみ閲覧可能
  }
}

export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'audit.logs.fetch',
      name: 'GET /api/audit-logs',
      attributes: {
        'http.method': 'GET',
        'http.route': '/api/audit-logs',
      },
    },
    async () => {
      try {
        const user = getCurrentUser()

        // 権限チェック（管理者のみ閲覧可能）
        if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
          return NextResponse.json(
            {
              success: false,
              message: 'Unauthorized: Admin or Manager access required',
            },
            { status: 403 }
          )
        }

        // クエリパラメータの取得
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const action = searchParams.get('action')
        const entity = searchParams.get('entity')
        const entityId = searchParams.get('entityId')
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')

        // フィルター条件の構築
        const filters: any = {
          tenantId: user.tenantId, // 自テナントのログのみ取得
        }

        if (userId) filters.userId = userId
        if (action) filters.action = action
        if (entity) filters.entity = entity
        if (entityId) filters.entityId = entityId
        if (startDate) filters.startDate = new Date(startDate)
        if (endDate) filters.endDate = new Date(endDate)
        if (limit) filters.limit = parseInt(limit, 10)
        if (offset) filters.offset = parseInt(offset, 10)

        // 監査ログの取得
        const logs = await getAuditLogs(filters)

        // レスポンスの整形
        const formattedLogs = logs.map(log => ({
          id: log.id,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId,
          userId: log.userId,
          userName: log.userName,
          changes: log.metadata?.changes || null,
          ipAddress: log.metadata?.ipAddress || 'unknown',
          userAgent: log.metadata?.userAgent || 'unknown',
          timestamp: log.createdAt,
          before: log.before,
          after: log.after,
        }))

        // パフォーマンス測定
        Sentry.setMeasurement('audit_logs.count', logs.length, 'none')
        Sentry.setMeasurement('audit_logs.processing_time', Date.now(), 'millisecond')

        return NextResponse.json({
          success: true,
          data: formattedLogs,
          pagination: {
            total: logs.length,
            limit: filters.limit || 50,
            offset: filters.offset || 0,
          },
          filters: {
            userId,
            action,
            entity,
            entityId,
            startDate,
            endDate,
          },
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch audit logs',
          },
          { status: 500 }
        )
      }
    }
  )
}

// 統計情報の取得
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'audit.logs.stats',
      name: 'POST /api/audit-logs',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/audit-logs',
      },
    },
    async () => {
      try {
        const user = getCurrentUser()

        // 権限チェック
        if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
          return NextResponse.json(
            {
              success: false,
              message: 'Unauthorized: Admin or Manager access required',
            },
            { status: 403 }
          )
        }

        const body = await request.json()
        const { type = 'summary', period = '7d' } = body

        // 期間の計算
        const now = new Date()
        const startDate = new Date()
        switch (period) {
          case '24h':
            startDate.setHours(now.getHours() - 24)
            break
          case '7d':
            startDate.setDate(now.getDate() - 7)
            break
          case '30d':
            startDate.setDate(now.getDate() - 30)
            break
          case '90d':
            startDate.setDate(now.getDate() - 90)
            break
          default:
            startDate.setDate(now.getDate() - 7)
        }

        // 監査ログの取得
        const logs = await getAuditLogs({
          tenantId: user.tenantId,
          startDate,
          endDate: now,
        })

        if (type === 'summary') {
          // アクション別の集計
          const actionCounts: Record<string, number> = {}
          const userActivity: Record<string, number> = {}
          const entityCounts: Record<string, number> = {}

          logs.forEach(log => {
            // アクション別
            actionCounts[log.action] = (actionCounts[log.action] || 0) + 1

            // ユーザー別
            if (log.userId) {
              const key = `${log.userName || 'Unknown'} (${log.userId})`
              userActivity[key] = (userActivity[key] || 0) + 1
            }

            // エンティティ別
            entityCounts[log.entity] = (entityCounts[log.entity] || 0) + 1
          })

          // 最も活発なユーザー
          const topUsers = Object.entries(userActivity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([user, count]) => ({ user, count }))

          // 最も多いアクション
          const topActions = Object.entries(actionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([action, count]) => ({ action, count }))

          return NextResponse.json({
            success: true,
            data: {
              period,
              totalLogs: logs.length,
              actionCounts,
              entityCounts,
              topUsers,
              topActions,
              dailyActivity: calculateDailyActivity(logs),
            },
          })
        } else if (type === 'timeline') {
          // タイムライン形式でグループ化
          const timeline = logs.reduce((acc, log) => {
            const date = log.createdAt.toISOString().split('T')[0]
            if (!acc[date]) {
              acc[date] = []
            }
            acc[date].push({
              time: log.createdAt.toISOString(),
              action: log.action,
              entity: log.entity,
              entityId: log.entityId,
              user: log.userName || log.userId || 'System',
              summary: generateSummary(log),
            })
            return acc
          }, {} as Record<string, any[]>)

          return NextResponse.json({
            success: true,
            data: {
              period,
              timeline,
            },
          })
        }

        return NextResponse.json({
          success: true,
          data: logs,
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch audit log statistics',
          },
          { status: 500 }
        )
      }
    }
  )
}

// 日別アクティビティの計算
function calculateDailyActivity(logs: any[]) {
  const activity: Record<string, number> = {}

  logs.forEach(log => {
    const date = log.createdAt.toISOString().split('T')[0]
    activity[date] = (activity[date] || 0) + 1
  })

  return Object.entries(activity)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))
}

// ログサマリーの生成
function generateSummary(log: any): string {
  const action = log.action
  const entity = log.entity
  const userName = log.userName || log.userId || 'System'

  switch (action) {
    case 'event.create':
      return `${userName}が新しい${entity}を作成しました`
    case 'event.update':
      return `${userName}が${entity}を更新しました`
    case 'event.delete':
      return `${userName}が${entity}を削除しました`
    case 'event.assign':
      return `${userName}が${entity}に職人を割り当てました`
    case 'assignee.change':
      return `${userName}が${entity}の担当者を変更しました`
    case 'worker.assign':
      return `${userName}が職人を割り当てました`
    case 'worker.remove':
      return `${userName}が職人の割当を解除しました`
    case 'login':
      return `${userName}がログインしました`
    case 'logout':
      return `${userName}がログアウトしました`
    default:
      return `${userName}が${action}を実行しました`
  }
}