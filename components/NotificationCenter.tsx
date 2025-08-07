'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'event'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  sender?: string
  avatar?: string
}

export default function NotificationCenter() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'event',
      title: '新しい予定の提案',
      message: '山田様より明日14:00からのエアコン設置工事の依頼があります',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5分前
      read: false,
      actionUrl: '/demo',
      actionLabel: '詳細を見る',
      sender: '山田太郎',
      avatar: '山'
    },
    {
      id: '2',
      type: 'success',
      title: '予定が確定しました',
      message: '8月10日の渋谷区での作業が確定しました',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分前
      read: false,
      sender: 'システム'
    },
    {
      id: '3',
      type: 'warning',
      title: '枠数が残りわずか',
      message: '明日の作業枠が残り1件となりました',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
      read: true,
      sender: 'システム'
    },
    {
      id: '4',
      type: 'info',
      title: '予定変更のお知らせ',
      message: '鈴木様の作業時間が10:00から11:00に変更されました',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5時間前
      read: true,
      sender: '鈴木次郎',
      avatar: '鈴'
    },
    {
      id: '5',
      type: 'success',
      title: '作業完了報告',
      message: '本日の新宿区での作業が完了しました',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
      read: true,
      sender: '田中工務店',
      avatar: '田'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'event': return '📅'
      default: return '📬'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return '#3b82f6'
      case 'success': return '#22c55e'
      case 'warning': return '#eab308'
      case 'error': return '#ef4444'
      case 'event': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    if (hours < 24) return `${hours}時間前`
    if (days < 7) return `${days}日前`
    return date.toLocaleDateString('ja-JP')
  }

  // Close notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.notification-center') && !target.closest('.notification-trigger')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      {/* Notification Bell */}
      <button
        className="notification-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: '#6b7280',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '18px',
            height: '18px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className="notification-center"
          style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            width: '400px',
            maxHeight: '600px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                通知
              </h3>
              {unreadCount > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '4px'
                }}>
                  {unreadCount}件の未読
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  すべて既読
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  クリア
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: '480px'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
                  通知はありません
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  新しい通知が届くとここに表示されます
                </div>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index < notifications.length - 1 ? '1px solid #f3f4f6' : 'none',
                    background: notification.read ? 'white' : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onClick={() => markAsRead(notification.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'white' : '#f9fafb'
                  }}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '40px',
                      background: getTypeColor(notification.type),
                      borderRadius: '0 2px 2px 0'
                    }} />
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Avatar or Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: `${getTypeColor(notification.type)}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {notification.avatar ? (
                        <span style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: getTypeColor(notification.type)
                        }}>
                          {notification.avatar}
                        </span>
                      ) : (
                        <span style={{ fontSize: '20px' }}>
                          {getTypeIcon(notification.type)}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: notification.read ? '400' : '600',
                          color: '#1f2937',
                          lineHeight: '1.4'
                        }}>
                          {notification.title}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          style={{
                            padding: '2px',
                            background: 'transparent',
                            border: 'none',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            fontSize: '16px',
                            lineHeight: '1',
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
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginBottom: '6px',
                        lineHeight: '1.4'
                      }}>
                        {notification.message}
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#9ca3af'
                        }}>
                          {notification.sender && `${notification.sender} • `}
                          {formatTime(notification.timestamp)}
                        </div>

                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '12px',
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontWeight: '500',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#eff6ff'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            {notification.actionLabel || '詳細'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <a
                href="/notifications"
                style={{
                  fontSize: '13px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                すべての通知を見る →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}