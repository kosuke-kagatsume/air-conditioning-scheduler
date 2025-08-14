'use client'

import React, { useState, useEffect, useRef } from 'react'
import { NotificationIcon } from './Icons'
import NotificationPopover from './NotificationPopover'
import { getUnreadCount } from '@/lib/notifications'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)

  // 未読数を更新
  const updateUnreadCount = () => {
    const count = getUnreadCount()
    const prevCount = unreadCount
    setUnreadCount(count)
    
    // 新しい通知がある場合はアニメーション
    if (count > prevCount && prevCount !== 0) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  // 初期化と更新リスナー
  useEffect(() => {
    updateUnreadCount()

    // カスタムイベントをリッスン
    const handleNotificationUpdate = () => {
      updateUnreadCount()
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
  }, [unreadCount])

  return (
    <>
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '8px',
          background: isOpen ? '#f3f4f6' : 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          animation: isAnimating ? 'bell-ring 0.6s ease-in-out' : 'none'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = '#f3f4f6'
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <span style={{
          display: 'block',
          width: '24px',
          height: '24px',
          color: '#6b7280'
        }}>
          <NotificationIcon />
        </span>
        
        {/* 未読バッジ */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            minWidth: '18px',
            height: '18px',
            padding: '0 4px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
            animation: 'pulse 2s infinite'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorEl={bellRef.current}
      />

      <style jsx>{`
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
          50% { transform: rotate(-5deg); }
          60% { transform: rotate(5deg); }
          70% { transform: rotate(-2deg); }
          80% { transform: rotate(2deg); }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.9;
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