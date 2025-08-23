'use client'

import { useState, ReactNode, useEffect } from 'react'
import { Menu, Bell, User, Calendar, Users, MapPin, LayoutDashboard, FileEdit, CalendarClock, Package, FileText, Settings, X, LogOut, Mail, CheckCircle, AlertTriangle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import NotificationPanel from './NotificationPanel'
import NotificationBell from './NotificationBell'
import { generateMockNotifications } from '@/lib/mockDataExtended'
import { generateSampleNotifications } from '@/lib/notifications'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    // 初回アクセス時にサンプル通知を生成
    const isFirstVisit = !localStorage.getItem('notifications_initialized')
    if (isFirstVisit) {
      generateSampleNotifications()
      localStorage.setItem('notifications_initialized', 'true')
    }
  }, [])

  useEffect(() => {
    if (user) {
      // 未読通知数を計算（旧システム用）
      const notifications = generateMockNotifications()
      const userNotifications = notifications.filter(n => n.userRole === user.role)
      const unread = userNotifications.filter(n => !n.read).length
      setUnreadCount(unread)
    }
  }, [user])
  
  // ロールに応じたメニュー項目
  const allMenuItems = [
    { href: '/demo', icon: Calendar, label: 'カレンダー', roles: ['admin', 'worker'] },
    { href: '/workers', icon: Users, label: '職人管理', roles: ['admin'] },
    { href: '/sites', icon: MapPin, label: '現場管理', roles: ['admin'] },
    { href: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード', roles: ['admin'] },
    { href: '/contact-admin', icon: Mail, label: '管理者への連絡', roles: ['worker'] },
    { href: '/work-status', icon: CheckCircle, label: '作業ステータス', roles: ['worker'] },
    { href: '/schedule-change', icon: FileEdit, label: '予定変更申請', roles: ['admin', 'worker'] },
    { href: '/problem-report', icon: AlertTriangle, label: '問題報告', roles: ['worker'] },
    { href: '/shifts', icon: CalendarClock, label: 'シフト管理', roles: ['admin'] },
    { href: '/inventory', icon: Package, label: '在庫管理', roles: ['admin', 'worker'] },
    { href: '/reports', icon: FileText, label: '作業報告書', roles: ['admin', 'worker'] },
    { href: '/settings', icon: Settings, label: '設定', roles: ['admin'] }
  ]

  const menuItems = allMenuItems.filter(item => {
    if (!user) return true;
    const userRole = user.role?.toLowerCase();
    return item.roles.includes(userRole) || 
           (userRole === 'superadmin' && item.roles.includes('admin'));
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        width: '100%',
        height: '56px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setShowMenu(true)}
            style={{ 
              padding: '8px', 
              borderRadius: '8px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu size={20} color="#4b5563" />
          </button>
          <span style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
            {user?.role === 'worker' ? 'マイスケジュール' : 'Dandori Scheduler'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* ユーザー情報表示 */}
          {user && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 12px',
              background: user.role === 'admin' ? '#fef2f2' : '#f0fdf4',
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              <span style={{ fontWeight: '600' }}>{user.name}</span>
              <span style={{ 
                fontSize: '12px',
                padding: '2px 8px',
                background: user.role === 'admin' ? '#ef4444' : '#22c55e',
                color: 'white',
                borderRadius: '10px'
              }}>
                {user.role === 'admin' ? '管理者' : '職人'}
              </span>
            </div>
          )}
          
          {/* 新しい通知システム */}
          <NotificationBell />
          
          <button 
            onClick={() => {
              localStorage.removeItem('user')
              localStorage.removeItem('currentUser')
              router.push('/login/demo')
            }}
            style={{ 
              padding: '8px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="ログアウト"
          >
            <LogOut size={20} color="#4b5563" />
          </button>
        </div>
      </header>

      {/* モーダルメニュー */}
      {showMenu && (
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
              zIndex: 100,
              animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={() => setShowMenu(false)}
          />
          
          {/* メニューパネル */}
          <aside style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '280px',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
            zIndex: 101,
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ padding: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
                  メニュー
                </h2>
                <button 
                  onClick={() => setShowMenu(false)}
                  style={{ 
                    padding: '8px', 
                    backgroundColor: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                >
                  <X size={20} color="#4b5563" />
                </button>
              </div>
              
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: isActive ? '#fff7ed' : 'transparent',
                        color: isActive ? '#ea580c' : '#4b5563',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        router.push(item.href)
                        setShowMenu(false)
                      }}
                    >
                      <Icon size={20} color={isActive ? '#ea580c' : '#9ca3af'} />
                      <span>{item.label}</span>
                    </a>
                  )
                })}
              </nav>
            </div>
          </aside>
        </>
      )}
      
      {/* 通知パネル */}
      {user && (
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          userRole={user.role}
          userId={user.id}
        />
      )}

      {/* メインコンテンツ */}
      <div style={{ paddingTop: '56px' }}>
        {children}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
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
    </div>
  )
}