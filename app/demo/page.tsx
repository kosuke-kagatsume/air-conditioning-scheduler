'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import CalendarView from '@/components/Calendar/CalendarView'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'admin' | 'worker'>('admin')
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthProvider>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              </div>
            </div>

            {/* ヘッダー右側 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                display: 'flex',
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button 
                  onClick={() => setViewMode('admin')}
                  style={{
                    padding: '6px 16px',
                    background: viewMode === 'admin' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: viewMode === 'admin' ? '#1f2937' : '#6b7280',
                    fontWeight: viewMode === 'admin' ? '500' : '400',
                    boxShadow: viewMode === 'admin' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                  管理者
                </button>
                <button 
                  onClick={() => setViewMode('worker')}
                  style={{
                    padding: '6px 16px',
                    background: viewMode === 'worker' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: viewMode === 'worker' ? '#1f2937' : '#6b7280',
                    fontWeight: viewMode === 'worker' ? '500' : '400',
                    boxShadow: viewMode === 'worker' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                  職人
                </button>
              </div>
              <Link href="/notifications" style={{
                padding: '6px 8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                🔔
              </Link>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ff6b6b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                {viewMode === 'admin' ? 'A' : '田'}
              </div>
            </div>
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
          {/* サイドバー - 管理者用 */}
          {viewMode === 'admin' && (
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
                  background: '#fff5f5',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#ff6b6b',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px'
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
                  textDecoration: 'none',
                  color: '#2c3e50',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
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

            {/* Companies Filter */}
            <div>
              <h3 style={{
                fontSize: '12px',
                color: '#6c7684',
                fontWeight: '500',
                marginBottom: '12px',
                paddingLeft: '12px'
              }}>
                協力業者
              </h3>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px'
              }}>
                {['A社', 'B社', 'C社', 'D社', 'E社'].map((company, index) => (
                  <label key={company} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: ['#ff6b6b', '#74c0fc', '#51cf66', '#ffd93d', '#9775fa'][index]
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: ['#ff6b6b', '#74c0fc', '#51cf66', '#ffd93d', '#9775fa'][index]
                      }} />
                      <span style={{ fontSize: '14px', color: '#2c3e50' }}>{company}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>
          )}

          {/* サイドバー - 職人用 */}
          {viewMode === 'worker' && (
          <aside style={{
            width: '280px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginRight: '20px'
          }}>
            {/* 職人プロフィール */}
            <div style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginRight: '12px'
                }}>
                  田
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937' }}>
                    田中太郎
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    職人ID: W-001
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                所属: 田中工務店
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                役割: エアコン設置工事
              </div>
            </div>

            {/* 今日の予定 */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                今日の予定
              </h3>
              <div style={{
                padding: '12px',
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                  09:00 - 12:00
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  📍 渋谷区 - エアコン新設
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  顧客: 山田様
                </div>
              </div>
              <div style={{
                padding: '12px',
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                  14:00 - 17:00
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  📍 新宿区 - メンテナンス
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  顧客: 鈴木様
                </div>
              </div>
            </div>

            {/* クイックアクション */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                クイックアクション
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => {
                    alert('作業報告書作成画面に遷移します（実装予定）')
                  }}
                  style={{
                    padding: '10px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  📝 作業報告書を作成
                </button>
                <button 
                  onClick={() => {
                    alert('予定変更申請画面に遷移します（実装予定）')
                  }}
                  style={{
                    padding: '10px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  📅 予定変更を申請
                </button>
                <button 
                  onClick={() => {
                    alert('管理者連絡画面に遷移します（実装予定）')
                  }}
                  style={{
                    padding: '10px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  💬 管理者に連絡
                </button>
              </div>
            </div>

            {/* 今月の実績 */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '12px'
              }}>
                今月の実績
              </h3>
              <div style={{
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>完了件数</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>18件</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>稼働時間</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>142時間</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>評価</span>
                  <span style={{ fontSize: '14px', color: '#f59e0b' }}>⭐⭐⭐⭐⭐</span>
                </div>
              </div>
            </div>
          </aside>
          )}

          {/* メインコンテンツ */}
          <main style={{ flex: 1 }}>
            {viewMode === 'admin' ? (
              // 管理者ビュー
              <CalendarView 
                selectedWorkers={selectedWorkers}
                onEventClick={(event) => console.log('Event clicked:', event)}
              />
            ) : (
              // 職人ビュー
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '20px'
                }}>
                  マイスケジュール
                </h2>
                <CalendarView 
                  selectedWorkers={['W-001']} // 自分の予定のみ表示
                  onEventClick={(event) => console.log('Event clicked:', event)}
                />
              </div>
            )}
          </main>
        </div>

        {/* Floating Action Button */}
        <button style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s'
        }}>
          +
        </button>
      </div>
    </AuthProvider>
  )
}