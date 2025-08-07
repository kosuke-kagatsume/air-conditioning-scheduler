'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import CalendarView from '@/components/Calendar/CalendarView'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)

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

              {/* Navigation Tabs */}
              <nav style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#ff6b6b',
                    border: 'none',
                    borderBottom: '2px solid #ff6b6b',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  月
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#6c7684',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  週
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#6c7684',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  日
                </button>
              </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/workers" style={{
                color: '#6c7684',
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                管理者
              </Link>
              <Link href="/workers" style={{
                color: '#6c7684',
                fontSize: '14px',
                textDecoration: 'none'
              }}>
                職人
              </Link>
              <button style={{
                padding: '6px 8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}>
                🔔
              </button>
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
                A
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
          {/* Sidebar */}
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
                <Link href="#" style={{
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
                <Link href="#" style={{
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
                  <span>📊</span> レポート
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

          {/* Main Content - Calendar */}
          <main style={{ flex: 1 }}>
            <CalendarView 
              selectedWorkers={[]}
              onEventClick={(event) => console.log('Event clicked:', event)}
            />
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