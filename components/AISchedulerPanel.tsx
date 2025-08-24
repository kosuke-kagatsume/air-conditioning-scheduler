'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, Users, MapPin, Star, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface WorkerScore {
  workerId: string
  workerName: string
  score: number
  factors: {
    skillMatch: number
    distance: number
    workloadBalance: number
    experience: number
    customerRating: number
  }
  details: {
    matchedSkills: string[]
    missingSkills: string[]
    distanceKm: number
    currentJobsToday: number
    totalExperience: number
    averageRating: number
  }
}

interface ScheduleSuggestion {
  eventId: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  requiredSkills: string[]
  recommendations: WorkerScore[]
  autoAssigned?: {
    workerId: string
    workerName: string
    reason: string
  }
}

export default function AISchedulerPanel() {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  // AI最適化を実行
  const runOptimization = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/schedule/optimize')
      const data = await response.json()
      
      if (data.success) {
        setSuggestions(data.data.suggestions)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // 単一割り当て
  const assignWorker = async (eventId: string, workerId: string) => {
    try {
      const response = await fetch('/api/schedule/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto-assign-single',
          eventId,
          workerId
        })
      })
      
      if (response.ok) {
        // 再読み込み
        runOptimization()
      }
    } catch (error) {
      console.error('Assignment failed:', error)
    }
  }

  // 一括自動割り当て
  const autoAssignAll = async () => {
    if (!confirm('推奨される職人を全て自動割り当てしますか？')) return
    
    try {
      const response = await fetch('/api/schedule/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto-assign-all',
          suggestions: suggestions.filter(s => s.autoAssigned)
        })
      })
      
      if (response.ok) {
        runOptimization()
      }
    } catch (error) {
      console.error('Batch assignment failed:', error)
    }
  }

  // スコアを視覚化
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    if (score >= 0.4) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBar = (score: number) => {
    const percentage = Math.round(score * 100)
    const color = score >= 0.8 ? 'bg-green-500' : 
                  score >= 0.6 ? 'bg-yellow-500' : 
                  score >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold">AI スケジュール最適化</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={runOptimization}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>分析中...</>
            ) : (
              <>
                <Zap size={16} />
                最適化分析を実行
              </>
            )}
          </button>
          {suggestions.length > 0 && stats?.autoAssignable > 0 && (
            <button
              onClick={autoAssignAll}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle size={16} />
              一括自動割り当て ({stats.autoAssignable}件)
            </button>
          )}
        </div>
      </div>

      {/* 統計情報 */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">未割当イベント</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.autoAssignable}</div>
            <div className="text-sm text-gray-600">自動割当可能</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
            <div className="text-sm text-gray-600">要確認</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(stats.averageMatchScore * 100)}%
            </div>
            <div className="text-sm text-gray-600">平均マッチ度</div>
          </div>
        </div>
      )}

      {/* 提案リスト */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.eventId} className="border rounded-lg overflow-hidden">
            {/* イベント情報 */}
            <div className="bg-gray-50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{suggestion.eventTitle}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(suggestion.eventDate).toLocaleDateString('ja-JP')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {suggestion.eventLocation}
                    </span>
                  </div>
                  {suggestion.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {suggestion.requiredSkills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {suggestion.autoAssigned && (
                  <div className="bg-green-100 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle size={16} />
                      <span className="font-medium">自動割当推奨</span>
                    </div>
                    <div className="text-sm mt-1">{suggestion.autoAssigned.workerName}</div>
                    <div className="text-xs text-gray-600 mt-1">{suggestion.autoAssigned.reason}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 推奨職人リスト */}
            <div className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">推奨職人 TOP5</div>
              <div className="space-y-2">
                {suggestion.recommendations.map((worker, index) => (
                  <div key={worker.workerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`font-bold text-lg ${index === 0 ? 'text-gold' : 'text-gray-400'}`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{worker.workerName}</div>
                        <div className="text-xs text-gray-600">
                          スキル: {worker.details.matchedSkills.join(', ') || 'なし'} |
                          距離: {worker.details.distanceKm}km |
                          本日: {worker.details.currentJobsToday}件
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(worker.score)}`}>
                          {Math.round(worker.score * 100)}%
                        </div>
                        <div className="w-24">
                          {getScoreBar(worker.score)}
                        </div>
                      </div>
                      <button
                        onClick={() => assignWorker(suggestion.eventId, worker.workerId)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        割当
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 詳細表示 */}
              {selectedEvent === suggestion.eventId && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">スコア詳細</h4>
                  {suggestion.recommendations[0] && (
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div>
                        <div className="text-gray-600">スキル</div>
                        <div className="font-bold">{Math.round(suggestion.recommendations[0].factors.skillMatch * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">距離</div>
                        <div className="font-bold">{Math.round(suggestion.recommendations[0].factors.distance * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">負荷</div>
                        <div className="font-bold">{Math.round(suggestion.recommendations[0].factors.workloadBalance * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">経験</div>
                        <div className="font-bold">{Math.round(suggestion.recommendations[0].factors.experience * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">評価</div>
                        <div className="font-bold">{Math.round(suggestion.recommendations[0].factors.customerRating * 100)}%</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => setSelectedEvent(selectedEvent === suggestion.eventId ? null : suggestion.eventId)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                {selectedEvent === suggestion.eventId ? '詳細を隠す' : '詳細を表示'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 空状態 */}
      {!loading && suggestions.length === 0 && (
        <div className="text-center py-12">
          <Brain className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">最適化分析を実行してください</p>
        </div>
      )}
    </div>
  )
}

// 必要なインポートを追加
import { Calendar } from 'lucide-react'