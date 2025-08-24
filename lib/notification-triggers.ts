// 通知トリガー関数集
// 各種イベント発生時に呼び出して通知を送信

import { EVENTS } from './pusher'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'

// スケジュール作成通知
export async function notifyScheduleCreated(
  workerId: string,
  scheduleTitle: string,
  dateTime: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'SCHEDULE_CREATED',
      title: '新しいスケジュール',
      message: `${scheduleTitle} が ${dateTime} に追加されました`,
      severity: 'info',
      targetType: 'user',
      targetId: workerId,
      data: { scheduleTitle, dateTime }
    })
  })
}

// 職人割り当て通知
export async function notifyWorkerAssigned(
  workerId: string,
  jobTitle: string,
  location: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'WORKER_ASSIGNED',
      title: '作業割り当て',
      message: `${jobTitle} (${location}) に割り当てられました`,
      severity: 'info',
      targetType: 'user',
      targetId: workerId,
      data: { jobTitle, location }
    })
  })
}

// 問題報告通知（管理者向け）
export async function notifyProblemReported(
  companyId: string,
  workerName: string,
  problemTitle: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'PROBLEM_REPORTED',
      title: '⚠️ 問題報告',
      message: `${workerName}から: ${problemTitle}`,
      severity: 'warning',
      targetType: 'admins',
      data: { workerName, problemTitle, companyId }
    })
  })
}

// 緊急SOS通知
export async function notifyWorkerSOS(
  workerId: string,
  workerName: string,
  location: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'WORKER_SOS',
      title: '🚨 緊急SOS',
      message: `${workerName}が${location}で緊急支援を要請しています`,
      severity: 'error',
      targetType: 'admins',
      data: { workerId, workerName, location }
    })
  })
}

// チェックイン通知
export async function notifyWorkerCheckIn(
  companyId: string,
  workerName: string,
  jobTitle: string,
  time: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'WORKER_CHECK_IN',
      title: '✅ チェックイン',
      message: `${workerName}が${jobTitle}に${time}到着しました`,
      severity: 'success',
      targetType: 'company',
      targetId: companyId,
      data: { workerName, jobTitle, time }
    })
  })
}

// チェックアウト通知
export async function notifyWorkerCheckOut(
  companyId: string,
  workerName: string,
  jobTitle: string,
  time: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'WORKER_CHECK_OUT',
      title: '✅ 作業完了',
      message: `${workerName}が${jobTitle}を${time}に完了しました`,
      severity: 'success',
      targetType: 'company',
      targetId: companyId,
      data: { workerName, jobTitle, time }
    })
  })
}

// スケジュールリマインダー（30分前）
export async function notifyScheduleReminder(
  workerId: string,
  scheduleTitle: string,
  location: string,
  startTime: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'SCHEDULE_REMINDER',
      title: '⏰ リマインダー',
      message: `30分後: ${scheduleTitle} (${location})`,
      severity: 'info',
      targetType: 'user',
      targetId: workerId,
      data: { scheduleTitle, location, startTime }
    })
  })
}

// システムメンテナンス通知
export async function notifySystemMaintenance(
  maintenanceDate: string,
  duration: string
) {
  await fetch(`${API_URL}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'SYSTEM_MAINTENANCE',
      title: '🔧 システムメンテナンス',
      message: `${maintenanceDate}に${duration}のメンテナンスを実施します`,
      severity: 'warning',
      targetType: 'global',
      data: { maintenanceDate, duration }
    })
  })
}