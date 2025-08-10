'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  CalendarIcon, 
  WorkersIcon, 
  SitesIcon, 
  DashboardIcon, 
  ScheduleChangeIcon,
  ShiftIcon,
  InventoryIcon,
  ReportIcon,
  SettingsIcon
} from '@/components/Icons'

export default function Sidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { href: '/demo', Icon: CalendarIcon, label: 'カレンダー' },
    { href: '/workers', Icon: WorkersIcon, label: '職人管理' },
    { href: '/sites', Icon: SitesIcon, label: '現場管理' },
    { href: '/dashboard', Icon: DashboardIcon, label: 'ダッシュボード' },
    { href: '/schedule-change', Icon: ScheduleChangeIcon, label: '予定変更申請' },
    { href: '/shifts', Icon: ShiftIcon, label: 'シフト管理' },
    { href: '/inventory', Icon: InventoryIcon, label: '在庫管理' },
    { href: '/reports', Icon: ReportIcon, label: '作業報告書' },
    { href: '/settings', Icon: SettingsIcon, label: '設定' }
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
            const { Icon } = item
            return (
              <Link 
                key={item.href}
                href={item.href} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: isActive ? 'linear-gradient(90deg, #FF8C4210 0%, transparent 100%)' : 'transparent',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#FF8C42' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                  borderLeft: isActive ? '3px solid #FF8C42' : '3px solid transparent'
                }}
              >
                <Icon size={18} color={isActive ? '#FF8C42' : '#6b7280'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}