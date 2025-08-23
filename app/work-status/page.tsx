'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Clock, MapPin, CheckCircle, AlertTriangle, Play, Pause, Check } from 'lucide-react'

export default function WorkStatusPage() {
  const [selectedWork, setSelectedWork] = useState<string | null>(null)
  const [workStatus, setWorkStatus] = useState<{[key: string]: string}>({
    '1': 'not_started',
    '2': 'not_started'
  })

  const todayWorks = [
    {
      id: '1',
      time: '09:00 - 12:00',
      site: '渋谷オフィスビル',
      location: '東京都渋谷区',
      workType: 'エアコン新設',
      client: '山田様',
      status: workStatus['1'] || 'not_started'
    },
    {
      id: '2',
      time: '14:00 - 17:00',
      site: '新宿マンション',
      location: '東京都新宿区',
      workType: 'メンテナンス',
      client: '鈴木様',
      status: workStatus['2'] || 'not_started'
    }
  ]

  const handleStatusChange = (workId: string, newStatus: string) => {
    setWorkStatus(prev => ({
      ...prev,
      [workId]: newStatus
    }))
    
    // ローカルストレージに保存
    localStorage.setItem(`workStatus_${workId}`, newStatus)
    localStorage.setItem(`workStatusTime_${workId}_${newStatus}`, new Date().toISOString())
    
    // 問題報告の場合は問題報告ページにリダイレクト
    if (newStatus === 'issue') {
      setTimeout(() => {
        window.location.href = '/problem-report'
      }, 500)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'not_started': return '#6b7280'
      case 'in_progress': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'issue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'not_started': return '未着手'
      case 'in_progress': return '作業中'
      case 'completed': return '完了'
      case 'issue': return '問題あり'
      default: return '未着手'
    }
  }

  return (
    <AppLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px'
        }}>
          作業ステータス
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          marginBottom: '32px'
        }}>
          本日の作業状況をリアルタイムで更新
        </p>

        {/* 今日の作業一覧 */}
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {todayWorks.map(work => (
            <div
              key={work.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: selectedWork === work.id ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedWork(work.id)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '8px'
                  }}>
                    {work.site}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#718096'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {work.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      {work.location}
                    </span>
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    color: '#4a5568'
                  }}>
                    作業内容: {work.workType} | 顧客: {work.client}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: `${getStatusColor(work.status)}20`,
                  color: getStatusColor(work.status),
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {getStatusText(work.status)}
                </div>
              </div>

              {/* ステータス変更ボタン */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(work.id, 'in_progress')
                  }}
                  disabled={work.status === 'completed'}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: work.status === 'in_progress' ? '#3b82f6' : '#f3f4f6',
                    color: work.status === 'in_progress' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: work.status === 'completed' ? 'not-allowed' : 'pointer',
                    opacity: work.status === 'completed' ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Play size={16} />
                  作業開始
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(work.id, 'completed')
                  }}
                  disabled={work.status === 'not_started'}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: work.status === 'completed' ? '#10b981' : '#f3f4f6',
                    color: work.status === 'completed' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: work.status === 'not_started' ? 'not-allowed' : 'pointer',
                    opacity: work.status === 'not_started' ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <CheckCircle size={16} />
                  作業完了
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(work.id, 'issue')
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: work.status === 'issue' ? '#ef4444' : '#f3f4f6',
                    color: work.status === 'issue' ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <AlertTriangle size={16} />
                  問題報告
                </button>
              </div>

              {/* タイムスタンプ表示 */}
              {work.status !== 'not_started' && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px',
                  background: '#f7fafc',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  {work.status === 'in_progress' && '作業開始時刻: ' + new Date(localStorage.getItem(`workStatusTime_${work.id}_in_progress`) || '').toLocaleTimeString('ja-JP')}
                  {work.status === 'completed' && '作業完了時刻: ' + new Date(localStorage.getItem(`workStatusTime_${work.id}_completed`) || '').toLocaleTimeString('ja-JP')}
                  {work.status === 'issue' && '問題発生時刻: ' + new Date(localStorage.getItem(`workStatusTime_${work.id}_issue`) || '').toLocaleTimeString('ja-JP')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ステータス凡例 */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '16px'
          }}>
            ステータス凡例
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {[
              { status: 'not_started', text: '未着手', description: '作業開始前' },
              { status: 'in_progress', text: '作業中', description: '現在作業を実施中' },
              { status: 'completed', text: '完了', description: '作業が正常に完了' },
              { status: 'issue', text: '問題あり', description: '何らかの問題が発生' }
            ].map(item => (
              <div
                key={item.status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: getStatusColor(item.status)
                }} />
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2d3748'
                  }}>
                    {item.text}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#718096'
                  }}>
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}