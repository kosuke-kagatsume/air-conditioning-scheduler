import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// サーバーサイド用Pusher
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'demo-app-id',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'demo-key',
  secret: process.env.PUSHER_SECRET || 'demo-secret',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap3',
  useTLS: true,
})

// クライアントサイド用Pusher
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || 'demo-key',
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap3',
  }
)

// 通知チャンネル定義
export const CHANNELS = {
  // 全体通知
  GLOBAL: 'global-notifications',
  // 会社別通知
  COMPANY: (companyId: string) => `company-${companyId}`,
  // ユーザー個別通知
  USER: (userId: string) => `user-${userId}`,
  // 職人グループ通知
  WORKERS: 'workers-notifications',
  // 管理者グループ通知
  ADMINS: 'admins-notifications',
} as const

// イベントタイプ定義
export const EVENTS = {
  // スケジュール関連
  SCHEDULE_CREATED: 'schedule:created',
  SCHEDULE_UPDATED: 'schedule:updated',
  SCHEDULE_CANCELLED: 'schedule:cancelled',
  SCHEDULE_REMINDER: 'schedule:reminder',
  
  // 職人関連
  WORKER_ASSIGNED: 'worker:assigned',
  WORKER_CHECK_IN: 'worker:check-in',
  WORKER_CHECK_OUT: 'worker:check-out',
  WORKER_SOS: 'worker:sos',
  
  // 問題報告
  PROBLEM_REPORTED: 'problem:reported',
  PROBLEM_RESOLVED: 'problem:resolved',
  
  // システム通知
  SYSTEM_MAINTENANCE: 'system:maintenance',
  SYSTEM_UPDATE: 'system:update',
} as const

// 通知タイプ定義
export interface Notification {
  id: string
  type: keyof typeof EVENTS
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  data?: any
  actionUrl?: string
  isRead?: boolean
}