'use client'

import { useEffect, useState } from 'react'
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
import { Shield, Building2 } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string>('')
  
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserRole(user.role)
    }
  }, [])
  
  const menuItems = [
    { href: '/demo', Icon: CalendarIcon, label: 'カレンダー', roles: ['admin', 'worker', 'superadmin'] },
    { href: '/workers', Icon: WorkersIcon, label: '職人管理', roles: ['admin', 'superadmin'] },
    { href: '/sites', Icon: SitesIcon, label: '現場管理', roles: ['admin', 'superadmin'] },
    { href: '/dashboard', Icon: DashboardIcon, label: 'ダッシュボード', roles: ['admin', 'worker', 'superadmin'] },
    { href: '/schedule-change', Icon: ScheduleChangeIcon, label: '予定変更申請', roles: ['admin', 'worker', 'superadmin'] },
    { href: '/shifts', Icon: ShiftIcon, label: 'シフト管理', roles: ['admin', 'superadmin'] },
    { href: '/inventory', Icon: InventoryIcon, label: '在庫管理', roles: ['admin', 'worker', 'superadmin'] },
    { href: '/reports', Icon: ReportIcon, label: '作業報告書', roles: ['admin', 'worker', 'superadmin'] },
    { href: '/settings', Icon: SettingsIcon, label: '設定', roles: ['admin', 'worker', 'superadmin'] }
  ]
  
  const adminMenuItems = [
    { href: '/admin/settings', Icon: Shield, label: '管理者設定', roles: ['admin', 'superadmin'] }
  ]
  
  const superAdminMenuItems = [
    { href: '/superadmin/tenants', Icon: Building2, label: 'テナント管理', roles: ['superadmin'] }
  ]

  return (
    <aside className="fixed left-0 top-14 w-60 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 p-5 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xs text-gray-500 font-medium mb-3 pl-3">
          メニュー
        </h3>
        <nav className="space-y-1">
          {menuItems.filter(item => item.roles.includes(userRole)).map((item) => {
            const isActive = pathname === item.href
            const { Icon } = item
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-600' 
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
      
      {/* 管理者メニュー */}
      {(userRole === 'admin' || userRole === 'superadmin') && adminMenuItems.filter(item => item.roles.includes(userRole)).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs text-gray-500 font-medium mb-3 pl-3">
            管理
          </h3>
          <nav className="space-y-1">
            {adminMenuItems.filter(item => item.roles.includes(userRole)).map((item) => {
              const isActive = pathname === item.href
              const { Icon } = item
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon size={18} color={isActive ? '#9333ea' : '#6b7280'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
      
      {/* スーパー管理者メニュー */}
      {userRole === 'superadmin' && (
        <div className="mb-6">
          <h3 className="text-xs text-gray-500 font-medium mb-3 pl-3">
            システム管理
          </h3>
          <nav className="space-y-1">
            {superAdminMenuItems.map((item) => {
              const isActive = pathname === item.href
              const { Icon } = item
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon size={18} color={isActive ? '#9333ea' : '#6b7280'} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </aside>
  )
}