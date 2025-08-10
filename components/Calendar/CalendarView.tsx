'use client'

import React, { useState, useMemo } from 'react'
import { Event } from '@/types'
import { mockEvents, mockWorkerCapacities, mockUsers } from '@/lib/mockData'
import { useAuth } from '@/contexts/AuthContext'
import EventDetailModal from '../EventDetailModal'
import EventCreateModal from '../EventCreateModal'

type ViewType = 'month' | 'week' | 'day'

interface CalendarViewProps {
  selectedWorkers?: string[]
  onEventClick?: (event: Event) => void
}

export default function CalendarView({ selectedWorkers = [], onEventClick }: CalendarViewProps) {
  const { user, currentTenant, canCreateEvent, canViewAllEvents, isMaster, isWorker } = useAuth()
  const [viewType, setViewType] = useState<ViewType>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [eventToUpdate, setEventToUpdate] = useState<Event | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // モバイル検出
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // フィルタリングされたイベント
  const filteredEvents = useMemo(() => {
    let events = [...mockEvents]
    
    // 権限に基づくフィルタリング
    if (!canViewAllEvents) {
      if (isMaster) {
        // 親方は自分と子方の予定を見れる
        const childWorkerIds = mockUsers
          .filter(u => u.parentId === user?.id)
          .map(u => u.id)
        events = events.filter(e => 
          e.workerId === user?.id || childWorkerIds.includes(e.workerId)
        )
      } else if (isWorker) {
        // 子方は自分の予定のみ
        events = events.filter(e => e.workerId === user?.id)
      }
    }
    
    // 選択されたワーカーでフィルタリング
    if (selectedWorkers.length > 0) {
      events = events.filter(e => selectedWorkers.includes(e.workerId))
    }
    
    // ステータスフィルタリング
    if (statusFilter !== 'all') {
      events = events.filter(e => e.status === statusFilter)
    }
    
    return events
  }, [canViewAllEvents, isMaster, isWorker, user, selectedWorkers, statusFilter])

  // 日付関連のユーティリティ
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // 前月の日付を追加
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateStr: prevDate.toISOString().split('T')[0]
      })
    }
    
    // 当月の日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dateStr: currentDate.toISOString().split('T')[0]
      })
    }
    
    // 次月の日付を追加（6週分にする）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateStr: nextDate.toISOString().split('T')[0]
      })
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek)
      currentDate.setDate(startOfWeek.getDate() + i)
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dateStr: currentDate.toISOString().split('T')[0]
      })
    }
    
    return days
  }

  const monthDays = getMonthDays(currentDate)
  const weekDays = getWeekDays(currentDate)
  const todayStr = new Date().toISOString().split('T')[0]

  // ナビゲーション
  const navigatePrev = () => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (dateStr: string) => {
    if (canCreateEvent) {
      setSelectedDate(dateStr)
      setShowCreateModal(true)
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    if (onEventClick) {
      onEventClick(event)
    }
  }

  const handleStatusChange = (event: Event) => {
    setEventToUpdate(event)
    setShowStatusModal(true)
  }

  // タッチイベント用のロングプレス検出
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null)
  
  const handleTouchStart = (event: Event) => {
    if (isMobile) {
      const timer = setTimeout(() => {
        handleStatusChange(event)
      }, 500) // 500ms長押しでステータス変更モーダルを表示
      setTouchTimer(timer)
    }
  }
  
  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer)
      setTouchTimer(null)
    }
  }

  const updateEventStatus = (newStatus: Event['status']) => {
    if (eventToUpdate) {
      // ここで実際にはAPIを呼び出してステータスを更新
      const index = mockEvents.findIndex(e => e.id === eventToUpdate.id)
      if (index !== -1) {
        mockEvents[index].status = newStatus
      }
      setShowStatusModal(false)
      setEventToUpdate(null)
      // 更新成功のフィードバック
      alert(`ステータスを「${getStatusLabel(newStatus)}」に変更しました`)
    }
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'accepted': return '#22c55e'
      case 'proposed': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'onHold': return '#6b7280'
      case 'completed': return '#8b5cf6'
      case 'rejected': return '#ef4444'
      case 'cancelled': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'accepted': return '確定'
      case 'proposed': return '提案中'
      case 'pending': return '保留'
      case 'onHold': return '保留中'
      case 'completed': return '完了'
      case 'rejected': return '却下'
      case 'cancelled': return 'キャンセル'
      default: return status
    }
  }

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: isMobile ? '0' : '12px', 
      padding: isMobile ? '12px' : '20px',
      marginBottom: isMobile ? '60px' : '0'
    }}>
      {/* カレンダーヘッダー */}
      <div style={{ marginBottom: isMobile ? '12px' : '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isMobile ? '12px' : '16px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '8px' : '0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '8px' : '12px',
            width: isMobile ? '100%' : 'auto'
          }}>
            <button
              onClick={navigatePrev}
              style={{
                width: isMobile ? '36px' : '32px',
                height: isMobile ? '36px' : '32px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>
            <button
              onClick={navigateNext}
              style={{
                width: isMobile ? '36px' : '32px',
                height: isMobile ? '36px' : '32px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
            <h2 style={{
              fontSize: isMobile ? '16px' : '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: isMobile ? '0 8px' : '0 12px',
              flex: isMobile ? 1 : 'initial',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              {viewType === 'month' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`}
              {viewType === 'week' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月 第${Math.ceil(currentDate.getDate() / 7)}週`}
              {viewType === 'day' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`}
            </h2>
            {isMobile && (
              <button
                onClick={navigateToday}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                今日
              </button>
            )}
          </div>
          
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={navigateToday}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                今日
              </button>

              {canCreateEvent && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: '6px 16px',
                    background: '#ff6b6b',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>+</span>
                  <span>予定作成</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ビュー切り替えボタン（上部） */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '8px' : '12px', 
          marginBottom: '12px',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: isMobile ? '4px' : '0'
        }}>
          {isMobile && canCreateEvent && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '8px 12px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              + 予定
            </button>
          )}
          {!isMobile && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '6px 12px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#374151'
              }}
            >
              + 予定作成
            </button>
          )}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setViewType('month')}
              style={{
                padding: isMobile ? '8px 12px' : '6px 12px',
                background: viewType === 'month' ? '#3b82f6' : 'transparent',
                color: viewType === 'month' ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              月
            </button>
            <button
              onClick={() => setViewType('week')}
              style={{
                padding: isMobile ? '8px 12px' : '6px 12px',
                background: viewType === 'week' ? '#3b82f6' : 'transparent',
                color: viewType === 'week' ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              週
            </button>
            <button
              onClick={() => setViewType('day')}
              style={{
                padding: isMobile ? '8px 12px' : '6px 12px',
                background: viewType === 'day' ? '#3b82f6' : 'transparent',
                color: viewType === 'day' ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              日
            </button>
          </div>
          <button
            onClick={() => setStatusFilter(statusFilter === 'accepted' ? 'all' : 'accepted')}
            style={{
              padding: isMobile ? '8px 12px' : '6px 12px',
              background: statusFilter === 'accepted' ? '#22c55e' : 'transparent',
              border: statusFilter === 'accepted' ? '1px solid #22c55e' : '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: statusFilter === 'accepted' ? 'white' : '#6b7280',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            確定
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'proposed' ? 'all' : 'proposed')}
            style={{
              padding: isMobile ? '8px 12px' : '6px 12px',
              background: statusFilter === 'proposed' ? '#3b82f6' : 'transparent',
              border: statusFilter === 'proposed' ? '1px solid #3b82f6' : '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: statusFilter === 'proposed' ? 'white' : '#6b7280',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            提案中
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
            style={{
              padding: isMobile ? '8px 12px' : '6px 12px',
              background: statusFilter === 'pending' ? '#f59e0b' : 'transparent',
              border: statusFilter === 'pending' ? '1px solid #f59e0b' : '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: statusFilter === 'pending' ? 'white' : '#6b7280',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            保留
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
            style={{
              padding: isMobile ? '8px 12px' : '6px 12px',
              background: statusFilter === 'completed' ? '#8b5cf6' : 'transparent',
              border: statusFilter === 'completed' ? '1px solid #8b5cf6' : '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: statusFilter === 'completed' ? 'white' : '#6b7280',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            完了
          </button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div>
        {viewType === 'month' && (
          <div>
            {/* モバイル用シンプルカレンダー */}
            {isMobile ? (
              <div style={{ width: '100%', background: 'white' }}>
                {/* 曜日ヘッダー */}
                <div style={{ 
                  display: 'flex',
                  width: '100%',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                    <div
                      key={day}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        fontSize: '11px',
                        fontWeight: '500',
                        textAlign: 'center',
                        color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#374151',
                        background: 'white'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* 日付グリッド - フレックスボックス使用 */}
                {Array.from({ length: Math.ceil(monthDays.length / 7) }).map((_, weekIndex) => (
                  <div key={weekIndex} style={{ 
                    display: 'flex',
                    width: '100%'
                  }}>
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const day = monthDays[weekIndex * 7 + dayIndex]
                      if (!day) {
                        return (
                          <div key={dayIndex} style={{
                            flex: 1,
                            height: '45px',
                            border: '1px solid #e5e7eb',
                            borderTop: 'none',
                            borderLeft: dayIndex === 0 ? '1px solid #e5e7eb' : 'none'
                          }} />
                        )
                      }
                      const dayEvents = filteredEvents.filter(e => e.date === day.dateStr)
                      const isToday = day.dateStr === todayStr
                      
                      return (
                        <div
                          key={dayIndex}
                          style={{
                            flex: 1,
                            height: '45px',
                            padding: '2px',
                            border: '1px solid #e5e7eb',
                            borderTop: 'none',
                            borderLeft: dayIndex === 0 ? '1px solid #e5e7eb' : 'none',
                            background: day.isCurrentMonth ? 'white' : '#f9fafb',
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleDateClick(day.dateStr)}
                        >
                          {isToday && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: '#3b82f6'
                            }} />
                          )}
                          <div style={{
                            fontSize: '10px',
                            fontWeight: isToday ? '600' : '400',
                            textAlign: 'center',
                            color: !day.isCurrentMonth ? '#9ca3af' : 
                              day.date.getDay() === 0 ? '#ef4444' : 
                              day.date.getDay() === 6 ? '#3b82f6' : 
                              '#1f2937'
                          }}>
                            {day.date.getDate()}
                          </div>
                          {dayEvents.length > 0 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'center',
                              marginTop: '2px',
                              gap: '1px'
                            }}>
                              {dayEvents.slice(0, 3).map((event, i) => (
                                <div
                                  key={i}
                                  style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: getStatusColor(event.status)
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              // デスクトップ用の既存のレイアウト
              <>
                {/* 曜日ヘッダー */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '1px',
                  background: '#e5e7eb',
                  borderRadius: '8px 8px 0 0',
                  overflow: 'hidden'
                }}>
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                    <div
                      key={day}
                      style={{
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '12px 0',
                        background: '#f9fafb',
                        color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#374151'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* 日付グリッド */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(7, 1fr)', 
                  gap: '1px',
                  background: '#e5e7eb'
                }}>
                  {monthDays.map((day, index) => {
                    const dayEvents = filteredEvents.filter(e => e.date === day.dateStr)
                    const isToday = day.dateStr === todayStr
                    
                    return (
                      <div
                        key={index}
                        style={{
                          minHeight: '100px',
                          padding: '8px',
                          cursor: 'pointer',
                          background: day.isCurrentMonth ? 'white' : '#f9fafb',
                          position: 'relative'
                        }}
                        onClick={() => handleDateClick(day.dateStr)}
                      >
                        {isToday && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: '#3b82f6'
                          }} />
                        )}
                        <div style={{
                          fontSize: '14px',
                          fontWeight: isToday ? '600' : '400',
                          marginBottom: '4px',
                          color: !day.isCurrentMonth ? '#9ca3af' : 
                            day.date.getDay() === 0 ? '#ef4444' : 
                            day.date.getDay() === 6 ? '#3b82f6' : 
                            '#1f2937'
                        }}>
                          {day.date.getDate()}
                        </div>
                        
                        {/* イベント表示 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEventClick(event)
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleStatusChange(event)
                              }}
                              style={{
                                fontSize: '11px',
                                padding: '4px 6px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                background: event.status === 'accepted' ? '#dcfce7' :
                                  event.status === 'proposed' ? '#dbeafe' :
                                  event.status === 'pending' ? '#fef3c7' :
                                  event.status === 'completed' ? '#ede9fe' :
                                  event.status === 'onHold' ? '#f3f4f6' :
                                  event.status === 'rejected' ? '#fee2e2' : 
                                  event.status === 'cancelled' ? '#fecaca' : '#e5e7eb',
                                borderLeft: `3px solid ${getStatusColor(event.status)}`,
                                color: '#1f2937',
                                position: 'relative'
                              }}
                            >
                              <div style={{ 
                                fontSize: '10px', 
                                marginBottom: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span style={{
                                  display: 'inline-block',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: getStatusColor(event.status)
                                }} />
                                {event.startTime}
                              </div>
                              <div style={{ fontSize: '10px', fontWeight: '500' }}>
                                {event.constructionType}
                              </div>
                              <div style={{ fontSize: '9px', color: '#6b7280' }}>
                                {event.city}
                              </div>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div style={{ 
                              fontSize: '10px', 
                              color: '#6b7280', 
                              textAlign: 'center' 
                            }}>
                              +{dayEvents.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {viewType === 'week' && (
          <div>
            {/* 週表示 - 横スクロール可能な時間軸 */}
            <div style={{ display: 'flex', gap: '1px', background: '#e5e7eb' }}>
              {/* 時間軸 */}
              <div style={{ width: '60px', background: '#f9fafb' }}>
                <div style={{ height: '40px', borderBottom: '1px solid #e5e7eb' }}></div>
                {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                  <div key={hour} style={{
                    height: '60px',
                    padding: '4px',
                    fontSize: '11px',
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    {hour}:00
                  </div>
                ))}
              </div>
              
              {/* 各曜日の列 */}
              {weekDays.map((day, index) => {
                const dayEvents = filteredEvents.filter(e => e.date === day.dateStr)
                const isToday = day.dateStr === todayStr
                
                return (
                  <div key={index} style={{ flex: 1, background: 'white', minWidth: '120px' }}>
                    <div style={{
                      height: '40px',
                      padding: '8px',
                      borderBottom: '1px solid #e5e7eb',
                      background: isToday ? '#dbeafe' : '#f9fafb',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: day.date.getDay() === 0 ? '#ef4444' : 
                        day.date.getDay() === 6 ? '#3b82f6' : '#1f2937'
                    }}>
                      {['日', '月', '火', '水', '木', '金', '土'][day.date.getDay()]} {day.date.getDate()}日
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                      {Array.from({ length: 14 }, (_, i) => (
                        <div key={i} style={{
                          height: '60px',
                          borderBottom: '1px solid #e5e7eb'
                        }}></div>
                      ))}
                      
                      {/* イベント配置 */}
                      {dayEvents.map(event => {
                        const startHour = parseInt(event.startTime.split(':')[0])
                        const startMinute = parseInt(event.startTime.split(':')[1])
                        const top = ((startHour - 7) * 60) + (startMinute / 60 * 60)
                        
                        return (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            style={{
                              position: 'absolute',
                              left: '4px',
                              right: '4px',
                              top: `${top}px`,
                              minHeight: '40px',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              background: event.status === 'accepted' ? '#86efac' :
                                event.status === 'proposed' ? '#93c5fd' :
                                event.status === 'pending' ? '#fde047' : '#e5e7eb',
                              border: '1px solid',
                              borderColor: event.status === 'accepted' ? '#22c55e' :
                                event.status === 'proposed' ? '#3b82f6' :
                                event.status === 'pending' ? '#eab308' : '#9ca3af'
                            }}
                          >
                            <div style={{ fontWeight: '500' }}>{event.startTime}</div>
                            <div>{event.constructionType}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewType === 'day' && (
          <div>
            {/* 日表示 */}
            <div style={{ display: 'flex', gap: '1px', background: '#e5e7eb' }}>
              {/* 時間軸 */}
              <div style={{ width: '80px', background: '#f9fafb' }}>
                {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                  <div key={hour} style={{
                    height: '80px',
                    padding: '8px',
                    fontSize: '13px',
                    color: '#6b7280',
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'right'
                  }}>
                    {hour}:00
                  </div>
                ))}
              </div>
              
              {/* イベントエリア */}
              <div style={{ flex: 1, background: 'white', position: 'relative', minHeight: '1120px' }}>
                {/* 時間線 */}
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${i * 80}px`,
                    height: '1px',
                    background: '#e5e7eb'
                  }}></div>
                ))}
                
                {/* 当日のイベント */}
                {filteredEvents
                  .filter(e => e.date === currentDate.toISOString().split('T')[0])
                  .map(event => {
                    const startHour = parseInt(event.startTime.split(':')[0])
                    const startMinute = parseInt(event.startTime.split(':')[1])
                    const endHour = event.endTime ? parseInt(event.endTime.split(':')[0]) : startHour + 2
                    const endMinute = event.endTime ? parseInt(event.endTime.split(':')[1]) : startMinute
                    
                    const top = ((startHour - 7) * 80) + (startMinute / 60 * 80)
                    const height = ((endHour - startHour) * 80) + ((endMinute - startMinute) / 60 * 80)
                    
                    return (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        style={{
                          position: 'absolute',
                          left: '20px',
                          right: '20px',
                          top: `${top}px`,
                          height: `${height}px`,
                          minHeight: '60px',
                          padding: '12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: event.status === 'accepted' ? '#dcfce7' :
                            event.status === 'proposed' ? '#dbeafe' :
                            event.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                          border: '2px solid',
                          borderColor: event.status === 'accepted' ? '#22c55e' :
                            event.status === 'proposed' ? '#3b82f6' :
                            event.status === 'pending' ? '#eab308' : '#9ca3af'
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            {event.startTime} - {event.endTime || '未定'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                          {event.constructionType}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          📍 {event.city} {event.address}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          👤 {event.clientName}（{event.constructorName}）
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* モーダル */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onStatusChange={(eventId, status, message) => {
            // EventDetailModalから直接ステータス変更を受け取る
            const eventToChange = filteredEvents.find(e => e.id === eventId)
            if (eventToChange) {
              handleStatusChange(eventToChange)
            }
          }}
        />
      )}
      
      {showCreateModal && (
        <EventCreateModal
          initialDate={selectedDate}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedDate('')
          }}
        />
      )}

      {/* ステータス変更モーダル */}
      {showStatusModal && eventToUpdate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#1f2937'
            }}>
              ステータス変更
            </h3>
            
            <div style={{
              marginBottom: '20px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                予定
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {eventToUpdate.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {eventToUpdate.date} {eventToUpdate.startTime}-{eventToUpdate.endTime}
              </div>
            </div>

            <div style={{
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                現在のステータス: <span style={{ color: getStatusColor(eventToUpdate.status) }}>
                  {getStatusLabel(eventToUpdate.status)}
                </span>
              </div>
              
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                新しいステータス:
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {(['accepted', 'proposed', 'pending', 'onHold', 'completed', 'rejected', 'cancelled'] as Event['status'][]).map(status => (
                  <button
                    key={status}
                    onClick={() => updateEventStatus(status)}
                    disabled={eventToUpdate.status === status}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${eventToUpdate.status === status ? '#e5e7eb' : getStatusColor(status)}`,
                      background: eventToUpdate.status === status ? '#f9fafb' : 'white',
                      cursor: eventToUpdate.status === status ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: eventToUpdate.status === status ? '#9ca3af' : getStatusColor(status),
                      opacity: eventToUpdate.status === status ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (eventToUpdate.status !== status) {
                        e.currentTarget.style.background = `${getStatusColor(status)}15`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (eventToUpdate.status !== status) {
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setEventToUpdate(null)
                }}
                style={{
                  padding: '8px 20px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}