import { NextRequest, NextResponse } from 'next/server'
import { sendScheduleNotification, generateEventUpdateEmailHtml, generateWorkerAssignEmailHtml } from '@/lib/email-notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'update', to = 'test@example.com' } = body

    let emailHtml: string
    let subject: string

    if (type === 'assign') {
      emailHtml = generateWorkerAssignEmailHtml({
        eventTitle: 'テスト案件：オフィスビル空調設置',
        eventDate: '2025-08-15',
        eventTime: '09:00 - 12:00',
        workerName: 'テスト職人',
        siteName: 'テスト現場A',
        assignedBy: 'テスト管理者',
        notes: 'テスト用の割当通知です',
      })
      subject = '【HVAC Scheduler】新しい作業が割り当てられました - テスト案件'
    } else {
      emailHtml = generateEventUpdateEmailHtml({
        eventTitle: 'テスト案件：オフィスビル空調設置',
        eventDate: '2025-08-15',
        eventTime: '09:00 - 12:00',
        workerName: 'テスト職人',
        siteName: 'テスト現場A',
        changes: {
          startTime: { before: '10:00', after: '09:00' },
          endTime: { before: '13:00', after: '12:00' },
          workerId: { before: 'worker-2', after: 'worker-1' },
        },
        updatedBy: 'テスト管理者',
      })
      subject = '【HVAC Scheduler】スケジュール変更通知 - テスト案件'
    }

    const result = await sendScheduleNotification({
      to,
      subject,
      html: emailHtml,
      eventId: 'test-event-123',
      eventType: type === 'assign' ? 'worker.assign' : 'schedule.update',
    })

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      data: result.data,
      error: result.error,
      emailPreview: {
        to,
        subject,
        type,
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      POST: 'Send test email',
      parameters: {
        type: 'update | assign (default: update)',
        to: 'email address (default: test@example.com)'
      },
      examples: [
        'POST /api/test/email (sends update notification)',
        'POST /api/test/email {"type": "assign", "to": "user@example.com"}',
      ]
    },
    resendConfigured: !!process.env.RESEND_API_KEY,
  })
}