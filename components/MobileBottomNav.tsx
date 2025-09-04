'use client'

import { Calendar, Users, Bell, Settings, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileBottomNav() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/demo', icon: Calendar, label: 'カレンダー' },
    { href: '/workers', icon: Users, label: '職人' },
    { href: '/notifications', icon: Bell, label: '通知' },
    { href: '/dashboard', icon: Home, label: 'レポート' },
    { href: '/settings', icon: Settings, label: '設定' }
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50
    }}>
      {navItems.map(item => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '8px',
              textDecoration: 'none',
              color: isActive ? '#3b82f6' : '#6b7280',
              fontSize: '10px',
              fontWeight: isActive ? '600' : '400',
              flex: 1
            }}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}