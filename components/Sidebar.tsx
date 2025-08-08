'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { href: '/demo', icon: '📅', label: 'カレンダー' },
    { href: '/workers', icon: '👥', label: '職人管理' },
    { href: '/sites', icon: '🏢', label: '現場管理' },
    { href: '/dashboard', icon: '📊', label: 'ダッシュボード' },
    { href: '/schedule-change', icon: '📝', label: '予定変更申請' },
    { href: '/shifts', icon: '📋', label: 'シフト管理' },
    { href: '/inventory', icon: '📦', label: '在庫管理' },
    { href: '/reports', icon: '📄', label: '作業報告書' },
    { href: '/settings', icon: '⚙️', label: '設定' }
  ]

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: '60px',
      width: '240px',
      height: 'calc(100vh - 60px)',
      background: '#ffffff',
      borderRight: '1px solid #e1e4e8',
      padding: '20px',
      overflowY: 'auto'
    }}>
      {/* Menu Section */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '12px',
          color: '#6c7684',
          fontWeight: '500',
          marginBottom: '12px',
          paddingLeft: '12px'
        }}>
          メニュー
        </h3>
        <nav>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href}
                href={item.href} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: isActive ? '#fff5f5' : 'transparent',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#ff6b6b' : '#2c3e50',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                  transition: 'background 0.2s'
                }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}