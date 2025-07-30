'use client'

import { useState } from 'react'

interface Comment {
  id: string
  author: string
  role: string
  content: string
  timestamp: Date
}

interface EventDetailModalProps {
  event: {
    id: string
    title: string
    site: string
    location: string
    workType: string
    date: Date
    startTime: string
    endTime: string
    color: string
    company: string
    status: 'pending' | 'proposed' | 'accepted' | 'confirmed' | 'rejected'
    workers?: string[]
    dandoriUrl?: string
    contractor?: string
    salesRep?: string
  }
  onClose: () => void
  isMobile?: boolean
}

export default function EventDetailModal({ event, onClose, isMobile = false }: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'progress' | 'materials' | 'comments' | 'history'>('detail')
  const [newComment, setNewComment] = useState('')
  
  // Mock data
  const comments: Comment[] = [
    {
      id: '1',
      author: '田中（営業部）',
      role: '自社営業',
      content: 'お客様より、作業時間を午後からに変更してほしいとの要望がありました。調整可能でしょうか？',
      timestamp: new Date(2025, 6, 20, 14, 30)
    },
    {
      id: '2',
      author: '山田太郎',
      role: '協力業者',
      content: '午後からの作業で問題ありません。13:00開始でお願いします。',
      timestamp: new Date(2025, 6, 20, 15, 45)
    }
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '確定'
      case 'proposed': return '提案中'
      case 'accepted': return '承諾済'
      case 'rejected': return '拒否'
      default: return '保留'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#51cf66'
      case 'proposed': return '#ffd93d'
      case 'accepted': return '#74c0fc'
      case 'rejected': return '#ff6b6b'
      default: return '#6c7684'
    }
  }

  return (
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{
        width: isMobile ? '100%' : '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          borderBottom: '1px solid #e1e4e8',
          paddingBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '8px',
              height: '36px',
              background: event.color,
              borderRadius: '4px'
            }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#2c3e50' }}>
                {event.site}
              </h2>
              <p style={{ fontSize: '14px', color: '#6c7684', margin: '4px 0 0' }}>
                {event.workType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c7684'
            }}
          >
            ×
          </button>
        </div>

        {/* タブメニュー */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e1e4e8',
          marginBottom: '24px',
          gap: '4px'
        }}>
          {[
            { id: 'detail', label: '基本情報', icon: '📋' },
            { id: 'progress', label: '進捗', icon: '📊' },
            { id: 'materials', label: '機材・資材', icon: '🔧' },
            { id: 'comments', label: 'コメント', icon: '💬' },
            { id: 'history', label: '変更履歴', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab.id ? 'white' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #ff6b6b' : 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '400',
                color: activeTab === tab.id ? '#ff6b6b' : '#6c7684',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              <span className={isMobile ? 'hide-mobile' : ''}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 基本情報タブ */}
        {activeTab === 'detail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ステータス */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6c7684', minWidth: '80px' }}>ステータス</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                background: `${getStatusColor(event.status)}20`,
                color: getStatusColor(event.status)
              }}>
                {getStatusText(event.status)}
              </span>
            </div>

            {/* 日時 */}
            <div>
              <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>日時</p>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>
                {event.date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                {' '}
                {event.startTime} - {event.endTime}
              </p>
            </div>

            {/* 場所 */}
            <div>
              <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>場所</p>
              <p style={{ fontSize: '16px' }}>{event.location}</p>
            </div>

            {/* 協力業者 */}
            <div>
              <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>協力業者</p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#f5f6f8',
                borderRadius: '8px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: event.color
                }} />
                <span style={{ fontSize: '16px', fontWeight: '500' }}>{event.company}</span>
              </div>
            </div>

            {/* 担当職人 */}
            {event.workers && event.workers.length > 0 && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '8px' }}>担当職人</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {event.workers.map((worker, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '6px 16px',
                        background: 'white',
                        border: '2px solid #e1e4e8',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      {worker}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ダンドリワークURL */}
            {event.dandoriUrl && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>ダンドリワークURL</p>
                <a
                  href={event.dandoriUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '14px',
                    color: '#ff6b6b',
                    textDecoration: 'none',
                    wordBreak: 'break-all'
                  }}
                >
                  {event.dandoriUrl}
                </a>
              </div>
            )}

            {/* 工務店 */}
            {event.contractor && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>工務店</p>
                <p style={{ fontSize: '16px' }}>{event.contractor}</p>
              </div>
            )}

            {/* 自社営業 */}
            {event.salesRep && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>自社営業</p>
                <p style={{ fontSize: '16px' }}>{event.salesRep}</p>
              </div>
            )}

            {/* アクションボタン */}
            {event.status === 'proposed' && (
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e1e4e8'
              }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  承諾
                </button>
                <button className="btn-secondary" style={{ flex: 1 }}>
                  保留
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #ff6b6b',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#ff6b6b',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  拒否
                </button>
              </div>
            )}
          </div>
        )}

        {/* 進捗タブ */}
        {activeTab === 'progress' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              {['準備中', '作業中', '完了', '検査待ち', '承認済み'].map((step, index) => (
                <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index <= 1 ? '#ff6b6b' : '#e1e4e8',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontWeight: '600',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ fontSize: '12px', color: index <= 1 ? '#2c3e50' : '#6c7684' }}>
                    {step}
                  </p>
                  {index < 4 && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: `${(index * 25) + 12.5}%`,
                      width: '25%',
                      height: '2px',
                      background: index < 1 ? '#ff6b6b' : '#e1e4e8',
                      zIndex: 0
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div className="card" style={{ background: '#f5f6f8' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>現在の状況</h4>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>進捗率: 40%</p>
              <p style={{ fontSize: '14px', color: '#6c7684' }}>室外機設置完了。配管作業を開始しました。</p>
              <p style={{ fontSize: '12px', color: '#6c7684', marginTop: '8px' }}>更新: 2025/07/21 10:30</p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>作業写真</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    background: '#e1e4e8',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#6c7684'
                  }}>
                    📷
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 機材・資材タブ */}
        {activeTab === 'materials' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>必要機材</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: '室外機 RAS-X40M2', quantity: '1台', status: '準備済' },
                  { name: '室内機 RAS-X40M2', quantity: '1台', status: '準備済' },
                  { name: '冷媒配管 2分3分', quantity: '15m', status: '準備済' },
                  { name: '電源ケーブル VVF2.0-3C', quantity: '20m', status: '手配中' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#f5f6f8',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#6c7684' }}>{item.quantity}</p>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: item.status === '準備済' ? '#51cf66' : '#ffd93d',
                      color: 'white'
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>添付資料</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: '施工図面.pdf', size: '2.4MB', icon: '📄' },
                  { name: '機器仕様書.pdf', size: '1.8MB', icon: '📋' },
                  { name: '配管ルート図.dwg', size: '3.2MB', icon: '📐' }
                ].map((file, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #e1e4e8',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: '24px' }}>{file.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500' }}>{file.name}</p>
                      <p style={{ fontSize: '12px', color: '#6c7684' }}>{file.size}</p>
                    </div>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      ダウンロード
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* コメントタブ */}
        {activeTab === 'comments' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {comments.map(comment => (
                <div key={comment.id} className="card" style={{ background: '#f5f6f8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{comment.author}</p>
                      <p style={{ fontSize: '12px', color: '#6c7684' }}>{comment.role}</p>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6c7684' }}>
                      {comment.timestamp.toLocaleDateString('ja-JP')} {comment.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{comment.content}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="コメントを入力..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e1e4e8',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button className="btn-primary" style={{ padding: '12px 24px' }}>
                送信
              </button>
            </div>
          </div>
        )}

        {/* 変更履歴タブ */}
        {activeTab === 'history' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { date: '2025/07/21 15:30', user: '田中（営業部）', action: '開始時間を9:00から13:00に変更' },
                { date: '2025/07/20 18:00', user: '山田太郎', action: 'ステータスを「提案中」から「承諾済」に変更' },
                { date: '2025/07/19 14:00', user: 'システム', action: '新規作成' }
              ].map((log, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px',
                  borderLeft: '3px solid #e1e4e8'
                }}>
                  <div style={{ minWidth: '120px' }}>
                    <p style={{ fontSize: '12px', color: '#6c7684' }}>{log.date}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{log.user}</p>
                    <p style={{ fontSize: '14px', color: '#6c7684' }}>{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}