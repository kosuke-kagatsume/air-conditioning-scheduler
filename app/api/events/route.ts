import { NextRequest, NextResponse } from 'next/server'

// Mock database
const mockEvents = [
  {
    id: '1',
    title: 'オフィスビルA 空調設置',
    jobSiteId: '1',
    jobSite: { name: 'オフィスビルA', address: '東京都渋谷区' },
    labelId: '1',
    label: { name: '新規設置', color: '#667eea' },
    startAt: '2025-07-18T09:00:00',
    endAt: '2025-07-18T12:00:00',
    allDay: false,
    status: 'CONFIRMED',
    assignees: [
      { userId: '2', user: { name: '佐藤職人' }, responseStatus: 'ACCEPTED' }
    ]
  },
  {
    id: '2',
    title: 'マンションB メンテナンス',
    jobSiteId: '2',
    jobSite: { name: 'マンションB', address: '東京都新宿区' },
    labelId: '2',
    label: { name: 'メンテナンス', color: '#f59e0b' },
    startAt: '2025-07-18T14:00:00',
    endAt: '2025-07-18T17:00:00',
    allDay: false,
    status: 'PROPOSED',
    assignees: [
      { userId: '2', user: { name: '佐藤職人' }, responseStatus: null }
    ]
  },
  {
    id: '3',
    title: '商業施設C 定期点検',
    jobSiteId: '3',
    jobSite: { name: '商業施設C', address: '東京都港区' },
    labelId: '4',
    label: { name: '定期点検', color: '#10b981' },
    startAt: '2025-07-19T10:00:00',
    endAt: '2025-07-19T13:00:00',
    allDay: false,
    status: 'CONFIRMED',
    assignees: [
      { userId: '3', user: { name: '鈴木職人' }, responseStatus: 'ACCEPTED' }
    ]
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  // Filter events by date range if provided
  let filteredEvents = mockEvents
  if (start && end) {
    filteredEvents = mockEvents.filter(event => {
      const eventDate = new Date(event.startAt)
      return eventDate >= new Date(start) && eventDate <= new Date(end)
    })
  }

  return NextResponse.json({
    success: true,
    data: filteredEvents
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newEvent = {
    id: Date.now().toString(),
    ...body,
    status: 'PROPOSED',
    createdAt: new Date().toISOString()
  }

  mockEvents.push(newEvent)

  return NextResponse.json({
    success: true,
    data: newEvent
  })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()

  const eventIndex = mockEvents.findIndex(e => e.id === id)
  if (eventIndex === -1) {
    return NextResponse.json({
      success: false,
      message: 'Event not found'
    }, { status: 404 })
  }

  mockEvents[eventIndex] = {
    ...mockEvents[eventIndex],
    ...updates
  }

  return NextResponse.json({
    success: true,
    data: mockEvents[eventIndex]
  })
}