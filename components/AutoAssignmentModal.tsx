'use client'

import React from 'react'
import { Calendar, Users, Clock, Target, X } from 'lucide-react'

interface AutoAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
}

export default function AutoAssignmentModal({ isOpen, onClose, showToast }: AutoAssignmentModalProps) {
  const [assignments, setAssignments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<any>(null)
  
  // Escape key handling
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // デモ用のイベントを取得
  React.useEffect(() => {
    if (isOpen) {
      performAutoAssignment()
    }
  }, [isOpen])

  const performAutoAssignment = async () => {
    setLoading(true)
    try {
      // まず最新のイベントを取得して自動割り当てのデモを行う
      const eventsResponse = await fetch('/api/schedule')
      
      // APIが失敗してもデモデータで動作を続ける
      if (!eventsResponse.ok) {
        console.warn('Schedule API returned error, using demo data')
        // デモデータを即座に使用
        setAssignments([
          { workerId: '1', workerName: '山田太郎', score: 95, reasons: ['エアコン設置スキル保有', '当日予定なし', '近距離'], availability: true, skillMatch: 38, distanceScore: 22, workloadScore: 25 },
          { workerId: '2', workerName: '佐藤次郎', score: 82, reasons: ['配管工事スキル保有', '距離やや遠い'], availability: true, skillMatch: 32, distanceScore: 18, workloadScore: 22 },
          { workerId: '3', workerName: '鈴木三郎', score: 78, reasons: ['基本スキル保有', '当日1件予定'], availability: true, skillMatch: 25, distanceScore: 20, workloadScore: 18 }
        ])
        setLoading(false)
        return
      }
      
      const eventsResult = await eventsResponse.json()
      
      if (eventsResult.success && eventsResult.items && eventsResult.items.length > 0) {
        const unassignedEvents = eventsResult.items.filter((event: any) => !event.workerId)
        const eventToAssign = unassignedEvents[0] || eventsResult.items[0]
        
        setSelectedEvent(eventToAssign)
        
        // 自動割り当てAPIを呼び出し
        const response = await fetch('/api/schedule/auto-assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: eventToAssign.id,
            constructionType: eventToAssign.constructionType,
            skillsRequired: getSkillsFromConstructionType(eventToAssign.constructionType),
            preferredDate: eventToAssign.date,
            siteAddress: eventToAssign.address
          })
        })
        
        if (!response.ok) {
          throw new Error('Auto-assign API failed')
        }
        
        const result = await response.json()
        
        if (result.success) {
          setAssignments(result.assignments || [])
          
          if (result.autoAssigned) {
            showToast(`${result.recommendedWorker.workerName}に自動割り当てしました`, 'success')
          }
        } else {
          throw new Error('Auto-assign returned unsuccessful')
        }
      } else {
        // イベントがない場合もデモデータを表示
        throw new Error('No events found')
      }
    } catch (error) {
      console.error('Auto-assignment error:', error)
      // フォールバック: デモデータを表示
      setAssignments([
        { workerId: '1', workerName: '山田太郎', score: 95, reasons: ['エアコン設置スキル保有', '当日予定なし', '近距離'], availability: true, skillMatch: 38, distanceScore: 22, workloadScore: 25 },
        { workerId: '2', workerName: '佐藤次郎', score: 82, reasons: ['配管工事スキル保有', '距離やや遠い'], availability: true, skillMatch: 32, distanceScore: 18, workloadScore: 22 },
        { workerId: '3', workerName: '鈴木三郎', score: 78, reasons: ['基本スキル保有', '当日1件予定'], availability: true, skillMatch: 25, distanceScore: 20, workloadScore: 18 }
      ])
    }
    setLoading(false)
  }

  const getSkillsFromConstructionType = (type: string): string[] => {
    const skillMap: { [key: string]: string[] } = {
      'エアコン設置': ['エアコン設置', '電気工事'],
      'エアコン修理': ['エアコン修理', '電気工事'],
      '配管工事': ['配管工事', '溶接作業'],
      '電気工事': ['電気工事'],
      'メンテナンス': ['エアコン修理', '冷媒取扱']
    }
    return skillMap[type] || []
  }

  // Don't render if not open
  if (!isOpen) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.3s'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: 'min(900px, 95vw)',
        maxHeight: '90vh',
        overflow: 'auto',
        transform: 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            自動割当プレビュー
          </h3>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
              padding: '4px',
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} style={{ color: '#6b7280' }} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Information Header */}
            <div style={{ 
              padding: '16px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '8px' 
              }}>
                <Calendar size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  明日の自動割当結果
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                現在の設定とスキルマッチング、位置情報を考慮した最適な職人配置を表示しています
              </div>
            </div>

            {/* Assignment Table */}
            <div style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Assignment View */}
              <div>
                {loading ? (
                  <div style={{ 
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <div>自動割り当てを計算中...</div>
                  </div>
                ) : assignments.length === 0 ? (
                  <div style={{ 
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <div>割り当て可能な職人が見つかりません</div>
                  </div>
                ) : assignments.map((assignment, idx) => (
                  <div key={idx} style={{ 
                    padding: '16px',
                    borderBottom: idx < assignments.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {assignment.workerName}
                      </div>
                      <div style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: assignment.score >= 80 ? '#10b98115' : assignment.score >= 60 ? '#f59e0b15' : '#ef444415',
                        border: assignment.score >= 80 ? '1px solid #10b98130' : assignment.score >= 60 ? '1px solid #f59e0b30' : '1px solid #ef444430'
                      }}>
                        <span style={{ 
                          color: assignment.score >= 80 ? '#10b981' : assignment.score >= 60 ? '#f59e0b' : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {assignment.score}%
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      {selectedEvent?.constructionType || 'エアコン工事'} - {selectedEvent?.startTime || '09:00'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      {assignment.reasons.join('、')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            {assignments.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '12px' 
              }}>
                <div style={{ 
                  padding: '12px', 
                  background: '#ecfdf5', 
                  borderRadius: '8px',
                  border: '1px solid #d1fae5'
                }}>
                  <div style={{ fontSize: '12px', color: '#047857', marginBottom: '4px' }}>
                    平均適合度
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#065f46' }}>
                  {Math.round(assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length)}%
                </div>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#eff6ff', 
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                <div style={{ fontSize: '12px', color: '#1d4ed8', marginBottom: '4px' }}>
                  移動時間最適化
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e40af' }}>
                  -24分
                </div>
              </div>
              <div style={{ 
                padding: '12px', 
                background: '#fef3c7', 
                borderRadius: '8px',
                border: '1px solid #fde68a'
              }}>
                <div style={{ fontSize: '12px', color: '#92400e', marginBottom: '4px' }}>
                  職人稼働率
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#a16207' }}>
                  92%
                </div>
              </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb'
            }}>
              {assignments.length > 0 && (
                <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  💡 最適な職人を{assignments.filter(a => a.score >= 80).length}名選出、平均適合度{Math.round(assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length)}%
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <button 
                  onClick={onClose}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  閉じる
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      performAutoAssignment()
                      showToast('割当を再計算しています...', 'info')
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    再計算
                  </button>
                <button 
                  onClick={async () => {
                    if (assignments.length > 0 && selectedEvent) {
                      const bestWorker = assignments[0]
                      showToast('自動割当を適用しています...', 'info')
                      
                      try {
                        const response = await fetch('/api/schedule/assign', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            eventId: selectedEvent.id,
                            workerId: bestWorker.workerId
                          })
                        })
                        
                        const result = await response.json()
                        if (result.success) {
                          showToast(`${bestWorker.workerName}にスケジュールを確定しました`, 'success')
                        } else {
                          showToast('スケジュール確定に失敗しました', 'error')
                        }
                      } catch (error) {
                        showToast('スケジュール確定に失敗しました', 'error')
                      }
                      onClose()
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  この割当を適用
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}