'use client'

import React, { useState, useMemo } from 'react'
import { Event } from '@/types'

interface MobileCalendarViewProps {
  events: Event[]
  currentDate: Date
  onDateClick: (date: string) => void
  onEventClick: (event: Event) => void
}

export default function MobileCalendarView({
  events,
  currentDate,
  onDateClick,
  onEventClick
}: MobileCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')

  // 月の日付を取得
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const days = []
    
    // 前月の日付
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({
        date,
        isCurrentMonth: false,
        dateStr: date.toISOString().split('T')[0]
      })
    }
    
    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        dateStr: date.toISOString().split('T')[0]
      })
    }
    
    // 次月の日付（6週分にする）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        isCurrentMonth: false,
        dateStr: date.toISOString().split('T')[0]
      })
    }
    
    return days
  }, [currentDate])

  const todayStr = new Date().toISOString().split('T')[0]

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'accepted': return '#22c55e'
      case 'proposed': return '#3b82f6'
      case 'pending': return '#f59e0b'
      case 'completed': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '100vw',
      background: 'white',
      padding: '8px'
    }}>
      {/* 曜日ヘッダー */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: '4px'
      }}>
        {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              padding: '8px 0',
              color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#374151',
              background: '#f9fafb',
              border: '0.5px solid #e5e7eb'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0'
      }}>
        {monthDays.map((day, index) => {
          const dayEvents = events.filter(e => e.date === day.dateStr)
          const isToday = day.dateStr === todayStr
          const dayOfWeek = day.date.getDay()
          
          return (
            <div
              key={index}
              onClick={() => {
                setSelectedDate(day.dateStr)
                onDateClick(day.dateStr)
              }}
              style={{
                aspectRatio: '1',
                minHeight: '50px',
                padding: '4px',
                border: '0.5px solid #e5e7eb',
                background: !day.isCurrentMonth ? '#f9fafb' : 
                  selectedDate === day.dateStr ? '#dbeafe' :
                  isToday ? '#fef3c7' : 'white',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* 日付 */}
              <div style={{
                fontSize: '13px',
                fontWeight: isToday ? '700' : '500',
                color: !day.isCurrentMonth ? '#9ca3af' : 
                  dayOfWeek === 0 ? '#ef4444' : 
                  dayOfWeek === 6 ? '#3b82f6' : 
                  '#1f2937',
                marginBottom: '2px'
              }}>
                {day.date.getDate()}
              </div>

              {/* イベントインジケーター */}
              {dayEvents.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '2px',
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  {dayEvents.slice(0, 3).map((event, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getStatusColor(event.status)
                      }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{
                      fontSize: '9px',
                      color: '#6b7280'
                    }}>
                      +{dayEvents.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 選択された日のイベントリスト */}
      {selectedDate && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937'
          }}>
            {new Date(selectedDate).toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}の予定
          </h3>
          {events
            .filter(e => e.date === selectedDate)
            .map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                style={{
                  padding: '8px',
                  marginBottom: '4px',
                  background: 'white',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${getStatusColor(event.status)}`,
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: '500' }}>
                  {event.startTime} - {event.constructionType}
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px' }}>
                  📍 {event.city}
                </div>
              </div>
            ))}
          {events.filter(e => e.date === selectedDate).length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>
              予定はありません
            </div>
          )}
        </div>
      )}
    </div>
  )
}