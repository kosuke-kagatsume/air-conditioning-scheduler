'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TimeTreeCalendar from '@/components/TimeTreeCalendar'
import MobileScheduleView from '@/components/MobileScheduleView'

export default function Demo() {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [userType, setUserType] = useState<'admin' | 'worker'>('admin')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['A社', 'B社', 'C社', 'D社', 'E社'])

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header className="nav-modern" style={{ background: 'white' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 className="hide-mobile" style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#2c3e50'
              }}>HVAC Scheduler</h1>
            </Link>
            
            <nav style={{ display: 'flex', gap: '2px' }}>
              <button 
                className={`nav-tab ${currentView === 'month' ? 'active' : ''}`}
                onClick={() => setCurrentView('month')}
              >
                月
              </button>
              <button 
                className={`nav-tab ${currentView === 'week' ? 'active' : ''}`}
                onClick={() => setCurrentView('week')}
              >
                週
              </button>
              <button 
                className={`nav-tab ${currentView === 'day' ? 'active' : ''}`}
                onClick={() => setCurrentView('day')}
              >
                日
              </button>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Demo Mode Switcher */}
            <div className="hide-mobile" style={{
              background: '#f5f6f8',
              borderRadius: '8px',
              padding: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                onClick={() => setUserType('admin')}
                style={{
                  padding: '6px 16px',
                  background: userType === 'admin' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: userType === 'admin' ? '#ff6b6b' : '#6c7684'
                }}
              >
                管理者
              </button>
              <button
                onClick={() => setUserType('worker')}
                style={{
                  padding: '6px 16px',
                  background: userType === 'worker' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: userType === 'worker' ? '#ff6b6b' : '#6c7684'
                }}
              >
                職人
              </button>
            </div>

            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6c7684'
            }}>
              🔔
            </button>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ff6b6b',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {userType === 'admin' ? 'A' : 'W'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside 
          className={sidebarExpanded ? 'expanded' : ''}
          style={{
            width: '240px',
            background: 'white',
            borderRight: '1px solid #e1e4e8',
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => isMobile && setSidebarExpanded(!sidebarExpanded)}
        >
          {/* Mobile drawer handle */}
          {isMobile && (
            <div style={{
              width: '40px',
              height: '4px',
              background: '#e1e4e8',
              borderRadius: '2px',
              margin: '0 auto 16px',
              cursor: 'pointer'
            }} />
          )}
          {userType === 'admin' ? (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6c7684', marginBottom: '16px' }}>
                メニュー
              </h3>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button className="nav-tab active" style={{ width: '100%', textAlign: 'left' }}>
                  📅 カレンダー
                </button>
                <button className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
                  👷 職人管理
                </button>
                <button className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
                  🏗️ 現場管理
                </button>
                <button className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
                  📊 レポート
                </button>
              </nav>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6c7684', marginBottom: '16px' }}>
                  協力業者
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { color: '#ff6b6b', name: 'A社' },
                    { color: '#74c0fc', name: 'B社' },
                    { color: '#51cf66', name: 'C社' },
                    { color: '#ffd93d', name: 'D社' },
                    { color: '#9775fa', name: 'E社' }
                  ].map((company, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedCompanies.includes(company.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCompanies([...selectedCompanies, company.name])
                          } else {
                            setSelectedCompanies(selectedCompanies.filter(c => c !== company.name))
                          }
                        }}
                      />
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: company.color
                      }} />
                      <span style={{ fontSize: '14px', color: '#2c3e50' }}>{company.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  本日の空き枠
                </h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#51cf66' }}>2</div>
                <p style={{ fontSize: '14px', color: '#6c7684' }}>/ 3枠</p>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6c7684', marginBottom: '16px' }}>
                今後の予定
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { time: '09:00', title: 'A社 空調設置', status: 'confirmed', color: '#ff6b6b' },
                  { time: '14:00', title: 'B社 メンテナンス', status: 'proposed', color: '#74c0fc' }
                ].map((event, i) => (
                  <div key={i} className="card" style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '4px',
                        height: '40px',
                        background: event.color,
                        borderRadius: '2px'
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '2px' }}>
                          {event.time}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                          {event.title}
                        </p>
                      </div>
                      <span className={`status-badge status-${event.status}`}>
                        {event.status === 'confirmed' ? '確定' : '提案中'}
                      </span>
                    </div>
                    {event.status === 'proposed' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className="btn-primary" style={{ flex: 1, padding: '6px', fontSize: '12px' }}>
                          承諾
                        </button>
                        <button className="btn-secondary" style={{ flex: 1, padding: '6px', fontSize: '12px' }}>
                          保留
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Calendar Area */}
        <main style={{ flex: 1, padding: isMobile ? '0' : '20px', paddingBottom: isMobile ? '80px' : '20px', overflowY: 'auto' }}>
          {isMobile ? (
            <MobileScheduleView 
              isWorkerView={userType === 'worker'}
              onEventClick={(event) => {
                console.log('Event clicked:', event)
                // Handle event click
              }}
            />
          ) : (
            <TimeTreeCalendar 
              view={currentView}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isWorkerView={userType === 'worker'}
              selectedCompanies={selectedCompanies}
            />
          )}
        </main>
      </div>

      {/* Floating Action Button */}
      {userType === 'admin' && (
        <button 
          className="fab"
          onClick={() => setShowEventModal(true)}
          title="新規予定"
          style={isMobile ? { bottom: '80px', right: '16px' } : {}}
        >
          +
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="mobile-bottom-nav">
          <button className="mobile-nav-item active">
            <span className="mobile-nav-icon">📅</span>
            <span>カレンダー</span>
          </button>
          {userType === 'admin' && (
            <>
              <button className="mobile-nav-item">
                <span className="mobile-nav-icon">👷</span>
                <span>職人</span>
              </button>
              <button className="mobile-nav-item">
                <span className="mobile-nav-icon">🏗️</span>
                <span>現場</span>
              </button>
            </>
          )}
          {userType === 'worker' && (
            <button className="mobile-nav-item">
              <span className="mobile-nav-icon">📋</span>
              <span>予定</span>
            </button>
          )}
          <button 
            className={`mobile-nav-item ${userType === 'admin' ? '' : 'admin'}`}
            onClick={() => setUserType(userType === 'admin' ? 'worker' : 'admin')}
          >
            <span className="mobile-nav-icon">👤</span>
            <span>{userType === 'admin' ? '管理者' : '職人'}</span>
          </button>
        </nav>
      )}

      {/* Event Modal */}
      {showEventModal && (
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
          <div className="card" style={{
            width: isMobile ? '95%' : '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>新規予定</h2>
              <button
                onClick={() => setShowEventModal(false)}
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

            <form>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  タイトル
                </label>
                <input
                  type="text"
                  placeholder="作業内容を入力"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e4e8',
                    borderRadius: '8px',
                    fontSize: '16px',
                    WebkitAppearance: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  現場
                </label>
                <select style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e4e8',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'white',
                  WebkitAppearance: 'none'
                }}>
                  <option>A社 オフィスビル（渋谷区）</option>
                  <option>B社 マンション（新宿区）</option>
                  <option>C社 商業施設（港区）</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    開始日時
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e4e8',
                      borderRadius: '8px',
                      fontSize: '16px',
                      WebkitAppearance: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    終了日時
                  </label>
                  <input
                    type="datetime-local"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e4e8',
                      borderRadius: '8px',
                      fontSize: '16px',
                      WebkitAppearance: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  協力業者
                </label>
                <select style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e4e8',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: 'white',
                  WebkitAppearance: 'none'
                }}>
                  <option>A社</option>
                  <option>B社</option>
                  <option>C社</option>
                  <option>D社</option>
                  <option>E社</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  担当職人
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: '山田太郎', available: 2 },
                    { name: '佐藤次郎', available: 1 },
                    { name: '鈴木三郎', available: 0 }
                  ].map((worker, i) => (
                    <label key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      border: '2px solid #e1e4e8',
                      borderRadius: '8px',
                      cursor: worker.available > 0 ? 'pointer' : 'not-allowed',
                      opacity: worker.available > 0 ? 1 : 0.5
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" disabled={worker.available === 0} />
                        <span>{worker.name}</span>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: worker.available > 0 ? '#51cf66' : '#ff6b6b'
                      }}>
                        空き {worker.available}枠
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowEventModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.preventDefault()
                    setShowEventModal(false)
                  }}
                >
                  作成して提案
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}