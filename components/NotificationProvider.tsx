'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { pusherClient, CHANNELS, EVENTS, type Notification } from '@/lib/pusher'
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  clearAll: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export default function NotificationProvider({ 
  children,
  userId,
  companyId,
  role
}: { 
  children: React.ReactNode
  userId?: string
  companyId?: string
  role?: string
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!userId) return

    // Pusherチャンネルを購読
    const globalChannel = pusherClient.subscribe(CHANNELS.GLOBAL)
    const userChannel = pusherClient.subscribe(CHANNELS.USER(userId))
    const companyChannel = companyId ? pusherClient.subscribe(CHANNELS.COMPANY(companyId)) : null
    const roleChannel = role === 'WORKER' || role === 'MASTER_WORKER' 
      ? pusherClient.subscribe(CHANNELS.WORKERS)
      : role === 'ADMIN' || role === 'SUPERADMIN'
      ? pusherClient.subscribe(CHANNELS.ADMINS)
      : null

    // 通知ハンドラー
    const handleNotification = (data: Notification) => {
      // 通知を追加
      setNotifications(prev => [data, ...prev].slice(0, 50)) // 最新50件まで保持
      setUnreadCount(prev => prev + 1)

      // トースト表示
      const icon = getIcon(data.severity)
      const toastStyle = getToastStyle(data.severity)
      
      toast.custom(
        (t) => (
          <div
            className={`max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ${toastStyle}`}
            style={{
              animation: t.visible ? 'slide-in 0.3s ease-out' : 'slide-out 0.3s ease-in',
            }}
          >
            <div className="flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">{icon}</div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{data.title}</p>
                  <p className="mt-1 text-sm opacity-90">{data.message}</p>
                </div>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-4 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: 'top-right',
        }
      )
    }

    // イベントリスナー登録
    Object.values(EVENTS).forEach(event => {
      globalChannel.bind(event, handleNotification)
      userChannel.bind(event, handleNotification)
      companyChannel?.bind(event, handleNotification)
      roleChannel?.bind(event, handleNotification)
    })

    // クリーンアップ
    return () => {
      pusherClient.unsubscribe(CHANNELS.GLOBAL)
      pusherClient.unsubscribe(CHANNELS.USER(userId))
      if (companyId) pusherClient.unsubscribe(CHANNELS.COMPANY(companyId))
      if (roleChannel) {
        pusherClient.unsubscribe(role === 'WORKER' || role === 'MASTER_WORKER' 
          ? CHANNELS.WORKERS 
          : CHANNELS.ADMINS)
      }
    }
  }, [userId, companyId, role])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const getIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="text-red-500" size={20} />
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      default:
        return <Info className="text-blue-500" size={20} />
    }
  }

  const getToastStyle = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 text-red-800 border border-red-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      case 'success':
        return 'bg-green-50 text-green-800 border border-green-200'
      default:
        return 'bg-blue-50 text-blue-800 border border-blue-200'
    }
  }

  return (
    <NotificationContext.Provider 
      value={{ notifications, unreadCount, markAsRead, clearAll }}
    >
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
        }}
      />
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  )
}