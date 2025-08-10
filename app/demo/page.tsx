'use client'

import { useState, useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import CalendarView from '@/components/Calendar/CalendarView'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import PageHeader from '@/components/PageHeader'
import { NotificationIcon, UserIcon } from '@/components/Icons'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'admin' | 'worker'>('admin')
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const [showWorkReportModal, setShowWorkReportModal] = useState(false)
  const [showScheduleChangeModal, setShowScheduleChangeModal] = useState(false)
  const [showContactAdminModal, setShowContactAdminModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 統一ヘッダー */}
        <PageHeader onMenuClick={() => setShowMobileMenu(!showMobileMenu)} />
        

        {/* サイドバー */}
        <Sidebar />
        
        {/* メインコンテンツ */}
        <div className="md:ml-60 pt-4">
          <div className="px-4">
            <CalendarView 
              selectedWorkers={selectedWorkers}
            />
          </div>
        </div>

        {/* モバイルナビ */}
        <MobileNav />
      </div>
    </AuthProvider>
  )
}