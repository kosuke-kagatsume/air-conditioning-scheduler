'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  notificationConfig,
  type Notification
} from '@/lib/notifications'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // 通知を読み込み
  const loadNotifications = () => {
    setIsLoading(true)
    const allNotifications = getNotifications()
    
    let filtered = allNotifications
    if (filter === 'unread') {
      filtered = allNotifications.filter(n => !n.read)
    } else if (filter === 'high') {
      filtered = allNotifications.filter(n => n.priority === 'high')
    }
    
    setNotifications(filtered)
    setIsLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [filter])

  // リアルタイム更新のリスナー
  useEffect(() => {
    const handleNotificationUpdate = () => {
      loadNotifications()
    }

    window.addEventListener('notification-added', handleNotificationUpdate)
    window.addEventListener('notification-read', handleNotificationUpdate)
    window.addEventListener('all-notifications-read', handleNotificationUpdate)
    window.addEventListener('notification-deleted', handleNotificationUpdate)
    window.addEventListener('all-notifications-cleared', handleNotificationUpdate)

    return () => {
      window.removeEventListener('notification-added', handleNotificationUpdate)
      window.removeEventListener('notification-read', handleNotificationUpdate)
      window.removeEventListener('all-notifications-read', handleNotificationUpdate)
      window.removeEventListener('notification-deleted', handleNotificationUpdate)
      window.removeEventListener('all-notifications-cleared', handleNotificationUpdate)
    }
  }, [filter])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId)
    loadNotifications()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 0 ? 'たった今' : `${diffMinutes}分前`
    } else if (diffHours < 24) {
      return `${diffHours}時間前`
    } else if (diffDays < 7) {
      return `${diffDays}日前`
    } else {
      return date.toLocaleDateString('ja-JP')
    }
  }

  const getIcon = (type: Notification['type']) => {
    const config = notificationConfig[type]
    switch (config.icon) {
      case 'calendar':
        return '📅'
      case 'user':
        return '👤'
      case 'alert':
        return '⚠️'
      case 'check':
        return '✅'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingBottom: '80px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            通知センター
          </h1>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {notifications.some(n => !n.read) && (
              <button
                onClick={() => {
                  markAllAsRead()
                  loadNotifications()
                }}
                style={{
                  padding: '8px 16px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                すべて既読にする
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('すべての通知を削除しますか？')) {
                    clearAllNotifications()
                    loadNotifications()
                  }
                }}
                style={{
                  padding: '8px 16px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                すべて削除
              </button>
            )}
          </div>
        </div>

        {/* フィルタータブ */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          background: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              flex: 1,
              padding: '8px',
              background: filter === 'all' ? 'white' : 'transparent',
              color: filter === 'all' ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              flex: 1,
              padding: '8px',
              background: filter === 'unread' ? 'white' : 'transparent',
              color: filter === 'unread' ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: filter === 'unread' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            未読のみ
          </button>
          <button
            onClick={() => setFilter('high')}
            style={{
              flex: 1,
              padding: '8px',
              background: filter === 'high' ? 'white' : 'transparent',
              color: filter === 'high' ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: filter === 'high' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            重要
          </button>
        </div>
        
        {/* 通知リスト */}
        {isLoading ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            読み込み中...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              {filter === 'unread' 
                ? '未読の通知はありません' 
                : filter === 'high'
                ? '重要な通知はありません'
                : '通知はありません'}
            </p>
            <p style={{ fontSize: '14px', color: '#d1d5db' }}>
              新しい通知が届くとここに表示されます
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(notification => {
              const config = notificationConfig[notification.type]
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: '16px',
                    border: '1px solid',
                    borderColor: notification.read ? '#e5e7eb' : '#bfdbfe',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${config.color}`,
                    background: notification.read ? 'white' : '#f0f9ff',
                    cursor: notification.actionUrl ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}>
                    {/* アイコン */}
                    <div style={{
                      fontSize: '24px',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {getIcon(notification.type)}
                    </div>

                    {/* コンテンツ */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '16px',
                            fontWeight: notification.read ? '400' : '600',
                            color: '#1f2937',
                            margin: '0 0 4px 0'
                          }}>
                            {notification.title}
                          </p>
                          {notification.priority === 'high' && (
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              background: '#fee2e2',
                              color: '#dc2626',
                              fontSize: '11px',
                              fontWeight: '600',
                              borderRadius: '4px'
                            }}>
                              重要
                            </span>
                          )}
                        </div>
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          flexShrink: 0
                        }}>
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {notification.message}
                      </p>
                      
                      {notification.actionUrl && (
                        <button
                          style={{
                            marginTop: '8px',
                            padding: '4px 12px',
                            background: config.color,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          詳細を見る →
                        </button>
                      )}
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNotification(notification.id)
                      }}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '20px',
                        lineHeight: 1,
                        opacity: 0.6,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.6'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <button
          onClick={() => router.push('/demo')}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          カレンダーに戻る
        </button>
      </div>
    </div>
  )
}