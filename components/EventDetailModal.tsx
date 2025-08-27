'use client'

import React, { useState } from 'react'
import { Event } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface EventDetailModalProps {
  event: any
  onClose: () => void
  onStatusChange?: (eventId: string, status: string, message?: string) => void
}

export default function EventDetailModal({ event, onClose, onStatusChange }: EventDetailModalProps) {
  const { user, currentTenant, canEditAllEvents, isMaster, isWorker } = useAuth()
  const [activeTab, setActiveTab] = useState<'detail' | 'progress' | 'materials' | 'comments' | 'history'>('detail')
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [responseType, setResponseType] = useState<'accept' | 'pending' | 'reject'>('accept')
  const [responseMessage, setResponseMessage] = useState('')
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelMessage, setCancelMessage] = useState('')
  const [newComment, setNewComment] = useState('')

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      proposed: '提案中',
      accepted: '確定',
      pending: '保留',
      rejected: '拒否',
      cancelled: 'キャンセル',
      completed: '完了'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      proposed: '#ffd93d',
      accepted: '#51cf66',
      pending: '#ffd93d',
      rejected: '#ff6b6b',
      cancelled: '#6c7684',
      completed: '#9775fa'
    }
    return colors[status] || '#6c7684'
  }

  // 職人が予定に応答可能か
  const canRespond = (isWorker || isMaster) && 
    event.workerId === user?.id && 
    event.status === 'proposed'

  // キャンセル交渉可能か
  const canRequestCancel = event.status === 'accepted' && 
    (event.workerId === user?.id || event.createdBy === user?.id)

  // 完了報告可能か
  const canMarkComplete = (isWorker || isMaster) && 
    event.workerId === user?.id && 
    event.status === 'accepted'

  const handleResponse = () => {
    if (onStatusChange) {
      let newStatus = ''
      if (responseType === 'accept') newStatus = 'accepted'
      else if (responseType === 'pending') newStatus = 'pending'
      else newStatus = 'rejected'
      
      onStatusChange(event.id, newStatus, responseMessage)
    }
    setShowResponseForm(false)
    onClose()
  }

  const handleCancelRequest = () => {
    if (onStatusChange) {
      onStatusChange(event.id, 'cancel_requested', cancelMessage)
    }
    setShowCancelForm(false)
    onClose()
  }

  const handleMarkComplete = () => {
    if (onStatusChange) {
      onStatusChange(event.id, 'completed')
    }
    onClose()
  }

  // モックコメント
  const comments = [
    {
      id: '1',
      author: '田中（営業部）',
      role: '営業担当',
      content: 'お客様より、作業時間を午後からに変更してほしいとの要望がありました。調整可能でしょうか？',
      timestamp: new Date(2025, 0, 7, 14, 30)
    },
    {
      id: '2',
      author: event.workerName || '担当職人',
      role: '職人',
      content: '午後からの作業で問題ありません。13:00開始でお願いします。',
      timestamp: new Date(2025, 0, 7, 15, 45)
    }
  ]

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
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* ヘッダー */}
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
              background: getStatusColor(event.status),
              borderRadius: '4px'
            }} />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0, color: '#2c3e50' }}>
                {event.title}
              </h2>
              <p style={{ fontSize: '14px', color: '#6c7684', margin: '4px 0 0' }}>
                {event.constructionType || '工事'}
                {event.siteName ? ` - ${event.siteName}` : event.city ? ` - ${event.city}` : ''}
              </p>
              <p style={{ fontSize: '14px', color: '#6c7684', margin: '4px 0 0' }}>
                {event.isMultiDay && event.startDate && event.endDate 
                  ? `${new Date(event.startDate).toLocaleDateString('ja-JP')} 〜 ${new Date(event.endDate).toLocaleDateString('ja-JP')}`
                  : new Date(event.date || event.startDate).toLocaleDateString('ja-JP')
                } {event.startTime}
              </p>
            </div>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              background: `${getStatusColor(event.status)}20`,
              color: getStatusColor(event.status)
            }}>
              {getStatusLabel(event.status)}
            </span>
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

        {/* 交渉中の表示 */}
        {event.negotiation && event.negotiation.status === 'pending' && (
          <div style={{
            padding: '16px',
            background: '#fff9e6',
            border: '1px solid #ffd93d',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#e67e22', marginBottom: '8px' }}>
              ⚠️ 交渉中
            </h4>
            <p style={{ fontSize: '14px', color: '#7f8c8d' }}>{event.negotiation.message}</p>
            {event.negotiation.response && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #ffd93d' }}>
                <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <span style={{ fontWeight: '600' }}>回答:</span> {event.negotiation.response}
                </p>
              </div>
            )}
          </div>
        )}

        {/* トラブル情報 */}
        {event.trouble && (
          <div style={{
            padding: '16px',
            background: '#ffe6e6',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#e74c3c', marginBottom: '8px' }}>
              🚨 トラブル発生
            </h4>
            <div style={{ fontSize: '14px', color: '#7f8c8d', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p><span style={{ fontWeight: '600' }}>種類:</span> {event.trouble.type}</p>
              <p><span style={{ fontWeight: '600' }}>詳細:</span> {event.trouble.description}</p>
              <p><span style={{ fontWeight: '600' }}>ステータス:</span> {event.trouble.status === 'open' ? '対応中' : '解決済み'}</p>
            </div>
          </div>
        )}

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
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 基本情報タブ */}
        {activeTab === 'detail' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 日時情報 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>日付</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  {event.isMultiDay && event.startDate && event.endDate ? (
                    <>
                      {new Date(event.startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {' 〜 '}
                      {new Date(event.endDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '12px', 
                        padding: '2px 6px', 
                        backgroundColor: '#e0e7ff', 
                        color: '#3730a3',
                        borderRadius: '4px',
                        fontWeight: 'normal'
                      }}>
                        複数日
                      </span>
                    </>
                  ) : (
                    new Date(event.date || event.startDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
                  )}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>時間</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  {event.startTime} - {event.endTime || '未定'}
                </p>
              </div>
            </div>

            {/* 現場情報 */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2c3e50' }}>現場情報</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>住所</p>
                  <p style={{ fontSize: '16px' }}>{event.address || event.siteName || '未設定'}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>施主名</p>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>{event.clientName || '未設定'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>工務店名</p>
                    <p style={{ fontSize: '16px', fontWeight: '500' }}>{event.constructorName || '未設定'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 営業担当者 */}
            {event.salesPersons && event.salesPersons.length > 0 && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '8px' }}>営業担当者</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {event.salesPersons.map((sp: any, index: number) => (
                  <div key={index} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: sp.role === 'main' ? '#e6f4ff' : '#f5f6f8',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: sp.role === 'main' ? '#1890ff' : 
                                 sp.role === 'sub' ? '#52c41a' : '#faad14',
                      color: 'white'
                    }}>
                      {sp.role === 'main' ? '主' : sp.role === 'sub' ? '副' : 'サ'}
                    </span>
                    {sp.name}
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* 担当職人 */}
            <div>
              <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>担当職人</p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: '#f5f6f8',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>{event.workerName || '未割当'}</span>
              </div>
            </div>

            {/* カスタムフィールド */}
            {event.customFieldValues && Object.keys(event.customFieldValues).length > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2c3e50' }}>追加情報</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentTenant?.settings?.customFields?.map((field: any) => {
                    const value = event.customFieldValues?.[field.id]
                    if (!value) return null
                    
                    return (
                      <div key={field.id}>
                        <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>{field.name}</p>
                        <p style={{ fontSize: '16px' }}>
                          {field.type === 'url' ? (
                            <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 備考 */}
            {event.description && (
              <div>
                <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>備考</p>
                <p style={{ fontSize: '16px', whiteSpace: 'pre-wrap' }}>{event.description}</p>
              </div>
            )}

            {/* 職人の応答フォーム */}
            {canRespond && !showResponseForm && (
              <div style={{ borderTop: '1px solid #e1e4e8', paddingTop: '20px' }}>
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  予定に応答する
                </button>
              </div>
            )}

            {showResponseForm && (
              <div style={{ borderTop: '1px solid #e1e4e8', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>予定への応答</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setResponseType('accept')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: responseType === 'accept' ? '#51cf66' : '#e1e4e8',
                      background: responseType === 'accept' ? '#51cf66' : 'white',
                      color: responseType === 'accept' ? 'white' : '#6c7684',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    承諾
                  </button>
                  <button
                    onClick={() => setResponseType('pending')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: responseType === 'pending' ? '#ffd93d' : '#e1e4e8',
                      background: responseType === 'pending' ? '#ffd93d' : 'white',
                      color: responseType === 'pending' ? 'white' : '#6c7684',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    保留
                  </button>
                  <button
                    onClick={() => setResponseType('reject')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: responseType === 'reject' ? '#ff6b6b' : '#e1e4e8',
                      background: responseType === 'reject' ? '#ff6b6b' : 'white',
                      color: responseType === 'reject' ? 'white' : '#6c7684',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    拒否
                  </button>
                </div>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="メッセージ（任意）"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e4e8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}
                  rows={3}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleResponse}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    送信
                  </button>
                  <button
                    onClick={() => setShowResponseForm(false)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e1e4e8', paddingTop: '20px' }}>
              {canRequestCancel && !showCancelForm && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #ff6b6b',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#ff6b6b',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル交渉
                </button>
              )}
              {canMarkComplete && (
                <button
                  onClick={handleMarkComplete}
                  className="btn-primary"
                  style={{ flex: 1, background: '#9775fa' }}
                >
                  完了報告
                </button>
              )}
            </div>

            {/* キャンセル交渉フォーム */}
            {showCancelForm && (
              <div style={{ borderTop: '1px solid #e1e4e8', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>キャンセル交渉</h3>
                <textarea
                  value={cancelMessage}
                  onChange={(e) => setCancelMessage(e.target.value)}
                  placeholder="キャンセル理由を入力してください"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e4e8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}
                  rows={3}
                  required
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCancelRequest}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    交渉を送信
                  </button>
                  <button
                    onClick={() => setShowCancelForm(false)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    やめる
                  </button>
                </div>
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
              <p style={{ fontSize: '12px', color: '#6c7684', marginTop: '8px' }}>更新: 2025/01/07 10:30</p>
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
      </div>
    </div>
  )
}