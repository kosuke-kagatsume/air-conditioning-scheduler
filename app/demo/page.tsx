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
        
        {/* サブヘッダー（操作バー） */}
        <div className="bg-white/90 backdrop-blur border-b px-4 py-3 sticky top-14 z-40 md:ml-60">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 管理者・職人切り替え */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('admin')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'admin' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  管理者
                </button>
                <button 
                  onClick={() => setViewMode('worker')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'worker' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  職人
                </button>
              </div>
            </div>
            
            {/* 右側アクション */}
            <div className="flex items-center gap-3">
              {/* 通知 */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <NotificationIcon size={20} color="#6b7280" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* 通知パネル */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">通知</h3>
                      <button 
                        onClick={() => setUnreadCount(0)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        すべて既読
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 border-b hover:bg-gray-50">
                        <div className="flex gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">新しい工事依頼</p>
                            <p className="text-sm text-gray-600 mt-1">田中様より空調設置の依頼が届きました。</p>
                            <p className="text-xs text-gray-500 mt-2">5分前</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* ユーザーメニュー */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <UserIcon size={20} color="#6b7280" />
              </button>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <Sidebar />
        
        {/* メインコンテンツ */}
        <div className="md:ml-60 pt-20">
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