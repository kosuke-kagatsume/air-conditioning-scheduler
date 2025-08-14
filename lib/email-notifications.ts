import * as Sentry from '@sentry/nextjs'

export interface EmailNotificationData {
  to: string | string[]
  subject: string
  html: string
  eventId?: string
  eventType?: 'schedule.update' | 'schedule.create' | 'schedule.delete' | 'worker.assign' | 'worker.remove'
}

/**
 * スケジュール変更のメール通知を送信
 */
export async function sendScheduleNotification(
  notificationData: EmailNotificationData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch('/api/notify/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send notification')
    }

    return {
      success: true,
      data: result.data,
    }
  } catch (error) {
    console.error('Failed to send schedule notification:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * イベント更新通知のHTMLテンプレート
 */
export function generateEventUpdateEmailHtml(data: {
  eventTitle: string
  eventDate: string
  eventTime: string
  workerName: string
  siteName: string
  changes: Record<string, { before: any; after: any }>
  updatedBy: string
}): string {
  const { eventTitle, eventDate, eventTime, workerName, siteName, changes, updatedBy } = data

  const changesHtml = Object.entries(changes)
    .map(([field, change]) => {
      const fieldName = getFieldDisplayName(field)
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${fieldName}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #666;">${change.before || '未設定'}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: #2c5aa0;">${change.after || '未設定'}</td>
        </tr>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>スケジュール変更通知</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">📅 スケジュール変更通知</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2c5aa0; margin-top: 0;">工事予定が変更されました</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="margin-top: 0; color: #333;">📋 案件情報</h3>
          <p><strong>案件名:</strong> ${eventTitle}</p>
          <p><strong>日時:</strong> ${eventDate} ${eventTime}</p>
          <p><strong>担当者:</strong> ${workerName}</p>
          <p><strong>現場:</strong> ${siteName}</p>
          <p><strong>変更者:</strong> ${updatedBy}</p>
        </div>

        ${changesHtml ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">📝 変更内容</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">項目</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">変更前</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">変更後</th>
              </tr>
            </thead>
            <tbody>
              ${changesHtml}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0066cc;">
            <strong>📱 確認をお願いします</strong><br>
            変更内容をご確認の上、問題がございましたらお早めにご連絡ください。
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            このメールは HVAC Scheduler システムから自動送信されています。<br>
            ご不明な点がございましたら、管理者までお問い合わせください。
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * 職人割当通知のHTMLテンプレート
 */
export function generateWorkerAssignEmailHtml(data: {
  eventTitle: string
  eventDate: string
  eventTime: string
  workerName: string
  siteName: string
  assignedBy: string
  notes?: string
}): string {
  const { eventTitle, eventDate, eventTime, workerName, siteName, assignedBy, notes } = data

  return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>作業割当通知</title>
    </head>
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">👷 新しい作業が割り当てられました</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #11998e; margin-top: 0;">作業割当のお知らせ</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #11998e;">
          <h3 style="margin-top: 0; color: #333;">📋 作業内容</h3>
          <p><strong>案件名:</strong> ${eventTitle}</p>
          <p><strong>日時:</strong> ${eventDate} ${eventTime}</p>
          <p><strong>担当者:</strong> ${workerName}</p>
          <p><strong>現場:</strong> ${siteName}</p>
          <p><strong>割当者:</strong> ${assignedBy}</p>
          ${notes ? `<p><strong>備考:</strong> ${notes}</p>` : ''}
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32;">
            <strong>✅ 対応をお願いします</strong><br>
            この作業への参加可否をシステムでご回答ください。
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            このメールは HVAC Scheduler システムから自動送信されています。<br>
            ご不明な点がございましたら、管理者までお問い合わせください。
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * フィールド名の表示名を取得
 */
function getFieldDisplayName(field: string): string {
  const fieldMap: Record<string, string> = {
    title: '案件名',
    date: '日付',
    startTime: '開始時間',
    endTime: '終了時間',
    workerId: '担当者ID',
    workerName: '担当者名',
    status: 'ステータス',
    siteId: '現場ID',
    siteName: '現場名',
    notes: '備考',
    estimatedHours: '予定時間',
    constructionType: '工事種別',
  }
  
  return fieldMap[field] || field
}