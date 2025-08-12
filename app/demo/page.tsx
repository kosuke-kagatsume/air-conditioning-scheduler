'use client'

import { useState, useEffect } from 'react'
import CalendarView from '@/components/Calendar/CalendarView'
import AppLayout from '@/components/AppLayout'
import WorkerProfile from '@/components/WorkerProfile'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // ユーザー情報を取得
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AppLayout>
      <div style={{ 
        padding: '16px',
        paddingRight: user?.role === 'worker' ? '360px' : '16px',
        transition: 'padding-right 0.3s ease'
      }}>
        <CalendarView 
          selectedWorkers={selectedWorkers}
        />
      </div>
      {/* 職人用プロフィールカード */}
      {user?.role === 'worker' && (
        <WorkerProfile user={user} />
      )}
    </AppLayout>
  )
}