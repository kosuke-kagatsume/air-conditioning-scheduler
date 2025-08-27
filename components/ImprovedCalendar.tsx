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
}

interface CalendarProps {
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}

export default function ImprovedCalendar({ events, onDateClick, onEventClick, onAddEvent }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDayModal, setShowDayModal] = useState(false)

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
    const dayEvents = events.filter(event => {
      if (!event) return false
      
      if (event.isMultiDay) {
        const start = new Date(event.startDate + 'T00:00:00')
        const end = new Date((event.endDate || event.startDate) + 'T23:59:59')
        const checkDate = new Date(dateStr + 'T12:00:00')
        return checkDate >= start && checkDate <= end
      }
      
      // 通常のイベント - dateフィールドも確認
      return event.startDate === dateStr || event.date === dateStr
    })
    
    
    return dayEvents
  }

  // 複数日イベントの表示位置を計算
  const getMultiDayEventPosition = (event: Event, weekDays: Date[]) => {
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate || event.startDate)
    const weekStart = weekDays[0]
    const weekEnd = weekDays[weekDays.length - 1]
    
    const eventStart = startDate < weekStart ? weekStart : startDate
    const eventEnd = endDate > weekEnd ? weekEnd : endDate
    
    const startIndex = weekDays.findIndex(d => 
      d.toDateString() === eventStart.toDateString()
    )
    const endIndex = weekDays.findIndex(d => 
      d.toDateString() === eventEnd.toDateString()
    )
    
    return {
      start: startIndex,
      span: endIndex - startIndex + 1,
      continuesBefore: startDate < weekStart,
      continuesAfter: endDate > weekEnd
    }
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
        marginBottom: '20px'
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
              
              {/* イベントプレビュー（最大2件） */}
              <div style={{ fontSize: '12px' }}>
                {dayEvents.slice(0, 2).map((event, i) => (
                  <div key={i} style={{
                    padding: '2px 4px',
                    marginBottom: '2px',
                    borderRadius: '4px',
                    backgroundColor: event.color || '#e0e7ff',
                    backgroundImage: event.isMultiDay 
                      ? 'linear-gradient(45deg, transparent 25%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.03) 50%, transparent 50%, transparent 75%, rgba(0,0,0,0.03) 75%, rgba(0,0,0,0.03))' 
                      : 'none',
                    backgroundSize: '8px 8px',
                    color: '#1e40af',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                    border: event.isMultiDay ? '1px solid rgba(0,0,0,0.1)' : 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(event)
                  }}
                  >
                    <span style={{ 
                      fontSize: '11px',
                      display: 'block',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}>
                      {event.isMultiDay ? '◆ ' : `${event.startTime} `}
                      {event.title.length > 8 ? event.title.substring(0, 8) + '...' : event.title}
                    </span>
                  </div>
                ))}
                
                {/* +n件表示 */}
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
        {/* モーダルヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>
            {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日の予定
          </h3>
          <button onClick={onClose} style={{
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '24px'
          }}>
            ×
          </button>
        </div>

        {/* イベントリスト */}
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <Calendar size={48} style={{ margin: '0 auto 16px' }} />
            <p>この日の予定はありません</p>
            <button onClick={onAddEvent} style={{
              marginTop: '16px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer'
            }}>
              予定を追加
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((event) => (
              <div key={event.id} style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => onEventClick(event)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>
                    {event.title}
                  </h4>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: event.color || '#e0e7ff',
                    fontSize: '12px'
                  }}>
                    {event.constructionType || '作業'}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} />
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.siteName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} />
                      {event.siteName}
                    </div>
                  )}
                  {event.workerName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} />
                      {event.workerName}
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