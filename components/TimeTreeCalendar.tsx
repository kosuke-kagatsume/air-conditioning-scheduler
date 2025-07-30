'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  getDay,
  isToday
} from 'date-fns'
import { ja } from 'date-fns/locale'
import EventDetailModal from './EventDetailModal'

type CalendarView = 'month' | 'week' | 'day'

interface Event {
  id: string
  title: string
  site: string
  location: string
  workType: string
  date: Date
  startTime: string
  endTime: string
  color: string
  company: string
  status: 'pending' | 'proposed' | 'accepted' | 'confirmed' | 'rejected'
  workers?: string[]
  dandoriUrl?: string
  contractor?: string
  salesRep?: string
}

interface TimeTreeCalendarProps {
  view: CalendarView
  selectedDate: Date
  onDateSelect: (date: Date) => void
  isWorkerView?: boolean
  selectedCompanies?: string[]
}

export default function TimeTreeCalendar({ 
  view, 
  selectedDate, 
  onDateSelect,
  isWorkerView = false,
  selectedCompanies = []
}: TimeTreeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: '空調設置',
      site: '渋谷オフィスビル',
      location: '東京都渋谷区',
      workType: '新規設置',
      date: new Date(2025, 6, 21),
      startTime: '09:00',
      endTime: '12:00',
      color: '#ff6b6b',
      company: 'A社',
      status: 'confirmed',
      workers: ['山田太郎', '佐藤次郎'],
      dandoriUrl: 'https://dandori-work.example.com/projects/123',
      contractor: '東京建設株式会社',
      salesRep: '営業部 田中'
    },
    {
      id: '2',
      title: 'エアコンメンテナンス',
      site: '新宿マンション',
      location: '東京都新宿区',
      workType: 'メンテナンス',
      date: new Date(2025, 6, 21),
      startTime: '14:00',
      endTime: '17:00',
      color: '#74c0fc',
      company: 'B社',
      status: 'proposed',
      workers: ['山田太郎'],
      dandoriUrl: 'https://dandori-work.example.com/projects/124',
      contractor: '関東ビルメンテナンス',
      salesRep: '営業部 鈴木'
    },
    {
      id: '3',
      title: '定期点検',
      site: '池袋商業施設',
      location: '東京都豊島区',
      workType: '定期点検',
      date: new Date(2025, 6, 23),
      startTime: '10:00',
      endTime: '12:00',
      color: '#51cf66',
      company: 'C社',
      status: 'confirmed',
      workers: ['鈴木三郎'],
      dandoriUrl: 'https://dandori-work.example.com/projects/125',
      contractor: '東京設備管理',
      salesRep: '営業部 佐藤'
    },
    {
      id: '4',
      title: '空調緊急対応',
      site: '品川オフィス',
      location: '東京都港区',
      workType: '緊急対応',
      date: new Date(2025, 6, 24),
      startTime: '13:00',
      endTime: '15:00',
      color: '#ffd93d',
      company: 'D社',
      status: 'accepted',
      workers: ['佐藤次郎'],
      dandoriUrl: 'https://dandori-work.example.com/projects/126',
      contractor: '緊急対応サービス',
      salesRep: '営業部 山田'
    },
    {
      id: '5',
      title: '設置見積もり',
      site: '横浜新築ビル',
      location: '神奈川県横浜市',
      workType: '見積もり',
      date: new Date(2025, 6, 25),
      startTime: '15:00',
      endTime: '16:30',
      color: '#9775fa',
      company: 'E社',
      status: 'pending',
      workers: ['山田太郎'],
      dandoriUrl: 'https://dandori-work.example.com/projects/127',
      contractor: '横浜建設',
      salesRep: '営業部 高橋'
    }
  ]

  const navigatePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1))
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1))
    else setCurrentDate(subDays(currentDate, 1))
  }

  const navigateNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1))
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1))
    else setCurrentDate(addDays(currentDate, 1))
  }

  const navigateToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateSelect(today)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.date, date) && 
      (selectedCompanies.length === 0 || selectedCompanies.includes(event.company))
    )
  }

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  if (view === 'month') {
    return (
      <div>
        {/* Month Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            {format(currentDate, isMobile ? 'yy年 M月' : 'yyyy年 M月', { locale: ja })}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={navigateToday}
              className="btn-secondary"
              style={{ padding: isMobile ? '6px 12px' : '8px 16px', fontSize: isMobile ? '12px' : '14px' }}
            >
              今日
            </button>
            <button
              onClick={navigatePrevious}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '2px solid #e1e4e8',
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
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '2px solid #e1e4e8',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Month Grid */}
        <div className="calendar-container">
          <div className="calendar-grid">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
            <div key={i} className="calendar-header">
              {day}
            </div>
          ))}
          {monthDays.map((day, i) => {
            const dayEvents = getEventsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)
            const isWeekend = getDay(day) === 0 || getDay(day) === 6

            return (
              <div
                key={i}
                className="calendar-cell"
                onClick={() => onDateSelect(day)}
                style={{
                  opacity: isCurrentMonth ? 1 : 0.4,
                  background: isSelected ? '#fff5f5' : isTodayDate ? '#f0f9ff' : isWeekend ? '#f9fafb' : 'white',
                  borderTop: isTodayDate ? '2px solid #ff6b6b' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    fontWeight: isTodayDate ? '700' : '500',
                    color: isTodayDate ? '#ff6b6b' : isWeekend ? '#6c7684' : '#2c3e50',
                    fontSize: isMobile ? '14px' : '16px'
                  }}>
                    {format(day, 'd')}
                  </div>
                  {dayEvents.length > 0 && (
                    <div style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      background: '#e1e4e8',
                      borderRadius: '10px',
                      color: '#6c7684',
                      fontWeight: '500'
                    }}>
                      {dayEvents.length}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflow: 'hidden' }}>
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="event-item"
                      style={{
                        background: event.status === 'confirmed' || event.status === 'accepted' ? `${event.color}20` : 'white',
                        color: event.status === 'confirmed' || event.status === 'accepted' ? event.color : '#6c7684',
                        borderLeft: `3px solid ${event.color}`,
                        border: event.status === 'confirmed' || event.status === 'accepted' ? 'none' : `1px solid ${event.color}`,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                      }}
                    >
                      {isMobile ? event.site : `${event.startTime} ${event.site}`}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{
                      fontSize: '11px',
                      color: '#6c7684',
                      textAlign: 'center'
                    }}>
                      +{dayEvents.length - 3} 件
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'week') {
    return (
      <div>
        {/* Week Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            {format(weekDays[0], 'yyyy年 M月 d日', { locale: ja })} - {format(weekDays[6], 'M月 d日', { locale: ja })}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={navigateToday}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              今週
            </button>
            <button
              onClick={navigatePrevious}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '2px solid #e1e4e8',
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
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '2px solid #e1e4e8',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Week Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          background: '#e1e4e8',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDate(day)
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)
            const dayName = ['日', '月', '火', '水', '木', '金', '土'][i]

            return (
              <div
                key={i}
                style={{
                  background: isSelected ? '#fff5f5' : isTodayDate ? '#f0f9ff' : 'white',
                  minHeight: '400px',
                  cursor: 'pointer'
                }}
                onClick={() => onDateSelect(day)}
              >
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #e1e4e8',
                  textAlign: 'center',
                  background: isTodayDate ? '#ff6b6b' : 'transparent'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: isTodayDate ? 'white' : '#6c7684'
                  }}>
                    {dayName}
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: isTodayDate ? 'white' : '#2c3e50'
                  }}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div style={{ padding: '8px' }}>
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="card"
                      style={{
                        padding: '8px',
                        marginBottom: '8px',
                        borderLeft: `4px solid ${event.color}`,
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div style={{
                        fontSize: '12px',
                        color: '#6c7684',
                        marginBottom: '2px'
                      }}>
                        {event.startTime} - {event.endTime}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '2px'
                      }}>
                        {event.site}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6c7684',
                        marginBottom: '2px'
                      }}>
                        {event.location}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: event.color,
                        fontWeight: '500'
                      }}>
                        {event.workType}
                      </div>
                      {!isWorkerView && event.workers && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6c7684'
                        }}>
                          {event.workers.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Day View
  return (
    <>
      <div>
      {/* Day Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#2c3e50'
        }}>
          {format(currentDate, 'yyyy年 M月 d日 (E)', { locale: ja })}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={navigateToday}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            今日
          </button>
          <button
            onClick={navigatePrevious}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '2px solid #e1e4e8',
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '2px solid #e1e4e8',
              background: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Day Timeline */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
      }}>
        {timeSlots.map(hour => {
          const hourEvents = getEventsForDate(currentDate).filter(event => {
            const eventHour = parseInt(event.startTime.split(':')[0])
            return eventHour === hour
          })

          return (
            <div
              key={hour}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                borderBottom: '1px solid #e1e4e8',
                minHeight: '60px'
              }}
            >
              <div className={isMobile ? 'day-timeline-hour' : ''} style={{
                padding: isMobile ? '12px 8px' : '16px',
                color: '#6c7684',
                fontSize: isMobile ? '12px' : '14px',
                textAlign: 'right',
                borderRight: '1px solid #e1e4e8'
              }}>
                {hour}:00
              </div>
              <div style={{
                padding: '8px',
                position: 'relative'
              }}>
                {hourEvents.map(event => (
                  <div
                    key={event.id}
                    className="card"
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderLeft: `4px solid ${event.color}`,
                      background: `${event.color}10`,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2c3e50',
                          marginBottom: '2px'
                        }}>
                          {event.site}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6c7684',
                          marginBottom: '2px'
                        }}>
                          {event.location} - {event.workType}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6c7684'
                        }}>
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <span className={`status-badge status-${event.status}`}>
                        {event.status === 'confirmed' ? '確定' : 
                         event.status === 'proposed' ? '提案中' :
                         event.status === 'accepted' ? '承諾済' :
                         event.status === 'rejected' ? '拒否' : '保留'}
                      </span>
                    </div>
                    {!isWorkerView && event.workers && (
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '8px'
                      }}>
                        {event.workers.map((worker, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '4px 12px',
                              background: 'white',
                              borderRadius: '20px',
                              fontSize: '12px',
                              color: '#2c3e50',
                              border: '1px solid #e1e4e8'
                            }}
                          >
                            {worker}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>

    {/* Event Detail Modal */}
    {selectedEvent && (
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isMobile={isMobile}
      />
    )}
    </>
  )
}