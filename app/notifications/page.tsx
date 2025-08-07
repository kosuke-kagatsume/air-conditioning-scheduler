'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

interface Notification {
  id: string
  type: 'schedule' | 'approval' | 'reminder' | 'alert' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  from?: string
  icon?: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  slack: boolean
  categories: {
    schedule: boolean
    approval: boolean
    reminder: boolean
    alert: boolean
    system: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

function NotificationsContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox')
  const [filterType, setFilterType] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // 通知データ
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'approval',
      title: '予定変更申請が承認されました',
      message: '8月10日の渋谷現場の日程変更が承認されました。新しい日時: 8月12日 10:00〜',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      actionUrl: '/schedule-change',
      actionLabel: '詳細を見る',
      priority: 'high',
      from: '山田管理者',
      icon: '✅'
    },
    {
      id: '2',
      type: 'schedule',
      title: '明日の予定リマインダー',
      message: '明日 9:00から新宿区でエアコン設置工事があります。必要な工具の準備をお忘れなく。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionUrl: '/demo',
      actionLabel: 'カレンダーで確認',
      priority: 'medium',
      icon: '📅'
    },
    {
      id: '3',
      type: 'alert',
      title: '在庫アラート',
      message: 'ドレンホースの在庫が最小在庫数を下回りました。早急に発注が必要です。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
      actionUrl: '/inventory',
      actionLabel: '在庫を確認',
      priority: 'urgent',
      icon: '⚠️'
    },
    {
      id: '4',
      type: 'reminder',
      title: '作業報告書の提出',
      message: '本日実施した渋谷現場の作業報告書を提出してください。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      read: true,
      actionUrl: '/reports',
      actionLabel: '報告書作成',
      priority: 'medium',
      icon: '📝'
    },
    {
      id: '5',
      type: 'system',
      title: 'システムメンテナンスのお知らせ',
      message: '8月15日 2:00〜5:00にシステムメンテナンスを実施します。',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      priority: 'low',
      from: 'システム管理者',
      icon: '🔧'
    }
  ])

  // 通知設定
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    slack: true,
    categories: {
      schedule: true,
      approval: true,
      reminder: true,
      alert: true,
      system: false
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  })

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId))
  }

  const handleSettingChange = (category: string, value: boolean) => {
    if (category in settings) {
      setSettings({ ...settings, [category]: value })
    } else if (category in settings.categories) {
      setSettings({
        ...settings,
        categories: { ...settings.categories, [category]: value }
      })
    }
  }

  const filteredNotifications = notifications.filter(n => {
    const matchesType = filterType === 'all' || n.type === filterType
    const matchesRead = !showUnreadOnly || !n.read
    return matchesType && matchesRead
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'schedule': return 'スケジュール'
      case 'approval': return '承認'
      case 'reminder': return 'リマインダー'
      case 'alert': return 'アラート'
      case 'system': return 'システム'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'schedule': return '#3b82f6'
      case 'approval': return '#22c55e'
      case 'reminder': return '#eab308'
      case 'alert': return '#ef4444'
      case 'system': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626'
      case 'high': return '#f97316'
      case 'medium': return '#3b82f6'
      case 'low': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '12px 20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Link href="/demo" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              textDecoration: 'none'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: 0,
                color: '#2c3e50'
              }}>HVAC Scheduler</h1>
            </Link>

            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/demo" style={{ color: '#6b7280', textDecoration: 'none' }}>
                カレンダー
              </Link>
              <Link href="/notifications" style={{ 
                color: '#ff6b6b', 
                textDecoration: 'none', 
                fontWeight: '600',
                position: 'relative'
              }}>
                通知
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    width: '20px',
                    height: '20px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '10px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: unreadCount > 0 ? '#fee2e2' : '#f3f4f6',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              cursor: 'pointer',
              position: 'relative'
            }}>
              🔔
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '12px',
                  height: '12px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            通知センター
          </h2>

          {/* タブ切り替え */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setActiveTab('inbox')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'inbox' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'inbox' ? '500' : '400',
                color: activeTab === 'inbox' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              受信箱
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'settings' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'settings' ? '500' : '400',
                color: activeTab === 'settings' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              通知設定
            </button>
          </div>
        </div>

        {activeTab === 'inbox' ? (
          <div style={{ display: 'flex', gap: '24px' }}>
            {/* サイドバー */}
            <div style={{
              width: '260px',
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  フィルター
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { value: 'all', label: 'すべて', count: notifications.length },
                    { value: 'schedule', label: 'スケジュール', count: notifications.filter(n => n.type === 'schedule').length },
                    { value: 'approval', label: '承認', count: notifications.filter(n => n.type === 'approval').length },
                    { value: 'reminder', label: 'リマインダー', count: notifications.filter(n => n.type === 'reminder').length },
                    { value: 'alert', label: 'アラート', count: notifications.filter(n => n.type === 'alert').length },
                    { value: 'system', label: 'システム', count: notifications.filter(n => n.type === 'system').length }
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      style={{
                        padding: '8px 12px',
                        background: filterType === filter.value ? '#eff6ff' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: filterType === filter.value ? '#3b82f6' : '#6b7280',
                        textAlign: 'left'
                      }}
                    >
                      <span>{filter.label}</span>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 6px',
                        background: filterType === filter.value ? '#3b82f6' : '#f3f4f6',
                        color: filterType === filter.value ? 'white' : '#6b7280',
                        borderRadius: '10px'
                      }}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: showUnreadOnly ? '#eff6ff' : '#f9fafb',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  />
                  <span style={{ fontSize: '14px' }}>未読のみ表示</span>
                </label>
              </div>
            </div>

            {/* 通知リスト */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* ヘッダー */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {unreadCount > 0 && `${unreadCount}件の未読`}
                  </div>
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    すべて既読にする
                  </button>
                </div>

                {/* 通知アイテム */}
                <div>
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        background: notification.read ? 'white' : '#f0f9ff',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onClick={() => handleMarkAsRead(notification.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = notification.read ? '#f9fafb' : '#e0f2fe'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = notification.read ? 'white' : '#f0f9ff'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: `${getTypeColor(notification.type)}15`,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          {notification.icon}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '4px'
                          }}>
                            <div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '4px'
                              }}>
                                <span style={{
                                  fontSize: '14px',
                                  fontWeight: notification.read ? '400' : '600',
                                  color: '#1f2937'
                                }}>
                                  {notification.title}
                                </span>
                                {!notification.read && (
                                  <span style={{
                                    width: '8px',
                                    height: '8px',
                                    background: '#3b82f6',
                                    borderRadius: '50%'
                                  }} />
                                )}
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '6px'
                              }}>
                                <span style={{
                                  padding: '2px 8px',
                                  background: `${getTypeColor(notification.type)}15`,
                                  color: getTypeColor(notification.type),
                                  borderRadius: '10px',
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}>
                                  {getTypeLabel(notification.type)}
                                </span>
                                {notification.priority === 'urgent' && (
                                  <span style={{
                                    padding: '2px 8px',
                                    background: '#fee2e2',
                                    color: '#dc2626',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: '500'
                                  }}>
                                    緊急
                                  </span>
                                )}
                                {notification.from && (
                                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                    {notification.from}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNotification(notification.id)
                              }}
                              style={{
                                padding: '4px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af'
                              }}
                            >
                              ×
                            </button>
                          </div>

                          <div style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '8px',
                            lineHeight: '1.5'
                          }}>
                            {notification.message}
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {notification.timestamp.toLocaleString('ja-JP')}
                            </span>
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                style={{
                                  padding: '4px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  textDecoration: 'none'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {notification.actionLabel || '詳細'}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredNotifications.length === 0 && (
                    <div style={{
                      padding: '60px 20px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                      <div style={{ fontSize: '16px', color: '#6b7280' }}>
                        通知はありません
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 通知設定 */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              通知設定
            </h3>

            {/* 通知方法 */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '500',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                通知方法
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { key: 'email', label: 'メール通知', description: '重要な通知をメールで受け取る' },
                  { key: 'push', label: 'プッシュ通知', description: 'ブラウザのプッシュ通知を有効にする' },
                  { key: 'sms', label: 'SMS通知', description: '緊急の通知をSMSで受け取る' },
                  { key: 'slack', label: 'Slack通知', description: 'SlackチャンネルにŌ知を送信' }
                ].map(method => (
                  <label key={method.key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                        {method.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {method.description}
                      </div>
                    </div>
                    <div style={{
                      position: 'relative',
                      width: '44px',
                      height: '24px',
                      background: settings[method.key as keyof NotificationSettings] ? '#3b82f6' : '#d1d5db',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings[method.key as keyof NotificationSettings] as boolean}
                        onChange={(e) => handleSettingChange(method.key, e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: settings[method.key as keyof NotificationSettings] ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        background: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 通知カテゴリー */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '500',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                通知カテゴリー
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'schedule', label: 'スケジュール変更' },
                  { key: 'approval', label: '承認関連' },
                  { key: 'reminder', label: 'リマインダー' },
                  { key: 'alert', label: 'アラート' },
                  { key: 'system', label: 'システム通知' }
                ].map(category => (
                  <label key={category.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.categories[category.key as keyof typeof settings.categories]}
                      onChange={(e) => handleSettingChange(category.key, e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px' }}>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 通知制限時間 */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '500',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                通知制限時間
              </h4>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    quietHours: { ...settings.quietHours, enabled: e.target.checked }
                  })}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '14px' }}>通知制限時間を有効にする</span>
              </label>
              {settings.quietHours.enabled && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      quietHours: { ...settings.quietHours, start: e.target.value }
                    })}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <span>〜</span>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      quietHours: { ...settings.quietHours, end: e.target.value }
                    })}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>
                    この時間帯は通知を送信しません
                  </span>
                </div>
              )}
            </div>

            {/* 保存ボタン */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button style={{
                padding: '10px 24px',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                キャンセル
              </button>
              <button style={{
                padding: '10px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                設定を保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <AuthProvider>
      <NotificationsContent />
    </AuthProvider>
  )
}