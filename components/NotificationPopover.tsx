'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  notificationConfig,
  type Notification
} from '@/lib/notifications'

interface NotificationPopoverProps {
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
}

export default function NotificationPopover({ isOpen, onClose, anchorEl }: NotificationPopoverProps) {
  const router = useRouter()
  const popoverRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // 通知を読み込み
  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen, filter])

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
  }, [])

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorEl])

  const loadNotifications = () => {
    const allNotifications = getNotifications()
    const filtered = filter === 'unread' 
      ? allNotifications.filter(n => !n.read)
      : allNotifications
    setNotifications(filtered)
  }

  const handleNotificationClick = (notification: Notification) => {
    // 既読にする
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // アクションURLがある場合は遷移
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      onClose()
    }
  }

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
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

  if (!isOpen) return null

  // ポップオーバーの位置を計算
  const rect = anchorEl?.getBoundingClientRect()
  const top = rect ? rect.bottom + 8 : 0
  const right = rect ? window.innerWidth - rect.right : 0

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${top}px`,
        right: `${right}px`,
        width: '400px',
        maxHeight: '600px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* ヘッダー */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(to right, #667eea, #764ba2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            margin: 0
          }}>
            通知
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {notifications.some(n => !n.read) && (
              <button
                onClick={() => {
                  markAllAsRead()
                  loadNotifications()
                }}
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                すべて既読
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
                  padding: '4px 8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                クリア
              </button>
            )}
          </div>
        </div>
        
        {/* フィルタータブ */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2px',
          borderRadius: '6px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              flex: 1,
              padding: '6px',
              background: filter === 'all' ? 'white' : 'transparent',
              color: filter === 'all' ? '#667eea' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              flex: 1,
              padding: '6px',
              background: filter === 'unread' ? 'white' : 'transparent',
              color: filter === 'unread' ? '#667eea' : 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            未読 {getUnreadCount() > 0 && `(${getUnreadCount()})`}
          </button>
        </div>
      </div>

      {/* 通知リスト */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <p style={{ fontSize: '14px' }}>
              {filter === 'unread' ? '未読の通知はありません' : '通知はありません'}
            </p>
          </div>
        ) : (
          notifications.map(notification => {
            const config = notificationConfig[notification.type]
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  padding: '12px',
                  marginBottom: '4px',
                  background: notification.read ? 'white' : '#f0f9ff',
                  border: '1px solid',
                  borderColor: notification.read ? '#e5e7eb' : '#bfdbfe',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${config.color}`,
                  cursor: notification.actionUrl ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(-2px)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  {/* アイコン */}
                  <div style={{
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {getIcon(notification.type)}
                  </div>

                  {/* コンテンツ */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: notification.read ? '400' : '600',
                        color: '#1f2937',
                        margin: 0,
                        paddingRight: '8px'
                      }}>
                        {notification.title}
                      </p>
                      <span style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        flexShrink: 0
                      }}>
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>
                    
                    {/* 優先度バッジ */}
                    {notification.priority === 'high' && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        padding: '2px 6px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '10px',
                        fontWeight: '500',
                        borderRadius: '4px'
                      }}>
                        重要
                      </span>
                    )}
                  </div>

                  {/* 削除ボタン */}
                  <button
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    style={{
                      padding: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '16px',
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
          })
        )}
      </div>

      {/* フッター */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <button
          onClick={() => {
            router.push('/notifications')
            onClose()
          }}
          style={{
            width: '100%',
            padding: '8px',
            background: 'white',
            color: '#667eea',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#667eea'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#667eea'
          }}
        >
          すべての通知を見る
        </button>
      </div>
    </div>
  )
}