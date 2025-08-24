'use client'

import { useState } from 'react'

interface CalendarViewProps {
  onDateSelect: (date: Date) => void
}

export default function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [viewType, setViewType] = useState<'week' | 'month' | 'day'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  // 現在の週のイベントを生成
  const now = new Date()
  const events = [
    {
      id: 1,
      title: 'オフィスビルA 空調設置',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
      color: '#667eea',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'マンションB メンテナンス',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0),
      color: '#f59e0b',
      status: 'proposed'
    },
    {
      id: 3,
      title: '商業施設C 点検',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
      color: '#10b981',
      status: 'confirmed'
    },
    {
      id: 4,
      title: '新規エアコン設置（品川オフィス）',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0),
      color: '#667eea',
      status: 'confirmed'
    },
    {
      id: 5,
      title: '定期メンテナンス（渋谷店舗）',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 9, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 0),
      color: '#10b981',
      status: 'confirmed'
    },
    {
      id: 6,
      title: '緊急修理対応',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 13, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 0),
      color: '#ef4444',
      status: 'confirmed'
    },
    {
      id: 7,
      title: 'エアコンクリーニング（新宿マンション）',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 12, 0),
      color: '#f59e0b',
      status: 'proposed'
    },
    {
      id: 8,
      title: '配管工事（横浜倉庫）',
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 9, 0),
      end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 16, 0),
      color: '#667eea',
      status: 'confirmed'
    }
  ]

  const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8:00 to 20:00
  const days = ['日', '月', '火', '水', '木', '金', '土']

  const getWeekDates = () => {
    const week = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      week.push(date)
    }
    return week
  }

  const weekDates = getWeekDates()

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="glass p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() - 7)
              setCurrentDate(newDate)
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ←
          </button>
          <h3 className="text-base sm:text-lg font-semibold">
            {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
          </h3>
          <button
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() + 7)
              setCurrentDate(newDate)
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          {(['week', 'month', 'day'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all ${
                viewType === type
                  ? 'gradient-bg text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {type === 'week' && '週'}
              {type === 'month' && '月'}
              {type === 'day' && '日'}
            </button>
          ))}
        </div>
      </div>

      {/* Week View */}
      {viewType === 'week' && (
        <div className="flex-1 glass rounded-lg overflow-hidden">
          {/* Mobile Week View */}
          <div className="block md:hidden">
            <div className="flex overflow-x-auto">
              {weekDates.map((date, dayIndex) => {
                const isToday = date.toDateString() === new Date().toDateString()
                const dayEvents = events.filter(
                  (event) => event.start.toDateString() === date.toDateString()
                )

                return (
                  <div key={dayIndex} className="min-w-[280px] border-r border-white/10 last:border-r-0">
                    <div
                      className={`p-3 border-b border-white/10 text-center ${
                        isToday ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <p className="text-xs text-gray-400">{days[date.getDay()]}</p>
                      <p className={`text-lg font-semibold ${isToday ? 'text-purple-400' : ''}`}>
                        {date.getDate()}
                      </p>
                    </div>
                    
                    <div className="p-2 space-y-2 min-h-[400px]">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-2 rounded text-white text-sm"
                          style={{ backgroundColor: event.color }}
                        >
                          <p className="font-medium truncate">{event.title}</p>
                          <p className="text-xs opacity-80">
                            {event.start.getHours()}:00 - {event.end.getHours()}:00
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Desktop Week View */}
          <div className="hidden md:grid grid-cols-8 h-full">
            {/* Time column */}
            <div className="border-r border-white/10">
              <div className="h-16 border-b border-white/10"></div>
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-white/10 px-2 py-1 text-xs text-gray-400"
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDates.map((date, dayIndex) => {
              const isToday = date.toDateString() === new Date().toDateString()
              const dayEvents = events.filter(
                (event) => event.start.toDateString() === date.toDateString()
              )

              return (
                <div key={dayIndex} className="border-r border-white/10 relative">
                  <div
                    className={`h-16 border-b border-white/10 p-2 text-center ${
                      isToday ? 'bg-purple-500/20' : ''
                    }`}
                  >
                    <p className="text-xs text-gray-400">{days[date.getDay()]}</p>
                    <p className={`text-lg font-semibold ${isToday ? 'text-purple-400' : ''}`}>
                      {date.getDate()}
                    </p>
                  </div>
                  
                  {/* Hour cells */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-white/10 hover:bg-white/5 cursor-pointer"
                      onClick={() => {
                        const selectedDate = new Date(date)
                        selectedDate.setHours(hour)
                        onDateSelect(selectedDate)
                      }}
                    />
                  ))}

                  {/* Events */}
                  {dayEvents.map((event) => {
                    const startHour = event.start.getHours()
                    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60)
                    const top = (startHour - 8) * 64 + 64 // 64px per hour + header height
                    const height = duration * 64

                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity"
                        style={{
                          top: `${top}px`,
                          height: `${height - 4}px`,
                          backgroundColor: event.color,
                          opacity: 0.9
                        }}
                      >
                        <p className="text-xs font-medium text-white truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-white/80">
                          {event.start.getHours()}:00 - {event.end.getHours()}:00
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Month View Placeholder */}
      {viewType === 'month' && (
        <div className="flex-1 glass rounded-lg p-4 sm:p-8 flex items-center justify-center">
          <p className="text-gray-400 text-center">月表示は開発中です</p>
        </div>
      )}

      {/* Day View Placeholder */}
      {viewType === 'day' && (
        <div className="flex-1 glass rounded-lg p-4 sm:p-8 flex items-center justify-center">
          <p className="text-gray-400 text-center">日表示は開発中です</p>
        </div>
      )}
    </div>
  )
}