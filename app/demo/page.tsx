'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CalendarView from '@/components/Calendar/CalendarView'
import AppLayout from '@/components/AppLayout'
import WorkerProfile from '@/components/WorkerProfile'
import AdminProfile from '@/components/AdminProfile'
import { X } from 'lucide-react'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentTenant, setCurrentTenant] = useState<any>(null)
  const [isDWAdmin, setIsDWAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // DW管理者としてテナントにログインしているかチェック
    const tenantData = localStorage.getItem('currentTenant')
    const isDW = localStorage.getItem('isDWAdmin')
    
    if (isDW === 'true' && tenantData) {
      setCurrentTenant(JSON.parse(tenantData))
      setIsDWAdmin(true)
      // テナントの管理者として扱う
      setUser({
        id: 'dw-admin',
        name: 'DW管理者',
        email: 'admin@dandori.com',
        role: 'admin',
        tenantId: JSON.parse(tenantData).id
      })
    } else {
      // 通常のユーザー情報を取得
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
    <>
      {/* DW管理者バナー */}
      {isDWAdmin && currentTenant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              DW管理者として「{currentTenant.companyName}」を操作中
            </span>
            <span style={{ 
              fontSize: '12px', 
              padding: '2px 8px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '4px' 
            }}>
              {currentTenant.plan === 'enterprise' ? 'エンタープライズ' :
               currentTenant.plan === 'pro' ? 'プロ' :
               currentTenant.plan === 'basic' ? 'ベーシック' : '無料'}プラン
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('currentTenant')
              localStorage.removeItem('isDWAdmin')
              router.push('/admin/dashboard')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={16} />
            管理画面に戻る
          </button>
        </div>
      )}
      
      <div style={{ paddingTop: isDWAdmin ? '40px' : '0' }}>
        <AppLayout>
          <div style={{ 
            padding: '16px',
            paddingRight: user ? '360px' : '16px',
            transition: 'padding-right 0.3s ease',
            minHeight: 'calc(100vh - 56px)',
            background: '#ffffff'
          }}>
            <CalendarView 
              selectedWorkers={selectedWorkers}
            />
          </div>
          {/* 職人用プロフィールカード */}
          {user && (user.role === 'worker' || user.role === 'WORKER') && !isDWAdmin && (
            <WorkerProfile user={user} />
          )}
          
          {/* 管理者用プロフィールカード */}
          {user && (user.role === 'admin' || user.role === 'ADMIN') && (
            <AdminProfile user={user} />
          )}
        </AppLayout>
      </div>
    </>
  )
}