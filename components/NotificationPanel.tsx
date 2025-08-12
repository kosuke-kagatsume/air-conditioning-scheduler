'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Clock, AlertTriangle, Info, CheckCircle, Bell } from 'lucide-react'
import { generateMockNotifications, ExtendedNotification } from '@/lib/mockDataExtended'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'admin' | 'worker'
  userId: string
}

export default function NotificationPanel({ isOpen, onClose, userRole, userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<ExtendedNotification[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  
  useEffect(() => {
    if (isOpen) {
      const allNotifications = generateMockNotifications()
      // ユーザーロールに応じてフィルタリング
      const userNotifications = allNotifications.filter(n => n.userRole === userRole)
      setNotifications(userNotifications)
    }
  }, [isOpen, userRole])
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') {
      return !notification.read
    }
    return true
  })
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f97316'
      case 'normal': return '#3b82f6'
      case 'low': return '#6b7280'
      default: return '#6b7280'
    }
  }
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle size={16} color="#ef4444" />
      case 'high': return <AlertTriangle size={16} color="#f97316" />
      case 'normal': return <Info size={16} color="#3b82f6" />
      case 'low': return <Info size={16} color="#6b7280" />
      default: return <Info size={16} color="#6b7280" />
    }
  }
  
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '緊急'
      case 'high': return '重要'
      case 'normal': return '通常'
      case 'low': return '低'
      default: return '通常'
    }
  }
  
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      schedule_new: '新規予定',
      schedule_change: '予定変更',
      schedule_cancel: '予定キャンセル',
      report_submitted: '報告書提出',
      report_approved: '報告書承認',
      inventory_low: '在庫不足',
      trouble_reported: 'トラブル報告',
      message: 'メッセージ'
    }
    return labels[type] || type
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInMs / (1000 * 60))}分前`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}日前`
    } else {
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
  
  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }
  
  if (!isOpen) return null
  
  return (
    <>
      {/* オーバーレイ */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 200,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      />
      
      {/* 通知パネル */}
      <div style={{
        position: 'fixed',
        top: '56px', // ヘッダーの下
        right: 0,
        width: '400px',
        maxWidth: '90vw',
        height: 'calc(100vh - 56px)',
        backgroundColor: 'white',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s ease-out'
      }}>
        {/* ヘッダー */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#3b82f6" />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#111827',
              margin: 0
            }}>
              通知
            </h3>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '12px',
                borderRadius: '10px',
                padding: '2px 8px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            style={{ 
              padding: '8px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>
        
        {/* タブとアクション */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 16px',
                background: activeTab === 'all' ? '#3b82f6' : 'transparent',
                color: activeTab === 'all' ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              すべて ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              style={{
                padding: '6px 16px',
                background: activeTab === 'unread' ? '#3b82f6' : 'transparent',
                color: activeTab === 'unread' ? 'white' : '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              未読 ({unreadCount})
            </button>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                color: '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'underline'
              }}
            >
              すべて既読にする
            </button>
          )}
        </div>
        
        {/* 通知リスト */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredNotifications.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Bell size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <p style={{ margin: 0 }}>
                {activeTab === 'unread' ? '未読の通知はありません' : '通知はありません'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  margin: '8px',
                  padding: '16px',
                  backgroundColor: notification.read ? '#ffffff' : '#f8fafc',
                  border: `1px solid ${notification.read ? '#e5e7eb' : '#3b82f6'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getPriorityIcon(notification.priority)}
                    <span style={{
                      fontSize: '12px',
                      color: getPriorityColor(notification.priority),
                      fontWeight: '600'
                    }}>
                      {getPriorityLabel(notification.priority)}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      padding: '2px 8px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '12px'
                    }}>
                      {getTypeLabel(notification.type)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!notification.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%'
                      }} />
                    )}
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
                
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  {notification.title}
                </h4>
                
                <p style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4'
                }}>
                  {notification.message}
                </p>
                
                {notification.link && (
                  <a
                    href={notification.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    詳細を見る
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
        
        {/* フッター */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} color="#22c55e" />
            <span style={{ 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              {userRole === 'admin' ? '管理者' : '職人'} モード
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}