import * as Sentry from '@sentry/nextjs'

// 通知の型定義
export interface Notification {
  id: string
  type: 'schedule_created' | 'schedule_updated' | 'schedule_cancelled' | 'worker_assigned' | 'worker_removed' | 'reminder' | 'system'
  title: string
  message: string
  priority: 'high' | 'normal' | 'low'
  read: boolean
  createdAt: string
  relatedEventId?: string
  actionUrl?: string
  icon?: 'calendar' | 'user' | 'alert' | 'check' | 'info'
  metadata?: Record<string, any>
}

// 通知のカテゴリ色とアイコン
export const notificationConfig = {
  schedule_created: {
    icon: 'calendar' as const,
    color: '#3b82f6',
    defaultPriority: 'normal' as const
  },
  schedule_updated: {
    icon: 'calendar' as const,
    color: '#f59e0b',
    defaultPriority: 'normal' as const
  },
  schedule_cancelled: {
    icon: 'alert' as const,
    color: '#ef4444',
    defaultPriority: 'high' as const
  },
  worker_assigned: {
    icon: 'user' as const,
    color: '#22c55e',
    defaultPriority: 'normal' as const
  },
  worker_removed: {
    icon: 'user' as const,
    color: '#dc2626',
    defaultPriority: 'high' as const
  },
  reminder: {
    icon: 'info' as const,
    color: '#6366f1',
    defaultPriority: 'normal' as const
  },
  system: {
    icon: 'info' as const,
    color: '#6b7280',
    defaultPriority: 'low' as const
  }
}

// ローカルストレージのキー
const NOTIFICATIONS_KEY = 'hvac_notifications'
const NOTIFICATION_SETTINGS_KEY = 'hvac_notification_settings'

// 通知設定の型
export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
  emailDigest: boolean
  types: {
    [key in Notification['type']]?: boolean
  }
}

// デフォルト設定
const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  desktop: false,
  emailDigest: true,
  types: {
    schedule_created: true,
    schedule_updated: true,
    schedule_cancelled: true,
    worker_assigned: true,
    worker_removed: true,
    reminder: true,
    system: true
  }
}

/**
 * 通知を取得
 */
export function getNotifications(): Notification[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    if (!stored) return []
    
    const notifications: Notification[] = JSON.parse(stored)
    // 日付でソート（新しい順）
    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('Failed to get notifications:', error)
    return []
  }
}

/**
 * 未読通知数を取得
 */
export function getUnreadCount(): number {
  const notifications = getNotifications()
  return notifications.filter(n => !n.read).length
}

/**
 * 通知を追加
 */
export function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    read: false
  }
  
  try {
    const notifications = getNotifications()
    notifications.unshift(newNotification)
    
    // 最大100件まで保持
    const trimmed = notifications.slice(0, 100)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed))
    
    // デスクトップ通知を表示
    if (shouldShowDesktopNotification(newNotification.type)) {
      showDesktopNotification(newNotification)
    }
    
    // サウンドを再生
    if (shouldPlaySound()) {
      playNotificationSound()
    }
    
    // カスタムイベントを発火（リアルタイム更新用）
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-added', {
        detail: newNotification
      }))
    }
    
    return newNotification
  } catch (error) {
    console.error('Failed to add notification:', error)
    Sentry.captureException(error)
    return newNotification
  }
}

/**
 * 通知を既読にする
 */
export function markAsRead(notificationId: string): void {
  try {
    const notifications = getNotifications()
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
    
    // カスタムイベントを発火
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-read', {
        detail: { notificationId }
      }))
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

/**
 * すべての通知を既読にする
 */
export function markAllAsRead(): void {
  try {
    const notifications = getNotifications()
    const updated = notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
    
    // カスタムイベントを発火
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('all-notifications-read'))
    }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

/**
 * 通知を削除
 */
export function deleteNotification(notificationId: string): void {
  try {
    const notifications = getNotifications()
    const filtered = notifications.filter(n => n.id !== notificationId)
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered))
    
    // カスタムイベントを発火
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('notification-deleted', {
        detail: { notificationId }
      }))
    }
  } catch (error) {
    console.error('Failed to delete notification:', error)
  }
}

/**
 * すべての通知をクリア
 */
export function clearAllNotifications(): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]))
    
    // カスタムイベントを発火
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('all-notifications-cleared'))
    }
  } catch (error) {
    console.error('Failed to clear notifications:', error)
  }
}

/**
 * 通知設定を取得
 */
export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return defaultSettings
  
  try {
    const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    if (!stored) return defaultSettings
    
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch (error) {
    console.error('Failed to get notification settings:', error)
    return defaultSettings
  }
}

/**
 * 通知設定を更新
 */
export function updateNotificationSettings(settings: Partial<NotificationSettings>): void {
  try {
    const current = getNotificationSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to update notification settings:', error)
  }
}

/**
 * デスクトップ通知を表示すべきか判定
 */
function shouldShowDesktopNotification(type: Notification['type']): boolean {
  const settings = getNotificationSettings()
  return settings.enabled && settings.desktop && (settings.types[type] ?? true)
}

/**
 * サウンドを再生すべきか判定
 */
function shouldPlaySound(): boolean {
  const settings = getNotificationSettings()
  return settings.enabled && settings.sound
}

/**
 * デスクトップ通知を表示
 */
async function showDesktopNotification(notification: Notification): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  
  // 通知権限をリクエスト
  if (Notification.permission === 'default') {
    await Notification.requestPermission()
  }
  
  if (Notification.permission !== 'granted') return
  
  try {
    const config = notificationConfig[notification.type]
    new Notification(notification.title, {
      body: notification.message,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: notification.id,
      requireInteraction: notification.priority === 'high',
      silent: !shouldPlaySound()
    })
  } catch (error) {
    console.error('Failed to show desktop notification:', error)
  }
}

/**
 * 通知サウンドを再生
 */
function playNotificationSound(): void {
  if (typeof window === 'undefined') return
  
  try {
    // 簡単なビープ音を生成
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (error) {
    console.error('Failed to play notification sound:', error)
  }
}

/**
 * サンプル通知データを生成（開発用）
 */
export function generateSampleNotifications(): void {
  const samples: Array<Omit<Notification, 'id' | 'createdAt' | 'read'>> = [
    {
      type: 'schedule_created',
      title: '新しい予定が追加されました',
      message: '8月15日 14:00からエアコン設置作業が予定されています',
      priority: 'normal',
      relatedEventId: 'event_1',
      actionUrl: '/demo'
    },
    {
      type: 'worker_assigned',
      title: '作業が割り当てられました',
      message: '渋谷区のメンテナンス作業が割り当てられました',
      priority: 'normal',
      relatedEventId: 'event_2',
      actionUrl: '/demo'
    },
    {
      type: 'schedule_updated',
      title: '予定が変更されました',
      message: '8月20日の作業時間が10:00から09:00に変更されました',
      priority: 'high',
      relatedEventId: 'event_3',
      actionUrl: '/demo'
    },
    {
      type: 'reminder',
      title: '明日の予定',
      message: '明日は3件の作業予定があります',
      priority: 'normal',
      actionUrl: '/demo'
    },
    {
      type: 'system',
      title: 'システムメンテナンス',
      message: '8月25日 2:00-4:00にメンテナンスを実施します',
      priority: 'low'
    }
  ]
  
  samples.forEach((sample, index) => {
    setTimeout(() => {
      addNotification(sample)
    }, index * 100)
  })
}