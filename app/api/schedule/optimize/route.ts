import { NextRequest } from 'next/server'
import { generateScheduleSuggestions, executeAutoAssignment } from '@/lib/ai-scheduler'
import { handleApiError, successResponse } from '@/lib/api-helpers'
import * as Sentry from '@sentry/nextjs'

// スケジュール最適化提案を取得
export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/schedule/optimize',
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const eventId = searchParams.get('eventId')
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const dateRange = from && to
          ? { from: new Date(from), to: new Date(to) }
          : undefined

        const suggestions = await generateScheduleSuggestions(
          eventId || undefined,
          dateRange
        )

        // 統計情報を計算
        const stats = {
          totalEvents: suggestions.length,
          autoAssignable: suggestions.filter(s => s.autoAssigned).length,
          needsReview: suggestions.filter(s => !s.autoAssigned).length,
          averageMatchScore: suggestions.reduce((sum, s) => {
            const topScore = s.recommendations[0]?.score || 0
            return sum + topScore
          }, 0) / (suggestions.length || 1)
        }

        return successResponse({
          suggestions,
          stats,
          generated: new Date().toISOString()
        })
      } catch (error) {
        return handleApiError(error, 'スケジュール最適化に失敗しました')
      }
    }
  )
}

// 自動割り当てを実行
export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/schedule/optimize',
    },
    async () => {
      try {
        const body = await request.json()
        const { action, eventId, workerId, suggestions } = body

        if (action === 'auto-assign-single') {
          // 単一イベントの自動割り当て
          if (!eventId || !workerId) {
            throw new Error('Event ID and Worker ID are required')
          }

          const success = await executeAutoAssignment(eventId, workerId)
          
          if (success) {
            return successResponse(
              { eventId, workerId, assigned: true },
              '職人を割り当てました'
            )
          } else {
            throw new Error('割り当てに失敗しました')
          }
        }

        if (action === 'auto-assign-all') {
          // 複数イベントの一括自動割り当て
          if (!suggestions || !Array.isArray(suggestions)) {
            throw new Error('Suggestions array is required')
          }

          const results = []
          let successCount = 0
          let failCount = 0

          for (const suggestion of suggestions) {
            if (suggestion.autoAssigned) {
              const success = await executeAutoAssignment(
                suggestion.eventId,
                suggestion.autoAssigned.workerId
              )
              
              if (success) {
                successCount++
                results.push({
                  eventId: suggestion.eventId,
                  workerId: suggestion.autoAssigned.workerId,
                  success: true
                })
              } else {
                failCount++
                results.push({
                  eventId: suggestion.eventId,
                  success: false,
                  error: 'Assignment failed'
                })
              }
            }
          }

          return successResponse(
            {
              results,
              summary: {
                total: suggestions.length,
                assigned: successCount,
                failed: failCount,
                skipped: suggestions.length - successCount - failCount
              }
            },
            `${successCount}件の割り当てが完了しました`
          )
        }

        throw new Error('Invalid action')
      } catch (error) {
        return handleApiError(error, '自動割り当てに失敗しました')
      }
    }
  )
}