import { headers } from 'next/headers'
import * as Sentry from '@sentry/nextjs'

export type AuditAction = 
  | 'event.create'
  | 'event.update'
  | 'event.delete'
  | 'event.assign'
  | 'assignee.change'
  | 'schedule.update'
  | 'worker.assign'
  | 'worker.remove'
  | 'site.create'
  | 'site.update'
  | 'site.delete'
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'login'
  | 'logout'

export interface AuditLogEntry {
  tenantId: string
  userId?: string | null
  userName?: string | null
  action: AuditAction
  entity: string
  entityId: string
  before?: any
  after?: any
  metadata?: {
    ipAddress?: string
    userAgent?: string
    requestId?: string
    [key: string]: any
  }
}

// 仮のメモリストレージ（本番環境ではPrismaを使用）
const auditLogs: Array<AuditLogEntry & { id: string; createdAt: Date }> = []

/**
 * 監査ログを記録する
 */
export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    // リクエストヘッダーからメタデータを取得
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'
    
    // メタデータを拡張
    const enrichedEntry = {
      ...entry,
      metadata: {
        ...entry.metadata,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
      }
    }

    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Audit Log:', {
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        userId: entry.userId,
        userName: entry.userName,
      })
    }

    // 仮のストレージに保存（本番環境ではPrismaを使用）
    const logEntry = {
      ...enrichedEntry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    auditLogs.push(logEntry)

    // Sentryにカスタムイベントとして送信（重要なアクションのみ）
    if (['event.delete', 'user.delete', 'assignee.change'].includes(entry.action)) {
      Sentry.captureMessage(`Audit: ${entry.action}`, {
        level: 'info',
        tags: {
          audit_action: entry.action,
          entity: entry.entity,
          tenant_id: entry.tenantId,
        },
        extra: {
          entityId: entry.entityId,
          userId: entry.userId,
          userName: entry.userName,
          metadata: enrichedEntry.metadata,
        },
      })
    }

    // TODO: 本番環境では以下のようにPrismaを使用
    // await prisma.auditLog.create({
    //   data: enrichedEntry
    // })
  } catch (error) {
    // 監査ログの記録に失敗してもメイン処理は継続
    console.error('Failed to create audit log:', error)
    Sentry.captureException(error, {
      tags: { component: 'audit-log' },
    })
  }
}

/**
 * 監査ログを取得する
 */
export async function getAuditLogs(filters?: {
  tenantId?: string
  userId?: string
  action?: AuditAction
  entity?: string
  entityId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}): Promise<Array<AuditLogEntry & { id: string; createdAt: Date }>> {
  // 仮の実装（本番環境ではPrismaクエリを使用）
  let filtered = [...auditLogs]

  if (filters?.tenantId) {
    filtered = filtered.filter(log => log.tenantId === filters.tenantId)
  }
  if (filters?.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId)
  }
  if (filters?.action) {
    filtered = filtered.filter(log => log.action === filters.action)
  }
  if (filters?.entity) {
    filtered = filtered.filter(log => log.entity === filters.entity)
  }
  if (filters?.entityId) {
    filtered = filtered.filter(log => log.entityId === filters.entityId)
  }
  if (filters?.startDate) {
    filtered = filtered.filter(log => log.createdAt >= filters.startDate!)
  }
  if (filters?.endDate) {
    filtered = filtered.filter(log => log.createdAt <= filters.endDate!)
  }

  // ソート（新しい順）
  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // ページネーション
  const offset = filters?.offset || 0
  const limit = filters?.limit || 50
  return filtered.slice(offset, offset + limit)

  // TODO: 本番環境では以下のようにPrismaを使用
  // return await prisma.auditLog.findMany({
  //   where: {
  //     tenantId: filters?.tenantId,
  //     userId: filters?.userId,
  //     action: filters?.action,
  //     entity: filters?.entity,
  //     entityId: filters?.entityId,
  //     createdAt: {
  //       gte: filters?.startDate,
  //       lte: filters?.endDate,
  //     },
  //   },
  //   orderBy: { createdAt: 'desc' },
  //   take: filters?.limit || 50,
  //   skip: filters?.offset || 0,
  // })
}

/**
 * 変更の差分を計算する
 */
export function calculateDiff(before: any, after: any): Record<string, { before: any; after: any }> {
  const diff: Record<string, { before: any; after: any }> = {}
  
  // 全てのキーを取得
  const allKeys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {})
  ])

  allKeys.forEach(key => {
    const beforeValue = before?.[key]
    const afterValue = after?.[key]
    
    // 値が異なる場合のみ差分として記録
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      diff[key] = {
        before: beforeValue,
        after: afterValue,
      }
    }
  })

  return diff
}