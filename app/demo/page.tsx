'use client'

import { useState, useEffect } from 'react'
import CalendarView from '@/components/Calendar/CalendarView'
import AppLayout from '@/components/AppLayout'
import WorkerProfile from '@/components/WorkerProfile'
import { AuthProvider } from '@/contexts/AuthContext'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // ユーザー情報を取得
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('User loaded:', parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setLoading(false)
  }, [])

  if (!mounted || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f9fafb'
      }}>
        <div>読み込み中...</div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <AppLayout>
        <div style={{ 
          padding: '16px',
          paddingRight: (user?.role === 'worker' || user?.role === 'WORKER') ? '360px' : '16px',
          transition: 'padding-right 0.3s ease',
          minHeight: 'calc(100vh - 56px)',
          background: '#ffffff'
        }}>
          <CalendarView 
            selectedWorkers={selectedWorkers}
          />
        </div>
        {/* 職人用プロフィールカード */}
        {user && (user.role === 'worker' || user.role === 'WORKER') && (
          <WorkerProfile user={user} />
        )}
      </AppLayout>
    </AuthProvider>
  )
}