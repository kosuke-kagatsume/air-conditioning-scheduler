'use client'

import { useState } from 'react'

interface CalendarViewProps {
  onDateSelect: (date: Date) => void
}

export default function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [viewType, setViewType] = useState<'week' | 'month' | 'day'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const events = [
    {
      id: 1,
      title: 'オフィスビルA 空調設置',
      start: new Date(2025, 6, 18, 9, 0),
      end: new Date(2025, 6, 18, 12, 0),
      color: '#667eea',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'マンションB メンテナンス',
      start: new Date(2025, 6, 18, 14, 0),
      end: new Date(2025, 6, 18, 17, 0),
      color: '#f59e0b',
      status: 'proposed'
    },
    {
      id: 3,
      title: '商業施設C 点検',
      start: new Date(2025, 6, 19, 10, 0),
      end: new Date(2025, 6, 19, 13, 0),
      color: '#10b981',
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
      <div className="glass p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
          <h3 className="text-lg font-semibold">
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
        
        <div className="flex gap-2">
          {(['week', 'month', 'day'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-4 py-2 rounded-lg transition-all ${
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
          <div className="grid grid-cols-8 h-full">
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
        <div className="flex-1 glass rounded-lg p-8 flex items-center justify-center">
          <p className="text-gray-400">月表示は開発中です</p>
        </div>
      )}

      {/* Day View Placeholder */}
      {viewType === 'day' && (
        <div className="flex-1 glass rounded-lg p-8 flex items-center justify-center">
          <p className="text-gray-400">日表示は開発中です</p>
        </div>
      )}
    </div>
  )
}