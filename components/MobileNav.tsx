'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  WorkersIcon, 
  DashboardIcon, 
  NotificationIcon, 
  SettingsIcon 
} from '@/components/Icons'

export default function MobileNav() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  const menuItems = [
    { href: '/demo', Icon: CalendarIcon, label: 'カレンダー' },
    { href: '/workers', Icon: WorkersIcon, label: '職人' },
    { href: '/reports', Icon: DashboardIcon, label: 'レポート' },
    { href: '/notifications', Icon: NotificationIcon, label: '通知' },
    { href: '/settings', Icon: SettingsIcon, label: '設定' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      alignItems: 'center',
      padding: '8px 0',
      zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
    }}>
      {menuItems.map(item => {
        const isActive = pathname === item.href
        const { Icon } = item
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '8px',
              background: isActive ? '#FF8C4210' : 'transparent',
              transition: 'all 0.2s',
              minWidth: '48px'
            }}
          >
            <Icon 
              size={22} 
              color={isActive ? '#FF8C42' : '#9ca3af'}
            />
            <span style={{
              fontSize: '10px',
              color: isActive ? '#FF8C42' : '#9ca3af',
              fontWeight: isActive ? '600' : '400'
            }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}