'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { AlertTriangle, CheckCircle, Clock, User, MapPin, MessageCircle } from 'lucide-react'

export default function AdminProblemReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all')
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    // ローカルストレージから問題報告を取得
    const storedReports = JSON.parse(localStorage.getItem('problemReports') || '[]')
    
    // モックデータも追加
    const mockReports = [
      {
        id: Date.now() + 1,
        type: 'equipment',
        urgency: 'high',
        description: 'エアコン室外機から異音がしています。作業を継続できない状態です。',
        photos: [],
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分前
        reporter: '山田太郎',
        site: '渋谷オフィスビル',
        status: 'pending'
      },
      {
        id: Date.now() + 2,
        type: 'safety',
        urgency: 'medium',
        description: '足場に不安定な箇所があります。安全確認をお願いします。',
        photos: [],
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90分前
        reporter: '鈴木一郎',
        site: '新宿マンション',
        status: 'pending'
      }
    ]

    setReports([...storedReports, ...mockReports])
  }, [])

  const handleStatusChange = (reportId: string, newStatus: 'pending' | 'resolved') => {
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    )
    setReports(updatedReports)
    
    // ローカルストレージも更新
    localStorage.setItem('problemReports', JSON.stringify(updatedReports))
  }

  const handleContactWorker = (reportId: string, reporter: string) => {
    alert(`${reporter}に連絡を送信しました。\n\n件名: 問題報告について\n内容: 報告いただいた問題について確認いたします。詳細をお聞かせください。`)
  }

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true
    return report.status === filter
  })

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch(urgency) {
      case 'high': return '緊急'
      case 'medium': return '要対応'
      case 'low': return '報告のみ'
      default: return '不明'
    }
  }

  const getTypeText = (type: string) => {
    const types: {[key: string]: string} = {
      'equipment': '機器の故障',
      'parts': '部品不足',
      'safety': '安全上の問題',
      'access': '現場アクセス不可',
      'customer': '顧客トラブル',
      'other': 'その他'
    }
    return types[type] || type
  }

  return (
    <AppLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={28} color="#ef4444" />
          問題報告管理
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          marginBottom: '32px'
        }}>
          職人からの問題報告を確認・対応
        </p>

        {/* フィルター */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { value: 'all', label: '全て', count: reports.length },
            { value: 'pending', label: '未対応', count: reports.filter(r => r.status === 'pending').length },
            { value: 'resolved', label: '対応済み', count: reports.filter(r => r.status === 'resolved').length }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              style={{
                padding: '8px 16px',
                background: filter === item.value ? '#3b82f6' : 'white',
                color: filter === item.value ? 'white' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {item.label}
              <span style={{
                background: filter === item.value ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                color: filter === item.value ? 'white' : '#6b7280',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* 報告一覧 */}
        <div style={{
          display: 'grid',
          gap: '16px'
        }}>
          {filteredReports.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <p style={{ color: '#6b7280' }}>該当する問題報告がありません</p>
            </div>
          ) : (
            filteredReports.map(report => (
              <div
                key={report.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: report.urgency === 'high' ? '2px solid #ef4444' : '2px solid transparent'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        background: `${getUrgencyColor(report.urgency)}20`,
                        color: getUrgencyColor(report.urgency),
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {getUrgencyText(report.urgency)}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {getTypeText(report.type)}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} />
                        {report.reporter}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} />
                        {report.site}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {new Date(report.timestamp).toLocaleString('ja-JP')}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '16px',
                      color: '#374151',
                      lineHeight: '1.5',
                      marginBottom: '16px'
                    }}>
                      {report.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      padding: '6px 12px',
                      background: report.status === 'resolved' ? '#dcfce7' : '#fef3c7',
                      color: report.status === 'resolved' ? '#166534' : '#92400e',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {report.status === 'resolved' ? '対応済み' : '未対応'}
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  {report.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(report.id, 'resolved')}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle size={16} />
                        対応完了
                      </button>
                      <button
                        onClick={() => handleContactWorker(report.id, report.reporter)}
                        style={{
                          padding: '8px 16px',
                          background: 'white',
                          color: '#6b7280',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <MessageCircle size={16} />
                        職人に連絡
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(report.id, 'pending')}
                      style={{
                        padding: '8px 16px',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      再対応が必要
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  )
}