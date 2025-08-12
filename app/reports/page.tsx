'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AppLayout from '@/components/AppLayout'
import { ReportIcon, CalendarIcon, PlusIcon } from '@/components/Icons'
import { mockReports, mockEvents } from '@/lib/mockData'
import type { WorkReport } from '@/lib/mockData'

export default function ReportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // デモ報告書データを使用
  const [reports, setReports] = useState<any[]>([])
  
  useEffect(() => {
    // イベント情報と結合して表示用データを作成
    const enrichedReports = mockReports.map(report => {
      const event = mockEvents.find(e => e.id === report.eventId)
      return {
        ...report,
        eventTitle: event?.title || `作業 #${report.eventId}`,
        siteName: event?.clientName || '現場'
      }
    })
    setReports(enrichedReports)
  }, [])

  // 元のダミーデータは削除（既に上で実データに置き換え）

  const getStatusBadge = (status: WorkReport['status']) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      draft: { bg: '#f3f4f6', color: '#6b7280', label: '下書き' },
      submitted: { bg: '#dbeafe', color: '#2563eb', label: '提出済み' },
      approved: { bg: '#dcfce7', color: '#16a34a', label: '承認済み' },
      rejected: { bg: '#fef3c7', color: '#d97706', label: '却下' }
    }
    const style = styles[status] || styles.draft
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        background: style.bg,
        color: style.color,
        fontSize: '12px',
        fontWeight: '600'
      }}>
        {style.label}
      </span>
    )
  }

  const filteredReports = filterStatus === 'all' 
    ? reports 
    : reports.filter(r => r.status === filterStatus)

  return (
    <AppLayout>
      <div style={{
        padding: '24px',
        background: '#f5f6f8',
        minHeight: 'calc(100vh - 56px)'
      }}>
        {/* 統計カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ReportIcon size={20} color="#16a34a" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>今月の提出数</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>42件</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ReportIcon size={20} color="#2563eb" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>承認待ち</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>8件</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ReportIcon size={20} color="#d97706" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>要修正</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>3件</p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ReportIcon size={20} color="#6b7280" />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>下書き</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>5件</p>
              </div>
            </div>
          </div>
        </div>

        {/* フィルターとアクションバー */}
        <div style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'draft', 'submitted', 'approved', 'revision'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '8px 16px',
                  background: filterStatus === status ? '#FF8C42' : '#f3f4f6',
                  color: filterStatus === status ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'all' ? '全て' :
                 status === 'draft' ? '下書き' :
                 status === 'submitted' ? '提出済み' :
                 status === 'approved' ? '承認済み' : '要修正'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#FF8C42',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <PlusIcon size={16} color="white" />
            新規作成
          </button>
        </div>

        {/* 報告書リスト */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  作成日
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  現場名
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  作業内容
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  作業者
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  ステータス
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <tr 
                  key={report.id} 
                  style={{ 
                    borderBottom: index < filteredReports.length - 1 ? '1px solid #f3f4f6' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(report.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {report.siteName}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {report.eventTitle}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280',
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {report.workContent}
                    </p>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                    {report.worker}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {getStatusBadge(report.status)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => setSelectedReport(report)}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        詳細
                      </button>
                      {report.status === 'draft' && (
                        <button
                          style={{
                            padding: '6px 12px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          提出
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      

      {/* 作成モーダル */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1f2937'
            }}>
              作業報告書を作成
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  作業日
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                    開始時刻
                  </label>
                  <input
                    type="time"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                    終了時刻
                  </label>
                  <input
                    type="time"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  現場名
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option>選択してください</option>
                  <option>渋谷オフィスビル</option>
                  <option>新宿マンション</option>
                  <option>品川商業施設</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  作業内容
                </label>
                <textarea
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="実施した作業内容を詳しく記入してください"
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  写真を追加
                </label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#f9fafb'
                }}>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>
                    クリックして写真を選択<br />
                    またはドラッグ＆ドロップ
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                キャンセル
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#FF8C42',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                下書き保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 詳細モーダル */}
      {selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                作業報告書詳細
              </h2>
              {getStatusBadge(selectedReport.status)}
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  基本情報
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>作業日:</span>
                    <span style={{ fontSize: '14px', color: '#1f2937' }}>
                      {new Date(selectedReport.date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>作業時間:</span>
                    <span style={{ fontSize: '14px', color: '#1f2937' }}>
                      {selectedReport.startTime} - {selectedReport.endTime}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>現場:</span>
                    <span style={{ fontSize: '14px', color: '#1f2937' }}>
                      {selectedReport.siteName}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>作業者:</span>
                    <span style={{ fontSize: '14px', color: '#1f2937' }}>
                      {selectedReport.worker}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  作業内容
                </h3>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                  {selectedReport.workContent}
                </p>
              </div>

              {selectedReport.issues && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    特記事項
                  </h3>
                  <p style={{ fontSize: '14px', color: '#dc2626', lineHeight: '1.6' }}>
                    {selectedReport.issues}
                  </p>
                </div>
              )}

              {selectedReport.materials.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    使用材料
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>品名</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>数量</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontSize: '12px', color: '#6b7280' }}>単位</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.materials?.map((material: any, index: number) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '8px', fontSize: '14px' }}>{material.name}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontSize: '14px' }}>{material.quantity}</td>
                          <td style={{ padding: '8px', fontSize: '14px' }}>{material.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setSelectedReport(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                閉じる
              </button>
              {selectedReport.status === 'submitted' && (
                <>
                  <button
                    style={{
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    差戻し
                  </button>
                  <button
                    style={{
                      padding: '10px 20px',
                      background: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    承認
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  )
}