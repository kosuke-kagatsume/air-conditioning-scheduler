'use client'

import { useState, useEffect } from 'react'
import TimeTreeCalendar from '@/components/TimeTreeCalendar'
import Link from 'next/link'

export default function DemoPage() {
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white',
              boxShadow: '0 2px 8px rgba(255,107,107,0.3)'
            }}>
              📅
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: '#2c3e50'
            }}>HVAC Scheduler デモ</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" style={{
              padding: '8px 20px',
              background: 'white',
              color: '#6c7684',
              border: '1px solid #e1e4e8',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}>
              ログイン
            </Link>
            <Link href="/" style={{
              padding: '8px 20px',
              background: '#ff6b6b',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(255,107,107,0.3)',
              transition: 'all 0.2s'
            }}>
              ホームへ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Demo Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102,126,234,0.3)'
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              デモンストレーション
            </h2>
            <p style={{ 
              fontSize: '16px', 
              opacity: 0.95, 
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              実際の画面イメージをご確認いただけます。カレンダービューの切り替え、予定の詳細表示、新規作成などの機能をお試しください。
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentView('month')}
                style={{
                  padding: '10px 20px',
                  background: currentView === 'month' ? 'white' : 'rgba(255,255,255,0.2)',
                  color: currentView === 'month' ? '#667eea' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                月/週/日ビュー切替
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                予定の承認フロー
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                職人の枠数管理
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                カスタムフィールド
              </button>
            </div>
          </div>

          {/* Calendar Container */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <TimeTreeCalendar 
              view={currentView}
              selectedDate={selectedDate}
              onDateSelect={(date) => setSelectedDate(date)}
              selectedCompanies={[]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}