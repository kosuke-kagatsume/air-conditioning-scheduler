'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { mockEvents } from '@/lib/mockData'

interface ChangeRequest {
  id: string
  eventId: string
  originalEvent: typeof mockEvents[0]
  requestType: 'reschedule' | 'cancel' | 'modify'
  requestedBy: string
  requestedAt: Date
  status: 'pending' | 'approved' | 'rejected'
  newDate?: string
  newStartTime?: string
  newEndTime?: string
  reason: string
  approvedBy?: string
  approvedAt?: Date
  comments?: string
}

function ScheduleChangeContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'request' | 'list'>('request')
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [requestType, setRequestType] = useState<'reschedule' | 'cancel' | 'modify'>('reschedule')
  const [reason, setReason] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newStartTime, setNewStartTime] = useState('')
  const [newEndTime, setNewEndTime] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // サンプルの変更申請データ
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([
    {
      id: '1',
      eventId: mockEvents[0].id,
      originalEvent: mockEvents[0],
      requestType: 'reschedule',
      requestedBy: '田中太郎',
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'approved',
      newDate: '2025-08-10',
      newStartTime: '10:00',
      newEndTime: '13:00',
      reason: '施主様の都合により日程変更',
      approvedBy: '山田管理者',
      approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      comments: '承認しました。職人への連絡完了済み。'
    },
    {
      id: '2',
      eventId: mockEvents[1].id,
      originalEvent: mockEvents[1],
      requestType: 'cancel',
      requestedBy: '鈴木一郎',
      requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: 'pending',
      reason: '機材の調達が間に合わないため',
    }
  ])

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    
    const event = mockEvents.find(e => e.id === selectedEvent)
    if (!event) {
      alert('イベントを選択してください')
      return
    }

    const newRequest: ChangeRequest = {
      id: Date.now().toString(),
      eventId: selectedEvent,
      originalEvent: event,
      requestType,
      requestedBy: user?.name || 'Unknown',
      requestedAt: new Date(),
      status: 'pending',
      reason,
      ...(requestType === 'reschedule' && { newDate, newStartTime, newEndTime })
    }

    setChangeRequests([newRequest, ...changeRequests])
    alert('変更申請を送信しました')
    setActiveTab('list')
    
    // Reset form
    setSelectedEvent('')
    setRequestType('reschedule')
    setReason('')
    setNewDate('')
    setNewStartTime('')
    setNewEndTime('')
  }

  const handleApproveRequest = (requestId: string, approved: boolean) => {
    setChangeRequests(changeRequests.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status: approved ? 'approved' : 'rejected',
            approvedBy: user?.name,
            approvedAt: new Date()
          }
        : req
    ))
    alert(approved ? '申請を承認しました' : '申請を却下しました')
  }

  const filteredRequests = changeRequests.filter(req => 
    filterStatus === 'all' || req.status === filterStatus
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e'
      case 'pending': return '#eab308'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return '承認済み'
      case 'pending': return '承認待ち'
      case 'rejected': return '却下'
      default: return status
    }
  }

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'reschedule': return '日程変更'
      case 'cancel': return 'キャンセル'
      case 'modify': return '内容変更'
      default: return type
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '12px 20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/demo" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: 'white'
            }}>
              📅
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              color: '#2c3e50'
            }}>HVAC Scheduler</h1>
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        gap: '20px'
      }}>
        {/* サイドバー */}
        <aside style={{
          width: '240px',
          flexShrink: 0
        }}>
          {/* Menu Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '12px',
              color: '#6c7684',
              fontWeight: '500',
              marginBottom: '12px',
              paddingLeft: '12px'
            }}>
              メニュー
            </h3>
            <nav>
              <Link href="/demo" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>📅</span> カレンダー
              </Link>
              <Link href="/workers" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>👥</span> 職人管理
              </Link>
              <Link href="/sites" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>🏢</span> 現場管理
              </Link>
              <Link href="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>📊</span> ダッシュボード
              </Link>
              <Link href="/schedule-change" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: '#fff5f5',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#ff6b6b',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                <span>📝</span> 予定変更申請
              </Link>
              <Link href="/shifts" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>📋</span> シフト管理
              </Link>
              <Link href="/inventory" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>📦</span> 在庫管理
              </Link>
              <Link href="/reports" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>📄</span> 作業報告書
              </Link>
              <Link href="/settings" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                textDecoration: 'none',
                color: '#2c3e50',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                borderRadius: '8px',
                transition: 'background 0.2s'
              }}>
                <span>⚙️</span> 設定
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
        <div style={{ width: '100%' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            予定変更申請
          </h2>

          {/* タブ切り替え */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setActiveTab('request')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'request' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'request' ? '500' : '400',
                color: activeTab === 'request' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              新規申請
            </button>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'list' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'list' ? '500' : '400',
                color: activeTab === 'list' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              申請一覧
            </button>
          </div>
        </div>

        {activeTab === 'request' ? (
          /* 新規申請フォーム */
          <form onSubmit={handleSubmitRequest} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              変更申請内容
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                対象の予定 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white'
                }}
                required
              >
                <option value="">予定を選択してください</option>
                {mockEvents.filter(e => e.status === 'accepted').map(event => (
                  <option key={event.id} value={event.id}>
                    {event.date} {event.startTime} - {event.clientName} ({event.constructionType})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                申請種別 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { value: 'reschedule', label: '日程変更' },
                  { value: 'cancel', label: 'キャンセル' },
                  { value: 'modify', label: '内容変更' }
                ].map(type => (
                  <label key={type.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: `2px solid ${requestType === type.value ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    background: requestType === type.value ? '#eff6ff' : 'white',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      value={type.value}
                      checked={requestType === type.value}
                      onChange={(e) => setRequestType(e.target.value as any)}
                      style={{ marginRight: '4px' }}
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            {requestType === 'reschedule' && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
                  新しい日程
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                      日付 <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      required={requestType === 'reschedule'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                      開始時刻 <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      required={requestType === 'reschedule'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                      終了時刻 <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      required={requestType === 'reschedule'}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                変更理由 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="変更理由を詳しく記入してください"
                required
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                style={{
                  padding: '10px 24px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                申請を送信
              </button>
            </div>
          </form>
        ) : (
          /* 申請一覧 */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="all">全ての申請</option>
                <option value="pending">承認待ち</option>
                <option value="approved">承認済み</option>
                <option value="rejected">却下</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredRequests.map(request => (
                <div key={request.id} style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: `${getStatusColor(request.status)}20`,
                          color: getStatusColor(request.status)
                        }}>
                          {getStatusLabel(request.status)}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f3f4f6',
                          color: '#374151'
                        }}>
                          {getRequestTypeLabel(request.requestType)}
                        </span>
                      </div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {request.originalEvent.clientName} - {request.originalEvent.constructionType}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        元の日程: {request.originalEvent.date} {request.originalEvent.startTime}
                      </div>
                      {request.requestType === 'reschedule' && request.newDate && (
                        <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px' }}>
                          → 新しい日程: {request.newDate} {request.newStartTime}〜{request.newEndTime}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      申請者: {request.requestedBy}<br />
                      {new Date(request.requestedAt).toLocaleString('ja-JP')}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    background: 'white',
                    borderRadius: '6px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                      変更理由:
                    </div>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      {request.reason}
                    </div>
                  </div>

                  {request.status === 'pending' && user?.role === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleApproveRequest(request.id, false)}
                        style={{
                          padding: '6px 16px',
                          background: 'white',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        却下
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id, true)}
                        style={{
                          padding: '6px 16px',
                          background: '#22c55e',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        承認
                      </button>
                    </div>
                  )}

                  {request.status !== 'pending' && request.approvedBy && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #e5e7eb',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {request.status === 'approved' ? '承認' : '却下'}者: {request.approvedBy}
                      （{new Date(request.approvedAt!).toLocaleString('ja-JP')}）
                      {request.comments && (
                        <div style={{ marginTop: '4px' }}>
                          コメント: {request.comments}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        </main>
      </div>
    </div>
  )
}

export default function ScheduleChangePage() {
  return (
    <AuthProvider>
      <ScheduleChangeContent />
    </AuthProvider>
  )
}