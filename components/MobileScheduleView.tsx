'use client'

import { useState, useEffect } from 'react'
import { 
  format, 
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay
} from 'date-fns'
import { ja } from 'date-fns/locale'

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  color: string
  status: 'pending' | 'proposed' | 'accepted' | 'confirmed' | 'rejected'
  workers?: string[]
  location?: string
}

interface MobileScheduleViewProps {
  isWorkerView?: boolean
  onEventClick?: (event: Event) => void
}

export default function MobileScheduleView({ 
  isWorkerView = false,
  onEventClick 
}: MobileScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  
  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'A社 空調設置',
      date: new Date(),
      startTime: '09:00',
      endTime: '12:00',
      color: '#ff6b6b',
      status: 'confirmed',
      workers: ['山田太郎', '佐藤次郎'],
      location: '渋谷区オフィスビル'
    },
    {
      id: '2',
      title: 'B社 メンテナンス',
      date: new Date(),
      startTime: '14:00',
      endTime: '17:00',
      color: '#74c0fc',
      status: 'proposed',
      workers: ['山田太郎'],
      location: '新宿区マンション'
    },
    {
      id: '3',
      title: 'C社 定期点検',
      date: addDays(new Date(), 1),
      startTime: '10:00',
      endTime: '12:00',
      color: '#51cf66',
      status: 'confirmed',
      workers: ['鈴木三郎'],
      location: '港区商業施設'
    },
  ]

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return '今日'
    if (isTomorrow(date)) return '明日'
    if (isYesterday(date)) return '昨日'
    return format(date, 'M月d日', { locale: ja })
  }

  const getDayEvents = getEventsForDate(selectedDate)

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setSelectedDate(addDays(selectedDate, 1))
    }
    if (isRightSwipe) {
      setSelectedDate(addDays(selectedDate, -1))
    }
  }

  if (viewMode === 'day') {
    return (
      <div 
        style={{ 
          background: '#f5f6f8', 
          minHeight: '100vh',
          paddingBottom: '80px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Date Header */}
        <div style={{
          background: 'white',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#2c3e50'
            }}>
              {getDateLabel(selectedDate)}
            </h1>
            <div style={{
              fontSize: '16px',
              color: '#6c7684'
            }}>
              {format(selectedDate, 'yyyy年 M月 d日 (E)', { locale: ja })}
            </div>
          </div>

          {/* Quick Date Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {[-2, -1, 0, 1, 2, 3, 4].map(offset => {
              const date = addDays(new Date(), offset)
              const isSelected = isSameDay(date, selectedDate)
              
              return (
                <button
                  key={offset}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    minWidth: '80px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isSelected ? '#ff6b6b' : 'white',
                    color: isSelected ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 107, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    marginBottom: '4px',
                    opacity: 0.8
                  }}>
                    {format(date, 'E', { locale: ja })}
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {format(date, 'd')}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    marginTop: '2px'
                  }}>
                    {getDateLabel(date)}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Events List */}
        <div style={{ padding: '16px' }}>
          {getDayEvents.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: '#6c7684'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <p style={{ fontSize: '16px' }}>予定がありません</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {getDayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    borderLeft: `4px solid ${event.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '4px'
                      }}>
                        {event.title}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#6c7684'
                      }}>
                        <span>🕐</span>
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    </div>
                    <span className={`status-badge status-${event.status}`}>
                      {event.status === 'confirmed' ? '確定' : 
                       event.status === 'proposed' ? '提案中' :
                       event.status === 'accepted' ? '承諾済' :
                       event.status === 'rejected' ? '拒否' : '保留'}
                    </span>
                  </div>

                  {event.location && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#6c7684',
                      marginBottom: '8px'
                    }}>
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {!isWorkerView && event.workers && (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {event.workers.map((worker, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '6px 12px',
                            background: '#f5f6f8',
                            borderRadius: '20px',
                            fontSize: '12px',
                            color: '#2c3e50'
                          }}
                        >
                          👷 {worker}
                        </div>
                      ))}
                    </div>
                  )}

                  {isWorkerView && event.status === 'proposed' && (
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '12px'
                    }}>
                      <button className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                        承諾する
                      </button>
                      <button className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                        保留
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swipe Hint */}
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          opacity: getDayEvents.length === 0 ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}>
          ← スワイプで日付移動 →
        </div>
      </div>
    )
  }

  // Week view would go here
  // Month view would go here

  return null
}