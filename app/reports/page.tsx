'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import Sidebar from '@/components/Sidebar'
import { ReportIcon, CalendarIcon, PlusIcon, NotificationIcon, UserIcon } from '@/components/Icons'

// 作業報告書の型定義
interface WorkReport {
  id: string
  eventId: string
  eventTitle: string
  siteName: string
  date: string
  startTime: string
  endTime: string
  worker: string
  status: 'draft' | 'submitted' | 'approved' | 'revision'
  workContent: string
  issues?: string
  photos: string[]
  materials: Array<{
    name: string
    quantity: number
    unit: string
  }>
  createdAt: string
}

export default function ReportsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // モック作業報告書データ
  const mockReports: WorkReport[] = [
    {
      id: 'wr-001',
      eventId: 'evt-001',
      eventTitle: 'エアコン新設工事',
      siteName: '渋谷オフィスビル',
      date: '2025-08-08',
      startTime: '09:00',
      endTime: '17:00',
      worker: '田中太郎',
      status: 'approved',
      workContent: 'オフィス3階にエアコン3台を新規設置。配管工事、電気工事、試運転まで完了。',
      photos: ['/photo1.jpg', '/photo2.jpg'],
      materials: [
        { name: 'エアコン室内機', quantity: 3, unit: '台' },
        { name: '冷媒配管 2分3分', quantity: 45, unit: 'm' },
        { name: 'ドレンホース', quantity: 30, unit: 'm' }
      ],
      createdAt: '2025-08-08T18:30:00'
    },
    {
      id: 'wr-002',
      eventId: 'evt-002',
      eventTitle: '定期メンテナンス',
      siteName: '品川商業施設',
      date: '2025-08-07',
      startTime: '10:00',
      endTime: '12:00',
      worker: '高橋次郎',
      status: 'submitted',
      workContent: 'エアコンフィルター清掃、冷媒ガス圧力チェック、ドレン配管清掃を実施。',
      issues: 'ドレン配管に軽度の詰まりあり。清掃により解消。',
      photos: ['/photo3.jpg'],
      materials: [
        { name: 'フィルター洗浄剤', quantity: 1, unit: '本' }
      ],
      createdAt: '2025-08-07T13:00:00'
    },
    {
      id: 'wr-003',
      eventId: 'evt-003',
      eventTitle: '緊急修理対応',
      siteName: '新宿マンション',
      date: '2025-08-06',
      startTime: '14:00',
      endTime: '16:30',
      worker: '佐藤健一',
      status: 'revision',
      workContent: '室外機の異音対応。コンプレッサー不具合のため部品交換。',
      issues: 'コンプレッサー経年劣化。交換推奨。',
      photos: [],
      materials: [
        { name: 'コンプレッサー', quantity: 1, unit: '個' },
        { name: '冷媒R32', quantity: 2, unit: 'kg' }
      ],
      createdAt: '2025-08-06T17:00:00'
    },
    {
      id: 'wr-004',
      eventId: 'evt-004',
      eventTitle: '配管工事',
      siteName: '渋谷オフィスビル',
      date: '2025-08-05',
      startTime: '08:00',
      endTime: '15:00',
      worker: '田中太郎',
      status: 'draft',
      workContent: '新規配管ルートの設置。',
      photos: [],
      materials: [],
      createdAt: '2025-08-05T16:00:00'
    }
  ]

  const getStatusBadge = (status: WorkReport['status']) => {
    const styles = {
      draft: { bg: '#f3f4f6', color: '#6b7280', label: '下書き' },
      submitted: { bg: '#dbeafe', color: '#2563eb', label: '提出済み' },
      approved: { bg: '#dcfce7', color: '#16a34a', label: '承認済み' },
      revision: { bg: '#fef3c7', color: '#d97706', label: '要修正' }
    }
    const style = styles[status]
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
    ? mockReports 
    : mockReports.filter(r => r.status === filterStatus)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* ヘッダー */}
<PageHeader />

      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <div style={{
        marginLeft: '240px',
        padding: '24px'
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
                      {selectedReport.materials.map((material, index) => (
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
  )
}