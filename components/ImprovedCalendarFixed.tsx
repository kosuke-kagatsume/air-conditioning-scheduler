'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, User } from 'lucide-react'

interface Event {
  id: string
  title: string
  startDate: string
  endDate?: string
  startTime: string
  endTime: string
  isMultiDay: boolean
  color: string
  workerId?: string
  workerName?: string
  siteName?: string
  constructionType?: string
  date?: string
}

interface CalendarProps {
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}

export default function ImprovedCalendarFixed({ events, onDateClick, onEventClick, onAddEvent }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // ステータスに基づいてイベントをフィルタリング
  const filteredEvents = useMemo(() => {
    if (statusFilter === 'all') return events
    
    return events.filter(event => {
      const getStatus = (color: string) => {
        switch (color) {
          case '#dcfce7': return 'confirmed'
          case '#dbeafe': return 'proposed'
          case '#fef3c7': return 'pending'
          case '#ede9fe': return 'completed'
          default: return 'proposed'
        }
      }
      
      const eventStatus = getStatus(event.color)
      return eventStatus === statusFilter
    })
  }, [events, statusFilter])

  // カレンダーの日付を生成
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }, [currentMonth])

  // 日付のイベントを取得
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayEvents = filteredEvents.filter(event => {
      if (!event) return false
      
      if (event.isMultiDay) {
        const start = new Date(event.startDate + 'T00:00:00')
        const end = new Date((event.endDate || event.startDate) + 'T23:59:59')
        const checkDate = new Date(dateStr + 'T12:00:00')
        return checkDate >= start && checkDate <= end
      }
      
      return event.startDate === dateStr || event.date === dateStr
    })
    
    return dayEvents
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowDayModal(true)
  }

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {/* カレンダーヘッダー */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={previousMonth} style={{
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: '#f3f4f6',
            cursor: 'pointer'
          }}>
            <ChevronLeft size={20} />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
            {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
          </h2>
          <button onClick={nextMonth} style={{
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: '#f3f4f6',
            cursor: 'pointer'
          }}>
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* ビュー切り替えボタン */}
          <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setViewType('month')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: viewType === 'month' ? 'white' : 'transparent',
                color: viewType === 'month' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: viewType === 'month' ? '600' : '400'
              }}
            >
              月
            </button>
            <button 
              onClick={() => setViewType('week')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: viewType === 'week' ? 'white' : 'transparent',
                color: viewType === 'week' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: viewType === 'week' ? '600' : '400'
              }}
            >
              週
            </button>
            <button 
              onClick={() => setViewType('day')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: viewType === 'day' ? 'white' : 'transparent',
                color: viewType === 'day' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: viewType === 'day' ? '600' : '400'
              }}
            >
              日
            </button>
          </div>

          {/* ステータスフィルターボタン */}
          <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: statusFilter === 'all' ? 'white' : 'transparent',
                color: statusFilter === 'all' ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: statusFilter === 'all' ? '600' : '400'
              }}
            >
              全て
            </button>
            <button 
              onClick={() => setStatusFilter('confirmed')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: statusFilter === 'confirmed' ? '#dcfce7' : 'transparent',
                color: statusFilter === 'confirmed' ? '#16a34a' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: statusFilter === 'confirmed' ? '600' : '400'
              }}
            >
              確定
            </button>
            <button 
              onClick={() => setStatusFilter('proposed')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: statusFilter === 'proposed' ? '#dbeafe' : 'transparent',
                color: statusFilter === 'proposed' ? '#2563eb' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: statusFilter === 'proposed' ? '600' : '400'
              }}
            >
              提案中
            </button>
            <button 
              onClick={() => setStatusFilter('pending')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: statusFilter === 'pending' ? '#fef3c7' : 'transparent',
                color: statusFilter === 'pending' ? '#d97706' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: statusFilter === 'pending' ? '600' : '400'
              }}
            >
              保留
            </button>
            <button 
              onClick={() => setStatusFilter('completed')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                background: statusFilter === 'completed' ? '#ede9fe' : 'transparent',
                color: statusFilter === 'completed' ? '#7c3aed' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: statusFilter === 'completed' ? '600' : '400'
              }}
            >
              完了
            </button>
          </div>

          <button onClick={onAddEvent} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            background: '#3b82f6',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            <Plus size={18} />
            予定作成
          </button>
        </div>
      </div>

      {/* 月表示 */}
      {viewType === 'month' && (
        <>
          {/* 曜日ヘッダー */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            marginBottom: '8px'
          }}>
            {weekDays.map((day, index) => (
              <div key={day} style={{
                padding: '12px 0',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: index === 0 ? '#dc2626' : index === 6 ? '#2563eb' : '#6b7280'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* カレンダー本体 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#e5e7eb'
          }}>
            {calendarDays.map((date, index) => {
              const dayEvents = getEventsForDate(date)
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div key={index} style={{
                  minHeight: '100px',
                  backgroundColor: isToday ? '#eff6ff' : 'white',
                  padding: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  opacity: isCurrentMonth ? 1 : 0.5
                }}
                onClick={() => handleDateClick(date)}
                >
                  {/* 日付 */}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isToday ? '700' : '400',
                    color: date.getDay() === 0 ? '#dc2626' : date.getDay() === 6 ? '#2563eb' : '#374151',
                    marginBottom: '4px'
                  }}>
                    {date.getDate()}
                  </div>
                  
                  {/* イベントプレビュー */}
                  <div style={{ fontSize: '12px' }}>
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <div key={i} style={{
                        padding: '2px 4px',
                        marginBottom: '2px',
                        borderRadius: '4px',
                        backgroundColor: event.color || '#e0e7ff',
                        color: '#1e40af',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      >
                        <span style={{ fontSize: '11px' }}>
                          {event.isMultiDay ? '◆ ' : `${event.startTime} `}
                          {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                        </span>
                      </div>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        textAlign: 'center',
                        padding: '2px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '4px'
                      }}>
                        +{dayEvents.length - 2}件
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* 週表示 */}
      {viewType === 'week' && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '80px repeat(7, 1fr)',
            gap: '1px',
            backgroundColor: '#e5e7eb',
            marginTop: '20px'
          }}>
            {/* 時間ヘッダー */}
            <div style={{ backgroundColor: 'white', padding: '8px', fontSize: '12px', fontWeight: '600' }}>時間</div>
            {/* 週の日付ヘッダー */}
            {(() => {
              const weekStart = new Date(currentMonth)
              const currentDayOfWeek = weekStart.getDay()
              weekStart.setDate(weekStart.getDate() - currentDayOfWeek)
              
              return Array.from({ length: 7 }, (_, i) => {
                const day = new Date(weekStart)
                day.setDate(weekStart.getDate() + i)
                const isToday = day.toDateString() === new Date().toDateString()
                return (
                  <div key={i} style={{ 
                    backgroundColor: isToday ? '#eff6ff' : 'white', 
                    padding: '8px', 
                    textAlign: 'center',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: i === 0 ? '#dc2626' : i === 6 ? '#2563eb' : '#6b7280',
                      fontWeight: '600'
                    }}>
                      {weekDays[i]}
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: isToday ? '700' : '600',
                      color: i === 0 ? '#dc2626' : i === 6 ? '#2563eb' : '#374151'
                    }}>
                      {day.getDate()}
                    </div>
                  </div>
                )
              })
            })()}
            
            {/* 時間スロット */}
            {Array.from({ length: 10 }, (_, hourIndex) => {
              const hour = 8 + hourIndex
              const weekStart = new Date(currentMonth)
              const currentDayOfWeek = weekStart.getDay()
              weekStart.setDate(weekStart.getDate() - currentDayOfWeek)
              
              const hourSlots = []
              
              // 時間ラベル
              hourSlots.push(
                <div key={`time-${hour}`} style={{ 
                  backgroundColor: '#f9fafb', 
                  padding: '8px', 
                  fontSize: '12px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {hour}:00
                </div>
              )
              
              // 各曜日のスロット
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const slotDate = new Date(weekStart)
                slotDate.setDate(weekStart.getDate() + dayIndex)
                const dateStr = slotDate.toISOString().split('T')[0]
                
                const hourEvents = filteredEvents.filter(event => {
                  if (event.startDate === dateStr || event.date === dateStr) {
                    const eventHour = parseInt(event.startTime.split(':')[0])
                    return eventHour === hour
                  }
                  // 複数日イベントの場合
                  if (event.isMultiDay) {
                    const start = new Date(event.startDate + 'T00:00:00')
                    const end = new Date((event.endDate || event.startDate) + 'T23:59:59')
                    const checkDate = new Date(dateStr + 'T12:00:00')
                    if (checkDate >= start && checkDate <= end) {
                      const eventHour = parseInt(event.startTime.split(':')[0])
                      return eventHour === hour
                    }
                  }
                  return false
                })
                
                hourSlots.push(
                  <div key={`${hour}-${dayIndex}`} style={{ 
                    backgroundColor: 'white', 
                    padding: '4px',
                    minHeight: '60px',
                    cursor: 'pointer',
                    borderRight: dayIndex === 6 ? 'none' : '1px solid #f3f4f6'
                  }}
                  onClick={() => handleDateClick(slotDate)}
                  >
                    {hourEvents.map((event, i) => (
                      <div key={i} style={{
                        padding: '2px 4px',
                        marginBottom: '2px',
                        borderRadius: '4px',
                        backgroundColor: event.color || '#e0e7ff',
                        fontSize: '11px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      >
                        {event.isMultiDay && '◆ '}
                        {event.title.length > 10 ? event.title.substring(0, 10) + '...' : event.title}
                      </div>
                    ))}
                  </div>
                )
              }
              
              return hourSlots
            }).flat()}
          </div>
        </>
      )}

      {/* 日表示 */}
      {viewType === 'day' && (
        <>
          <div style={{ 
            marginTop: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              padding: '16px',
              borderBottom: '2px solid #e5e7eb',
              background: currentMonth.toDateString() === new Date().toDateString() ? '#eff6ff' : 'white'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar size={20} />
                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月{currentMonth.getDate()}日
                {currentMonth.toDateString() === new Date().toDateString() && (
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '2px 8px', 
                    background: '#3b82f6', 
                    color: 'white',
                    borderRadius: '4px'
                  }}>
                    今日
                  </span>
                )}
              </h3>
            </div>
            
            {/* タイムライン */}
            <div style={{ padding: '0' }}>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = 8 + i
                const dateStr = currentMonth.toISOString().split('T')[0]
                const hourEvents = filteredEvents.filter(event => {
                  if (event.startDate === dateStr || event.date === dateStr) {
                    const eventStartHour = parseInt(event.startTime.split(':')[0])
                    const eventEndHour = parseInt(event.endTime.split(':')[0])
                    // イベントがこの時間帯に含まれるかチェック
                    return eventStartHour <= hour && hour < eventEndHour
                  }
                  // 複数日イベントの場合
                  if (event.isMultiDay) {
                    const start = new Date(event.startDate + 'T00:00:00')
                    const end = new Date((event.endDate || event.startDate) + 'T23:59:59')
                    const checkDate = new Date(dateStr + 'T12:00:00')
                    if (checkDate >= start && checkDate <= end) {
                      const eventStartHour = parseInt(event.startTime.split(':')[0])
                      const eventEndHour = parseInt(event.endTime.split(':')[0])
                      return eventStartHour <= hour && hour < eventEndHour
                    }
                  }
                  return false
                })
                
                // この時間に開始するイベントのみを表示用にフィルター
                const startingEvents = hourEvents.filter(event => {
                  const eventStartHour = parseInt(event.startTime.split(':')[0])
                  return eventStartHour === hour
                })
                
                const isNow = new Date().getHours() === hour && 
                              currentMonth.toDateString() === new Date().toDateString()
                
                return (
                  <div key={hour} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '80px 1fr',
                    borderBottom: i === 11 ? 'none' : '1px solid #e5e7eb',
                    backgroundColor: isNow ? '#fef3c7' : 'white'
                  }}>
                    <div style={{ 
                      padding: '12px',
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: '#6b7280',
                      backgroundColor: '#f9fafb',
                      borderRight: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      {hour}:00
                    </div>
                    <div style={{ 
                      padding: '8px',
                      minHeight: '60px'
                    }}>
                      {hourEvents.length > 0 ? (
                        <div style={{ position: 'relative', height: '100%', minHeight: '60px' }}>
                          {/* 継続中のイベントの背景表示 */}
                          {hourEvents.map((event, idx) => {
                            const eventStartHour = parseInt(event.startTime.split(':')[0])
                            const eventEndHour = parseInt(event.endTime.split(':')[0])
                            const isStarting = eventStartHour === hour
                            const isEnding = eventEndHour === hour + 1
                            
                            if (!isStarting) {
                              // 継続中のイベントの背景
                              return (
                                <div key={`bg-${idx}`} style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: event.color || '#e0e7ff',
                                  opacity: 0.3,
                                  borderLeft: '3px solid',
                                  borderLeftColor: event.color || '#3b82f6',
                                  borderBottom: isEnding ? 'none' : '1px dashed #e5e7eb'
                                }} />
                              )
                            }
                            return null
                          })}
                          
                          {/* 開始するイベントのみ詳細表示 */}
                          {startingEvents.map((event, i) => {
                            const eventStartHour = parseInt(event.startTime.split(':')[0])
                            const eventEndHour = parseInt(event.endTime.split(':')[0])
                            const duration = eventEndHour - eventStartHour
                            
                            return (
                              <div key={i} style={{
                                position: 'relative',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                backgroundColor: event.color || '#e0e7ff',
                                cursor: 'pointer',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                marginBottom: '4px'
                              }}
                              onClick={() => onEventClick(event)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)'
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                              >
                                <div style={{ 
                                  fontSize: '14px', 
                                  fontWeight: '600', 
                                  marginBottom: '4px',
                                  color: '#111827'
                                }}>
                                  {event.isMultiDay && '◆ '}{event.title}
                                </div>
                                <div style={{ display: 'grid', gap: '2px' }}>
                                  {event.workerName && (
                                    <div style={{ 
                                      fontSize: '12px', 
                                      color: '#4b5563', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '4px' 
                                    }}>
                                      <User size={12} />
                                      {event.workerName}
                                    </div>
                                  )}
                                  {event.siteName && (
                                    <div style={{ 
                                      fontSize: '12px', 
                                      color: '#4b5563', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '4px' 
                                    }}>
                                      <MapPin size={12} />
                                      {event.siteName}
                                    </div>
                                  )}
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#4b5563', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px' 
                                  }}>
                                    <Clock size={12} />
                                    {event.startTime} - {event.endTime}
                                    {duration > 1 && ` (${duration}時間)`}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div 
                          style={{ 
                            height: '100%',
                            minHeight: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            fontSize: '12px',
                            transition: 'background 0.2s'
                          }}
                          onClick={() => {
                            const targetDate = new Date(currentMonth)
                            targetDate.setHours(hour, 0, 0, 0)
                            handleDateClick(targetDate)
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          + 予定を追加
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* 日付詳細モーダル */}
      {showDayModal && selectedDate && (
        <DayDetailModal
          date={selectedDate}
          events={getEventsForDate(selectedDate)}
          onClose={() => setShowDayModal(false)}
          onEventClick={onEventClick}
          onAddEvent={onAddEvent}
        />
      )}
    </div>
  )
}

// 日付詳細モーダルコンポーネント
function DayDetailModal({ date, events, onClose, onEventClick, onAddEvent }: {
  date: Date
  events: Event[]
  onClose: () => void
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}
    onClick={onClose}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
            {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日の予定
          </h2>
          <button onClick={onClose} style={{
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '20px',
            color: '#6b7280'
          }}>
            ✕
          </button>
        </div>

        {events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>この日の予定はありません</p>
            <button onClick={onAddEvent} style={{
              marginTop: '16px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              background: '#3b82f6',
              color: 'white',
              cursor: 'pointer'
            }}>
              予定を追加
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {events.map((event) => (
              <div key={event.id} style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: event.color || '#f3f4f6',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => onEventClick(event)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {event.isMultiDay && '◆ '}{event.title}
                </div>
                <div style={{ fontSize: '14px', color: '#4b5563', display: 'grid', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} />
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.workerName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} />
                      {event.workerName}
                    </div>
                  )}
                  {event.siteName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} />
                      {event.siteName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}