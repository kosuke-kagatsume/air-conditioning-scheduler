'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImprovedCalendar from '@/components/ImprovedCalendar'
import MultiDayEventForm from '@/components/MultiDayEventForm'
import EventDetailModal from '@/components/EventDetailModal'
import AppLayout from '@/components/AppLayout'
import WorkerProfile from '@/components/WorkerProfile'
import AdminProfile from '@/components/AdminProfile'
import { X } from 'lucide-react'
import { mockEvents, mockUsers } from '@/lib/mockData'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentTenant, setCurrentTenant] = useState<any>(null)
  const [isDWAdmin, setIsDWAdmin] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<any[]>([])
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
        role: 'ADMIN',
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
    
    // イベントデータを新しいカレンダー形式にマッピング
    const mappedEvents = mockEvents.map(event => ({
      id: event.id,
      title: event.title || `${event.constructionType} - ${event.clientName}`,
      startDate: event.date,
      endDate: event.date,
      startTime: event.startTime,
      endTime: event.endTime || '18:00',
      isMultiDay: false,
      color: getEventColor(event.status),
      workerId: event.workerId,
      workerName: event.workerName || mockUsers.find(u => u.id === event.workerId)?.name,
      siteName: event.city || event.address,
      constructionType: event.constructionType
    }))
    
    // 複数日イベントのサンプルを追加
    const today = new Date()
    const multiDayEvents = [
      {
        id: 'multi-1',
        title: '品川ビル大規模改修',
        startDate: new Date(today.getFullYear(), today.getMonth(), 25).toISOString().split('T')[0],
        endDate: new Date(today.getFullYear(), today.getMonth(), 28).toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '17:00',
        isMultiDay: true,
        color: '#fef3c7',
        workerId: 'user-2',
        workerName: '鈴木一郎',
        siteName: '品川',
        constructionType: 'エアコン設置工事'
      },
      {
        id: 'multi-2',
        title: '渋谷タワー空調システム',
        startDate: new Date(today.getFullYear(), today.getMonth() + 1, 2).toISOString().split('T')[0],
        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 5).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '18:00',
        isMultiDay: true,
        color: '#dcfce7',
        workerId: 'user-3',
        workerName: '佐藤次郎',
        siteName: '渋谷',
        constructionType: '大型空調システム設置'
      },
      {
        id: 'multi-3',
        title: '新宿プラザ定期点検',
        startDate: new Date(today.getFullYear(), today.getMonth(), 15).toISOString().split('T')[0],
        endDate: new Date(today.getFullYear(), today.getMonth(), 16).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '16:00',
        isMultiDay: true,
        color: '#dbeafe',
        workerId: 'user-4',
        workerName: '田中太郎',
        siteName: '新宿',
        constructionType: '定期メンテナンス'
      }
    ]
    
    setEvents([...mappedEvents, ...multiDayEvents])
    
    setLoading(false)
  }, [])

  // イベントの色を取得
  const getEventColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'SCHEDULED':
        return '#dcfce7'
      case 'proposed':
        return '#dbeafe'
      case 'pending':
        return '#fef3c7'
      case 'completed':
      case 'COMPLETED':
        return '#ede9fe'
      default:
        return '#e0e7ff'
    }
  }

  // 日付クリックハンドラー
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventForm(true)
  }

  // イベントクリックハンドラー
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  // 新規イベント追加ハンドラー
  const handleAddEvent = () => {
    setSelectedDate(new Date())
    setShowEventForm(true)
  }

  // イベント送信ハンドラー
  const handleEventSubmit = (eventData: any) => {
    const newEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      color: '#dbeafe'
    }
    setEvents([...events, newEvent])
    setShowEventForm(false)
    setSelectedDate(null)
  }

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
            minHeight: 'calc(100vh - 56px)',
            background: '#ffffff',
            position: 'relative'
          }}>
            {/* メインコンテンツエリア */}
            <div style={{ 
              display: 'flex',
              gap: '20px',
              height: '100%'
            }}>
              {/* カレンダーエリア */}
              <div style={{ 
                flex: 1,
                minWidth: 0,
                overflow: 'auto'
              }}>
                <ImprovedCalendar 
                  events={events}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                  onAddEvent={handleAddEvent}
                />
              </div>
              
              {/* 右側のプロファイル表示 */}
              <div style={{
                width: '340px',
                flexShrink: 0
              }}>
                {user?.role === 'WORKER' ? (
                  <WorkerProfile user={user} />
                ) : (
                  <AdminProfile user={user} />
                )}
              </div>
            </div>
          </div>
        </AppLayout>
      </div>

      {/* 複数日イベント作成フォーム */}
      <MultiDayEventForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false)
          setSelectedDate(null)
        }}
        onSubmit={handleEventSubmit}
        initialDate={selectedDate || undefined}
        workers={mockUsers.filter(u => u.role === 'worker' || u.role === 'master').map(u => ({ 
          id: u.id, 
          name: u.name 
        }))}
        sites={[
          { id: 'site-1', name: '東京ビル', address: '東京都千代田区丸の内1-1-1' },
          { id: 'site-2', name: '渋谷タワー', address: '東京都渋谷区渋谷2-2-2' },
          { id: 'site-3', name: '新宿プラザ', address: '東京都新宿区西新宿3-3-3' },
          { id: 'site-4', name: '品川センター', address: '東京都港区港南4-4-4' },
          { id: 'site-5', name: '池袋スクエア', address: '東京都豊島区東池袋5-5-5' }
        ]}
      />

      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onStatusChange={(eventId, status, message) => {
            const updatedEvents = events.map(e => 
              e.id === eventId ? { ...e, status, color: getEventColor(status) } : e
            )
            setEvents(updatedEvents)
            setSelectedEvent(null)
          }}
        />
      )}
    </>
  )
}