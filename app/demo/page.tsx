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
    console.log('Demo page - user data from localStorage:', userData)
    if (userData) {
      const parsedUser = JSON.parse(userData)
      console.log('Demo page - parsed user:', parsedUser)
      setUser(parsedUser)
    }
  }, [])

  if (!mounted) {
    return null
  }

  console.log('Demo page render - user:', user, 'role:', user?.role)

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
      {user && user.role === 'worker' && (
        <>
          {console.log('Rendering WorkerProfile for worker:', user)}
          <WorkerProfile user={user} />
        </>
      )}
      {/* デバッグ情報 */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <div>User: {user ? user.name : 'null'}</div>
        <div>Role: {user ? user.role : 'null'}</div>
        <div>Should show profile: {user?.role === 'worker' ? 'YES' : 'NO'}</div>
      </div>
    </AppLayout>
  )
}