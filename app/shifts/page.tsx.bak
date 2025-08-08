'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { mockUsers } from '@/lib/mockData'

interface Shift {
  id: string
  workerId: string
  workerName: string
  date: string
  startTime: string
  endTime: string
  type: 'regular' | 'overtime' | 'holiday'
  status: 'scheduled' | 'confirmed' | 'completed' | 'absent'
  location?: string
  notes?: string
}

interface ShiftRequest {
  id: string
  workerId: string
  workerName: string
  date: string
  type: 'leave' | 'swap' | 'overtime'
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: Date
  swapWithId?: string
}

function ShiftsContent() {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedWorker, setSelectedWorker] = useState<string>('all')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests'>('schedule')

  // サンプルシフトデータ
  const [shifts] = useState<Shift[]>([
    {
      id: '1',
      workerId: 'worker1',
      workerName: '田中太郎',
      date: '2025-08-07',
      startTime: '08:00',
      endTime: '17:00',
      type: 'regular',
      status: 'confirmed',
      location: '渋谷現場'
    },
    {
      id: '2',
      workerId: 'worker2',
      workerName: '鈴木一郎',
      date: '2025-08-07',
      startTime: '09:00',
      endTime: '18:00',
      type: 'regular',
      status: 'scheduled',
      location: '新宿現場'
    },
    {
      id: '3',
      workerId: 'worker3',
      workerName: '佐藤三郎',
      date: '2025-08-08',
      startTime: '08:00',
      endTime: '20:00',
      type: 'overtime',
      status: 'scheduled',
      location: '品川現場'
    }
  ])

  // シフト申請データ
  const [shiftRequests, setShiftRequests] = useState<ShiftRequest[]>([
    {
      id: '1',
      workerId: 'worker1',
      workerName: '田中太郎',
      date: '2025-08-15',
      type: 'leave',
      reason: '体調不良のため',
      status: 'pending',
      requestedAt: new Date()
    }
  ])

  const workers = mockUsers.filter(u => ['master', 'worker'].includes(u.role))

  // 週の開始日と終了日を取得
  const getWeekRange = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
  }

  const { start: weekStart, end: weekEnd } = getWeekRange(currentDate)

  // 週の日付配列を生成
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getDayOfWeek = (date: Date) => {
    const days = ['日', '月', '火', '水', '木', '金', '土']
    return days[date.getDay()]
  }

  const getShiftsForDate = (workerId: string, date: string) => {
    return shifts.filter(s => s.workerId === workerId && s.date === date)
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // フォーム処理
    setShowRequestModal(false)
    alert('シフト申請を送信しました')
  }

  const handleApproveRequest = (requestId: string, approved: boolean) => {
    setShiftRequests(shiftRequests.map(req =>
      req.id === requestId
        ? { ...req, status: approved ? 'approved' : 'rejected' }
        : req
    ))
    alert(approved ? '申請を承認しました' : '申請を却下しました')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#22c55e'
      case 'scheduled': return '#3b82f6'
      case 'completed': return '#6b7280'
      case 'absent': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '確定'
      case 'scheduled': return '予定'
      case 'completed': return '完了'
      case 'absent': return '欠勤'
      default: return status
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
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

            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/demo" style={{ color: '#6b7280', textDecoration: 'none' }}>
                カレンダー
              </Link>
              <Link href="/schedule-change" style={{ color: '#6b7280', textDecoration: 'none' }}>
                予定変更申請
              </Link>
              <Link href="/shifts" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '600' }}>
                シフト管理
              </Link>
              <Link href="/inventory" style={{ color: '#6b7280', textDecoration: 'none' }}>
                在庫管理
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
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
            シフト管理
          </h2>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowRequestModal(true)}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              シフト申請
            </button>
            <button style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              シフト作成
            </button>
          </div>
        </div>

        {/* タブ */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('schedule')}
            style={{
              padding: '10px 24px',
              background: activeTab === 'schedule' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'schedule' ? '2px solid #3b82f6' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: activeTab === 'schedule' ? '600' : '400',
              color: activeTab === 'schedule' ? '#1f2937' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            シフト表
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '10px 24px',
              background: activeTab === 'requests' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'requests' ? '2px solid #3b82f6' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: activeTab === 'requests' ? '600' : '400',
              color: activeTab === 'requests' ? '#1f2937' : '#6b7280',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            申請管理
            {shiftRequests.filter(r => r.status === 'pending').length > 0 && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '20px',
                height: '20px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '10px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {shiftRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'schedule' ? (
          /* シフト表 */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px'
          }}>
            {/* コントロール */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => handleNavigate('prev')}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  ←
                </button>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>
                  {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                  {viewMode === 'week' && ` 第${Math.ceil(currentDate.getDate() / 7)}週`}
                </span>
                <button
                  onClick={() => handleNavigate('next')}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  →
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('week')}
                  style={{
                    padding: '6px 16px',
                    background: viewMode === 'week' ? '#3b82f6' : 'white',
                    color: viewMode === 'week' ? 'white' : '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  週表示
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  style={{
                    padding: '6px 16px',
                    background: viewMode === 'month' ? '#3b82f6' : 'white',
                    color: viewMode === 'month' ? 'white' : '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  月表示
                </button>
              </div>
            </div>

            {/* シフトテーブル */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      borderBottom: '2px solid #e5e7eb',
                      minWidth: '120px',
                      position: 'sticky',
                      left: 0,
                      background: '#f9fafb'
                    }}>
                      職人名
                    </th>
                    {weekDays.map(day => (
                      <th key={day.toISOString()} style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb',
                        minWidth: '140px'
                      }}>
                        <div>{day.getMonth() + 1}/{day.getDate()}</div>
                        <div style={{
                          fontSize: '11px',
                          color: day.getDay() === 0 ? '#ef4444' : day.getDay() === 6 ? '#3b82f6' : '#6b7280'
                        }}>
                          {getDayOfWeek(day)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => (
                    <tr key={worker.id}>
                      <td style={{
                        padding: '12px',
                        borderBottom: '1px solid #e5e7eb',
                        fontWeight: '500',
                        fontSize: '14px',
                        position: 'sticky',
                        left: 0,
                        background: 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            background: '#3b82f6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            {worker.name[0]}
                          </div>
                          <div>
                            <div>{worker.name}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                              {worker.role === 'master' ? '親方' : '職人'}
                            </div>
                          </div>
                        </div>
                      </td>
                      {weekDays.map(day => {
                        const dateStr = formatDate(day)
                        const dayShifts = getShiftsForDate(worker.id, dateStr)
                        
                        return (
                          <td key={day.toISOString()} style={{
                            padding: '8px',
                            borderBottom: '1px solid #e5e7eb',
                            background: day.getDay() === 0 || day.getDay() === 6 ? '#f9fafb' : 'white'
                          }}>
                            {dayShifts.map(shift => (
                              <div key={shift.id} style={{
                                padding: '6px 8px',
                                background: `${getStatusColor(shift.status)}15`,
                                borderLeft: `3px solid ${getStatusColor(shift.status)}`,
                                borderRadius: '4px',
                                marginBottom: '4px'
                              }}>
                                <div style={{ fontSize: '12px', fontWeight: '500' }}>
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                {shift.location && (
                                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                    {shift.location}
                                  </div>
                                )}
                                <div style={{
                                  fontSize: '10px',
                                  color: getStatusColor(shift.status),
                                  marginTop: '2px'
                                }}>
                                  {getStatusLabel(shift.status)}
                                </div>
                              </div>
                            ))}
                            {dayShifts.length === 0 && (
                              <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#d1d5db',
                                fontSize: '20px'
                              }}>
                                -
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 凡例 */}
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '24px',
              fontSize: '12px'
            }}>
              {[
                { status: 'scheduled', label: '予定' },
                { status: 'confirmed', label: '確定' },
                { status: 'completed', label: '完了' },
                { status: 'absent', label: '欠勤' }
              ].map(item => (
                <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: getStatusColor(item.status),
                    borderRadius: '2px'
                  }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 申請管理 */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shiftRequests.map(request => (
                <div key={request.id} style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
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
                          background: request.status === 'pending' ? '#fef3c7' :
                            request.status === 'approved' ? '#dcfce7' : '#fee2e2',
                          color: request.status === 'pending' ? '#a16207' :
                            request.status === 'approved' ? '#15803d' : '#dc2626'
                        }}>
                          {request.status === 'pending' ? '承認待ち' :
                            request.status === 'approved' ? '承認済み' : '却下'}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f3f4f6',
                          color: '#374151'
                        }}>
                          {request.type === 'leave' ? '休暇申請' :
                            request.type === 'swap' ? 'シフト交換' : '残業申請'}
                        </span>
                      </div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {request.workerName}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        対象日: {request.date}
                      </div>
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        background: 'white',
                        borderRadius: '4px'
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                          理由:
                        </div>
                        <div style={{ fontSize: '13px', color: '#374151' }}>
                          {request.reason}
                        </div>
                      </div>
                    </div>

                    {request.status === 'pending' && user?.role === 'admin' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
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
                  </div>
                </div>
              ))}

              {shiftRequests.length === 0 && (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  申請はありません
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* シフト申請モーダル */}
      {showRequestModal && (
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
          <form onSubmit={handleSubmitRequest} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              シフト申請
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                申請種別
              </label>
              <select style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}>
                <option value="leave">休暇申請</option>
                <option value="swap">シフト交換</option>
                <option value="overtime">残業申請</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                対象日
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
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                理由
              </label>
              <textarea
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                style={{
                  padding: '8px 20px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                申請する
              </button>
            </div>
          </form>
        </div>
      )}
        </main>
      </div>
    </div>
  )
}

export default function ShiftsPage() {
  return (
    <AuthProvider>
      <ShiftsContent />
    </AuthProvider>
  )
}