'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import CalendarView from '@/components/Calendar/CalendarView'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import DandoriLogo from '@/components/DandoriLogo'
import { NotificationIcon, MenuIcon, UserIcon } from '@/components/Icons'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'admin' | 'worker'>('admin')
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const [showWorkReportModal, setShowWorkReportModal] = useState(false)
  const [showScheduleChangeModal, setShowScheduleChangeModal] = useState(false)
  const [showContactAdminModal, setShowContactAdminModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
          padding: isMobile ? '8px 12px' : '12px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
              {isMobile && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <MenuIcon size={24} color="#6b7280" />
                </button>
              )}
              <DandoriLogo size={isMobile ? 28 : 36} />
              {!isMobile && (
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                  color: '#2c3e50'
                }}>Dandori Scheduler</h1>
              )}
            </div>

            {/* ヘッダー右側 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
              <div style={{
                display: 'flex',
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button 
                  onClick={() => setViewMode('admin')}
                  style={{
                    padding: isMobile ? '4px 12px' : '6px 16px',
                    background: viewMode === 'admin' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: isMobile ? '12px' : '14px',
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
                    padding: isMobile ? '4px 12px' : '6px 16px',
                    background: viewMode === 'worker' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: isMobile ? '12px' : '14px',
                    cursor: 'pointer',
                    color: viewMode === 'worker' ? '#1f2937' : '#6b7280',
                    fontWeight: viewMode === 'worker' ? '500' : '400',
                    boxShadow: viewMode === 'worker' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                  職人
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    padding: '6px 8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    position: 'relative'
                  }}
                >
                  <NotificationIcon size={20} color="#6b7280" />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#ff4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    width: '320px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    marginTop: '8px'
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      通知
                      <button 
                        onClick={() => setUnreadCount(0)}
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        すべて既読
                      </button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <div style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid #f9fafb',
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          marginTop: '6px',
                          flexShrink: 0
                        }}></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            新しい予定の提案
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                            1月9日(木) 9:00-17:00 エアコン交換工事の予定が提案されました
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            2時間前
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '12px 20px',
                        borderBottom: '1px solid #f9fafb',
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          marginTop: '6px',
                          flexShrink: 0
                        }}></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            保留中の予定があります
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                            田中親方から保留の回答があります。3日以内に対応が必要です。
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            5時間前
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '12px 20px',
                        display: 'flex',
                        gap: '12px',
                        opacity: 0.6
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#9ca3af',
                          marginTop: '6px',
                          flexShrink: 0
                        }}></div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                            明日の予定
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                            明日14:00から緊急修理対応があります
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            昨日
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '12px 20px',
                      textAlign: 'center',
                      borderTop: '1px solid #f3f4f6'
                    }}>
                      <Link 
                        href="/notifications" 
                        style={{
                          fontSize: '14px',
                          color: '#3b82f6',
                          textDecoration: 'none'
                        }}
                        onClick={() => setShowNotifications(false)}
                      >
                        すべての通知を見る
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <UserIcon size={20} color="#6b7280" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div>
          {/* サイドバー - 管理者用 */}
          {viewMode === 'admin' && <Sidebar />}

          {/* サイドバー - 職人用 */}
          {viewMode === 'worker' && (
          <aside style={{
            position: 'fixed',
            left: 0,
            top: '60px',
            width: '280px',
            height: 'calc(100vh - 60px)',
            background: 'white',
            borderRight: '1px solid #e1e4e8',
            padding: '20px',
            overflowY: 'auto'
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
                    setShowWorkReportModal(true)
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
                    setShowScheduleChangeModal(true)
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
                    setShowContactAdminModal(true)
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
          <main style={{ 
            marginLeft: viewMode === 'admin' ? '240px' : viewMode === 'worker' ? '300px' : '0',
            padding: '20px'
          }}>
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
                  selectedWorkers={['worker-1']} // 高橋次郎の予定のみ表示
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

        {/* 作業報告書作成モーダル */}
        {showWorkReportModal && (
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
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  作業報告書作成
                </h2>
                <button
                  onClick={() => setShowWorkReportModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    作業日
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    顧客名
                  </label>
                  <input
                    type="text"
                    placeholder="例: 株式会社ABC"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    現場住所
                  </label>
                  <input
                    type="text"
                    placeholder="例: 東京都渋谷区..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    作業内容
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="">選択してください</option>
                    <option value="installation">新規設置</option>
                    <option value="maintenance">定期メンテナンス</option>
                    <option value="repair">修理</option>
                    <option value="removal">撤去</option>
                    <option value="inspection">点検</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    作業詳細
                  </label>
                  <textarea
                    rows={4}
                    placeholder="実施した作業の詳細を入力してください"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    使用部材
                  </label>
                  <textarea
                    rows={3}
                    placeholder="使用した部材・部品を入力してください"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    作業時間
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="time"
                      defaultValue="09:00"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      defaultValue="17:00"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    作業状況
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="completed">完了</option>
                    <option value="in-progress">継続中</option>
                    <option value="pending">保留</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    写真添付
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f9fafb'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      クリックして写真を選択<br />
                      またはドラッグ&ドロップ
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowWorkReportModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('作業報告書を提出しました')
                      setShowWorkReportModal(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    提出する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 予定変更申請モーダル */}
        {showScheduleChangeModal && (
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
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  予定変更申請
                </h2>
                <button
                  onClick={() => setShowScheduleChangeModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    変更種別
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="reschedule">日程変更</option>
                    <option value="cancel">キャンセル</option>
                    <option value="delay">遅延</option>
                    <option value="early">早期化</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    対象予定
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="">選択してください</option>
                    <option value="1">2025/08/10 09:00-17:00 渋谷ビル エアコン設置</option>
                    <option value="2">2025/08/12 13:00-16:00 新宿マンション 定期点検</option>
                    <option value="3">2025/08/15 10:00-12:00 品川オフィス 修理対応</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    変更希望日時
                  </label>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="time"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <span>〜</span>
                    <input
                      type="time"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    変更理由
                  </label>
                  <textarea
                    rows={4}
                    placeholder="変更が必要な理由を入力してください"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    優先度
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="urgent">緊急</option>
                  </select>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowScheduleChangeModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('予定変更を申請しました')
                      setShowScheduleChangeModal(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    申請する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 管理者連絡モーダル */}
        {showContactAdminModal && (
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
              borderRadius: '12px',
              padding: '24px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  管理者への連絡
                </h2>
                <button
                  onClick={() => setShowContactAdminModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    宛先
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="all">全管理者</option>
                    <option value="manager">山田管理者</option>
                    <option value="supervisor">佐藤主任</option>
                    <option value="office">事務所</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    件名
                  </label>
                  <input
                    type="text"
                    placeholder="連絡の件名を入力"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    カテゴリー
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}>
                    <option value="">選択してください</option>
                    <option value="report">報告</option>
                    <option value="consultation">相談</option>
                    <option value="emergency">緊急</option>
                    <option value="request">依頼</option>
                    <option value="confirmation">確認</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    メッセージ
                  </label>
                  <textarea
                    rows={6}
                    placeholder="連絡内容を入力してください"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    添付ファイル
                  </label>
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f9fafb'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>📎</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      ファイルを選択
                    </div>
                    <input
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <input
                    type="checkbox"
                    id="urgent"
                    style={{
                      width: '16px',
                      height: '16px'
                    }}
                  />
                  <label htmlFor="urgent" style={{
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    緊急連絡として送信
                  </label>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowContactAdminModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      alert('管理者に連絡を送信しました')
                      setShowContactAdminModal(false)
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    送信する
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  )
}