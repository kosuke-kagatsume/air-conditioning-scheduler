'use client'

import React, { useState, useMemo, useEffect } from 'react'
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

  // 6週間分のグリッドを作成
  const weeks = []
  for (let i = 0; i < 6; i++) {
    weeks.push(monthDays.slice(i * 7, (i + 1) * 7))
  }

  return (
    <div style={{
      width: '100%',
      background: 'white',
      padding: '4px'
    }}>
      {/* テーブルレイアウトで確実に表示 */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
      }}>
        <thead>
          <tr>
            {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
              <th
                key={day}
                style={{
                  padding: '6px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  textAlign: 'center',
                  color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#374151',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb'
                }}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayEvents = events.filter(e => e.date === day.dateStr)
                const isToday = day.dateStr === todayStr
                const isSelected = day.dateStr === selectedDate
                const dayOfWeek = day.date.getDay()
                
                return (
                  <td
                    key={dayIndex}
                    onClick={() => {
                      setSelectedDate(day.dateStr)
                      onDateClick(day.dateStr)
                    }}
                    style={{
                      width: '14.28%',
                      height: '48px',
                      padding: '2px',
                      border: '1px solid #e5e7eb',
                      background: !day.isCurrentMonth ? '#f9fafb' : 
                        isSelected ? '#dbeafe' :
                        isToday ? '#fef3c7' : 'white',
                      cursor: 'pointer',
                      verticalAlign: 'top',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      fontSize: '12px',
                      fontWeight: isToday ? '700' : '500',
                      color: !day.isCurrentMonth ? '#9ca3af' : 
                        dayOfWeek === 0 ? '#ef4444' : 
                        dayOfWeek === 6 ? '#3b82f6' : 
                        '#1f2937',
                      textAlign: 'center'
                    }}>
                      {day.date.getDate()}
                    </div>
                    
                    {/* イベントドット */}
                    {dayEvents.length > 0 && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1px',
                        marginTop: '2px'
                      }}>
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <span
                            key={i}
                            style={{
                              display: 'inline-block',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: getStatusColor(event.status)
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 選択された日のイベント */}
      {selectedDate && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: '#f9fafb',
          borderRadius: '6px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#1f2937'
          }}>
            {new Date(selectedDate).toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
              weekday: 'short'
            })}
          </div>
          
          <div>
            {events
              .filter(e => e.date === selectedDate)
              .map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  style={{
                    padding: '6px',
                    marginBottom: '4px',
                    background: 'white',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${getStatusColor(event.status)}`,
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontWeight: '500' }}>
                    {event.startTime} {event.constructionType}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>
                    {event.city}
                  </div>
                </div>
              ))}
            {events.filter(e => e.date === selectedDate).length === 0 && (
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                予定はありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}