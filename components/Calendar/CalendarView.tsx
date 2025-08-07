'use client'

import React, { useState, useMemo } from 'react'
import { Event, WorkerCapacity } from '@/types'
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
  const [viewType, setViewType] = useState<ViewType>(currentTenant?.settings.defaultView || 'month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')

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
    
    return events
  }, [canViewAllEvents, isMaster, isWorker, user, selectedWorkers])

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

  // イベントのステータスに応じた色
  const getEventColor = (event: Event) => {
    switch (event.status) {
      case 'accepted': return 'bg-green-100 border-green-500 text-green-800'
      case 'proposed': return 'bg-blue-100 border-blue-500 text-blue-800'
      case 'pending': return 'bg-yellow-100 border-yellow-500 text-yellow-800'
      case 'rejected': return 'bg-red-100 border-red-500 text-red-800'
      case 'cancelled': return 'bg-gray-100 border-gray-500 text-gray-800'
      case 'completed': return 'bg-purple-100 border-purple-500 text-purple-800'
      default: return 'bg-gray-100 border-gray-500 text-gray-800'
    }
  }

  // 職人の枠数チェック
  const getWorkerCapacity = (workerId: string, date: string) => {
    const capacity = mockWorkerCapacities.find(c => c.workerId === workerId)
    if (!capacity) return null
    
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.getDay()
    
    // 特定日の設定をチェック
    if (capacity.specificDates?.[date] !== undefined) {
      return capacity.specificDates[date]
    }
    
    // 曜日別の設定をチェック
    if (capacity.weekdayCapacities?.[dayOfWeek] !== undefined) {
      return capacity.weekdayCapacities[dayOfWeek]
    }
    
    // ベース枠数を返す
    return capacity.baseCapacity
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

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* カレンダーヘッダー */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrev}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <button
              onClick={navigateToday}
              className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              今日
            </button>
            <button
              onClick={navigateNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
            <h2 className="ml-4 text-xl font-semibold">
              {viewType === 'month' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`}
              {viewType === 'week' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月 第${Math.ceil(currentDate.getDate() / 7)}週`}
              {viewType === 'day' && `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {canCreateEvent && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                <span>予定作成</span>
              </button>
            )}
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('month')}
                className={`px-3 py-1 rounded ${viewType === 'month' ? 'bg-white shadow-sm' : ''} transition-all`}
              >
                月
              </button>
              <button
                onClick={() => setViewType('week')}
                className={`px-3 py-1 rounded ${viewType === 'week' ? 'bg-white shadow-sm' : ''} transition-all`}
              >
                週
              </button>
              <button
                onClick={() => setViewType('day')}
                className={`px-3 py-1 rounded ${viewType === 'day' ? 'bg-white shadow-sm' : ''} transition-all`}
              >
                日
              </button>
            </div>
          </div>
        </div>

        {/* 凡例 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
            <span>確定</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
            <span>提案中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-500 rounded"></div>
            <span>保留</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 border border-purple-500 rounded"></div>
            <span>完了</span>
          </div>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="p-4">
        {viewType === 'month' && (
          <div>
            {/* 曜日ヘッダー */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '8px 0',
                    color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#374151'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* 日付グリッド */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {monthDays.map((day, index) => {
                const dayEvents = filteredEvents.filter(e => e.date === day.dateStr)
                const isToday = day.dateStr === todayStr
                
                return (
                  <div
                    key={index}
                    style={{
                      minHeight: '100px',
                      border: isToday ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      background: day.isCurrentMonth ? 'white' : '#f9fafb',
                      transition: 'background 0.2s'
                    }}
                    onClick={() => handleDateClick(day.dateStr)}
                  >
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '4px',
                      color: !day.isCurrentMonth ? '#9ca3af' : 
                        day.date.getDay() === 0 ? '#ef4444' : 
                        day.date.getDay() === 6 ? '#3b82f6' : 
                        '#374151'
                    }}>
                      {day.date.getDate()}
                    </div>
                    
                    {/* イベント表示 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEventClick(event)
                          }}
                          style={{
                            fontSize: '11px',
                            padding: '4px',
                            borderRadius: '4px',
                            borderLeft: '2px solid',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            background: event.status === 'accepted' ? '#dcfce7' :
                              event.status === 'proposed' ? '#dbeafe' :
                              event.status === 'pending' ? '#fef3c7' :
                              event.status === 'rejected' ? '#fee2e2' : '#f3f4f6',
                            borderLeftColor: event.status === 'accepted' ? '#22c55e' :
                              event.status === 'proposed' ? '#3b82f6' :
                              event.status === 'pending' ? '#f59e0b' :
                              event.status === 'rejected' ? '#ef4444' : '#6b7280',
                            color: event.status === 'accepted' ? '#166534' :
                              event.status === 'proposed' ? '#1e40af' :
                              event.status === 'pending' ? '#92400e' :
                              event.status === 'rejected' ? '#991b1b' : '#374151'
                          }}
                        >
                          <div style={{ fontWeight: '500' }}>{event.startTime} {event.city}</div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.constructionType}</div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
                          他{dayEvents.length - 3}件
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewType === 'week' && (
          <div>
            {/* 時間軸と曜日グリッド */}
            <div className="flex">
              {/* 時間軸 */}
              <div className="w-16 pr-2">
                <div className="h-10"></div>
                {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                  <div key={hour} className="h-20 text-xs text-gray-500 text-right">
                    {hour}:00
                  </div>
                ))}
              </div>
              
              {/* 曜日グリッド */}
              <div className="flex-1 grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => {
                  const dayEvents = filteredEvents.filter(e => e.date === day.dateStr)
                  const isToday = day.dateStr === todayStr
                  
                  return (
                    <div key={index} className="border-l border-gray-200">
                      <div className={`h-10 text-center text-sm font-medium py-2 border-b ${
                        isToday ? 'bg-blue-50' : ''
                      } ${
                        day.date.getDay() === 0 ? 'text-red-500' : 
                        day.date.getDay() === 6 ? 'text-blue-500' : 
                        'text-gray-700'
                      }`}>
                        {['日', '月', '火', '水', '木', '金', '土'][day.date.getDay()]} {day.date.getDate()}日
                      </div>
                      
                      <div className="relative" style={{ height: '1120px' }}>
                        {/* 時間線 */}
                        {Array.from({ length: 14 }, (_, i) => (
                          <div key={i} className="absolute w-full border-t border-gray-100" style={{ top: `${i * 80}px` }}></div>
                        ))}
                        
                        {/* イベント */}
                        {dayEvents.map(event => {
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
                              className={`absolute left-1 right-1 p-1 rounded border cursor-pointer hover:shadow-md transition-shadow ${getEventColor(event)}`}
                              style={{ top: `${top}px`, height: `${height}px` }}
                            >
                              <div className="text-xs font-medium">{event.startTime}</div>
                              <div className="text-xs">{event.city}</div>
                              <div className="text-xs truncate">{event.constructionType}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {viewType === 'day' && (
          <div className="max-w-4xl mx-auto">
            {/* 時間軸とイベント */}
            <div className="flex">
              {/* 時間軸 */}
              <div className="w-20 pr-4">
                {Array.from({ length: 14 }, (_, i) => i + 7).map(hour => (
                  <div key={hour} className="h-20 text-sm text-gray-500 text-right">
                    {hour}:00
                  </div>
                ))}
              </div>
              
              {/* イベントエリア */}
              <div className="flex-1 relative" style={{ height: '1120px' }}>
                {/* 時間線 */}
                {Array.from({ length: 14 }, (_, i) => (
                  <div key={i} className="absolute w-full border-t border-gray-200" style={{ top: `${i * 80}px` }}></div>
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
                        className={`absolute left-0 right-0 p-3 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-shadow ${getEventColor(event)}`}
                        style={{ top: `${top}px`, height: `${height}px`, minHeight: '60px' }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{event.startTime} - {event.endTime || '未定'}</div>
                            <div className="text-sm font-semibold mt-1">{event.constructionType}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'accepted' ? 'bg-green-200 text-green-800' :
                            event.status === 'proposed' ? 'bg-blue-200 text-blue-800' :
                            event.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {event.status === 'accepted' ? '確定' :
                             event.status === 'proposed' ? '提案中' :
                             event.status === 'pending' ? '保留' :
                             event.status === 'completed' ? '完了' : ''}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>📍 {event.city} {event.address}</div>
                          <div>👤 {event.clientName} ({event.constructorName})</div>
                          <div>👷 {event.workerName}</div>
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
    </div>
  )
}