import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

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
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/events',
      attributes: {
        'http.method': 'GET',
        'http.route': '/api/events',
      },
    },
    async () => {
      const { searchParams } = new URL(request.url)
      const start = searchParams.get('start')
      const end = searchParams.get('end')

      // Filter events by date range if provided
      let filteredEvents = mockEvents
      if (start && end) {
        Sentry.setContext('query', { start, end })
        
        filteredEvents = mockEvents.filter(event => {
          const eventDate = new Date(event.startAt)
          return eventDate >= new Date(start) && eventDate <= new Date(end)
        })
      }

      Sentry.setMeasurement('events.count', filteredEvents.length, 'none')

      return NextResponse.json({
        success: true,
        data: filteredEvents
      })
    }
  )
}

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/events',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/events',
      },
    },
    async () => {
      try {
        const body = await request.json()
        
        Sentry.setContext('event.create', {
          title: body.title,
          status: body.status,
          startAt: body.startAt,
        })

        const newEvent = {
          id: Date.now().toString(),
          ...body,
          status: 'PROPOSED',
          createdAt: new Date().toISOString()
        }

        mockEvents.push(newEvent)
        
        // カスタムイベントをSentryに送信
        Sentry.captureMessage('Event created', {
          level: 'info',
          tags: {
            action: 'event.create',
            status: newEvent.status,
          },
        })

        return NextResponse.json({
          success: true,
          data: newEvent
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json({
          success: false,
          message: 'Failed to create event'
        }, { status: 500 })
      }
    }
  )
}

export async function PATCH(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'dispatch.schedule.update',
      name: 'PATCH /api/events - Schedule Update',
      attributes: {
        'http.method': 'PATCH',
        'http.route': '/api/events',
        'dispatch.type': 'schedule.update',
      },
    },
    async () => {
      try {
        const { id, ...updates } = await request.json()
        
        Sentry.setContext('event.update', {
          eventId: id,
          updates: Object.keys(updates),
        })

        const eventIndex = mockEvents.findIndex(e => e.id === id)
        if (eventIndex === -1) {
          return NextResponse.json({
            success: false,
            message: 'Event not found'
          }, { status: 404 })
        }

        // 職人割当変更の追跡
        if (updates.assignees) {
          Sentry.startSpan(
            {
              op: 'dispatch.assignee.change',
              name: 'Update Event Assignees',
              attributes: {
                'event.id': id,
                'assignees.count': updates.assignees.length,
              },
            },
            () => {
              // 割当変更のロジック
              Sentry.captureMessage('Event assignee changed', {
                level: 'info',
                tags: {
                  action: 'assignee.change',
                  eventId: id,
                },
              })
            }
          )
        }

        mockEvents[eventIndex] = {
          ...mockEvents[eventIndex],
          ...updates
        }

        return NextResponse.json({
          success: true,
          data: mockEvents[eventIndex]
        })
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json({
          success: false,
          message: 'Failed to update event'
        }, { status: 500 })
      }
    }
  )
}