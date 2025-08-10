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
    <aside className="fixed left-0 top-14 w-60 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 p-5 overflow-y-auto block">
      {/* Menu Section */}
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 font-medium mb-3 pl-3">
          メニュー
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const { Icon } = item
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-50 to-transparent text-orange-600 border-l-4 border-orange-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <Icon size={18} color={isActive ? '#ea580c' : '#6b7280'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}