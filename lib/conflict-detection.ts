import * as Sentry from '@sentry/nextjs'

export interface TimeSlot {
  id: string
  workerId: string
  date: string
  startTime: string
  endTime: string
  title?: string
}

export interface ConflictCheckResult {
  hasConflict: boolean
  conflictingEvents: TimeSlot[]
  message?: string
}

/**
 * 時間重複を検知する
 * 条件: !(A.end <= B.start || A.start >= B.end)
 */
export function detectTimeOverlap(
  timeSlotA: { startTime: string; endTime: string },
  timeSlotB: { startTime: string; endTime: string }
): boolean {
  const aStart = timeSlotA.startTime
  const aEnd = timeSlotA.endTime
  const bStart = timeSlotB.startTime
  const bEnd = timeSlotB.endTime
  
  // 重複しない条件: A.end <= B.start || A.start >= B.end
  // 重複する条件: その否定
  return !(aEnd <= bStart || aStart >= bEnd)
}

/**
 * モックデータでの衝突チェック
 */
export function checkScheduleConflict(
  events: Record<string, any>,
  targetEventId: string,
  workerId: string,
  date: string,
  startTime: string,
  endTime: string
): ConflictCheckResult {
  const conflicts = Object.values(events).filter(event => {
    // 自分自身は除外
    if (event.id === targetEventId) return false
    
    // 同一職人・同一日のイベントのみチェック
    if (event.workerId !== workerId || event.date !== date) return false
    
    // 時間重複判定
    return detectTimeOverlap(
      { startTime, endTime },
      { startTime: event.startTime, endTime: event.endTime }
    )
  })

  if (conflicts.length > 0) {
    const conflict = conflicts[0]
    return {
      hasConflict: true,
      conflictingEvents: conflicts,
      message: `職人 ${workerId} は ${date} ${conflict.startTime}-${conflict.endTime} に既に予定があります`
    }
  }

  return {
    hasConflict: false,
    conflictingEvents: []
  }
}

/**
 * Prisma対応版の衝突チェック（将来実装用）
 */
export async function checkScheduleConflictWithPrisma(
  // prisma: PrismaClient,
  eventId: string,
  workerId: string,
  startAt: Date,
  endAt: Date,
  tenantId: string
): Promise<ConflictCheckResult> {
  // TODO: Prismaクライアントが利用可能になったら以下のコードを有効化
  /*
  try {
    const conflicts = await prisma.event.findMany({
      where: {
        workerId,
        tenantId,
        id: { not: eventId },
        // 重複条件: !(A.end <= B.start || A.start >= B.end)
        NOT: [
          { endAt: { lte: startAt } },
          { startAt: { gte: endAt } }
        ]
      },
      select: {
        id: true,
        title: true,
        startAt: true,
        endAt: true,
        date: true
      }
    })

    if (conflicts.length > 0) {
      const conflict = conflicts[0]
      return {
        hasConflict: true,
        conflictingEvents: conflicts.map(c => ({
          id: c.id,
          workerId,
          date: c.date?.toISOString().split('T')[0] || '',
          startTime: c.startAt?.toTimeString().slice(0, 5) || '',
          endTime: c.endAt?.toTimeString().slice(0, 5) || '',
          title: c.title
        })),
        message: `職人 ${workerId} は ${conflict.startAt?.toLocaleString()} から既に予定があります`
      }
    }

    return {
      hasConflict: false,
      conflictingEvents: []
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { component: 'conflict-detection' },
      extra: { eventId, workerId, startAt, endAt }
    })
    throw error
  }
  */

  // 現在はモック実装
  console.warn('Prisma conflict detection not implemented yet')
  return {
    hasConflict: false,
    conflictingEvents: []
  }
}

/**
 * 衝突検知結果をSentryに送信
 */
export function reportConflictToSentry(
  eventId: string,
  workerId: string,
  conflictResult: ConflictCheckResult,
  requestedTime: {
    date: string
    startTime: string
    endTime: string
  }
): void {
  if (conflictResult.hasConflict) {
    Sentry.captureMessage('Schedule conflict detected', {
      level: 'warning',
      tags: {
        action: 'conflict.detected',
        eventId,
        workerId,
      },
      extra: {
        conflictingEvents: conflictResult.conflictingEvents,
        requestedTime,
        message: conflictResult.message,
      },
    })
  }
}