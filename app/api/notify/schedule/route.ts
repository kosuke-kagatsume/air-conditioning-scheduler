import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'notification.email',
      name: 'POST /api/notify/schedule',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/notify/schedule',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { to, subject, html, eventId, eventType = 'schedule.update' } = body

        // 入力検証
        if (!to || !subject || !html) {
          return NextResponse.json(
            {
              success: false,
              message: 'Missing required fields: to, subject, html',
            },
            { status: 400 }
          )
        }

        // メール送信（指数バックオフで3回まで再試行）
        let lastError: Error | null = null
        const maxRetries = 3
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const result = await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'noreply@hvac-scheduler.com',
              to: Array.isArray(to) ? to : [to],
              subject,
              html,
              headers: {
                'X-Event-Id': eventId || 'unknown',
                'X-Event-Type': eventType,
                'X-Attempt': attempt.toString(),
              },
            })

            // 成功時の処理
            Sentry.captureMessage('Email notification sent successfully', {
              level: 'info',
              tags: {
                action: 'email.sent',
                eventType,
                attempt: attempt.toString(),
              },
              extra: {
                emailId: result.data?.id,
                to: Array.isArray(to) ? to : [to],
                subject,
                eventId,
              },
            })

            return NextResponse.json({
              success: true,
              data: {
                id: result.data?.id,
                attempt,
                message: 'Email sent successfully',
              },
            })
          } catch (error) {
            lastError = error as Error
            
            // 最終試行でない場合は指数バックオフで待機
            if (attempt < maxRetries) {
              const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000) // 最大10秒
              await new Promise(resolve => setTimeout(resolve, backoffMs))
              
              console.warn(`Email send attempt ${attempt} failed, retrying in ${backoffMs}ms:`, error)
            }
          }
        }

        // 全ての試行が失敗した場合
        Sentry.captureException(lastError, {
          tags: {
            action: 'email.failed',
            eventType,
            maxRetries: maxRetries.toString(),
          },
          extra: {
            to: Array.isArray(to) ? to : [to],
            subject,
            eventId,
            finalError: lastError?.message,
          },
        })

        return NextResponse.json(
          {
            success: false,
            message: `Failed to send email after ${maxRetries} attempts`,
            error: lastError?.message,
          },
          { status: 500 }
        )
      } catch (error) {
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Internal server error',
          },
          { status: 500 }
        )
      }
    }
  )
}

// ヘルスチェックエンドポイント
export async function GET() {
  return NextResponse.json({
    service: 'Email Notification API',
    status: 'healthy',
    resendConfigured: !!process.env.RESEND_API_KEY,
    timestamp: new Date().toISOString(),
  })
}