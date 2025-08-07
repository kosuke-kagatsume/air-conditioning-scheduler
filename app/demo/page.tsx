'use client'

import { useState, useEffect } from 'react'
import TimeTreeCalendar from '@/components/TimeTreeCalendar'
import Link from 'next/link'
import { mockEvents } from '@/lib/mockData'

export default function DemoPage() {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

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
        padding: '16px 20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                margin: 0,
                color: '#2c3e50'
              }}>HVAC Scheduler デモ</h1>
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 20px' }}>
              ログイン
            </Link>
            <Link href="/" className="btn-primary" style={{ padding: '8px 20px' }}>
              ホームへ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Info Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px' }}>
              デモンストレーション
            </h2>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '16px' }}>
              実際の画面イメージをご確認いただけます。カレンダービューの切り替え、予定の詳細表示、新規作成などの機能をお試しください。
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                月/週/日ビュー切替
              </span>
              <span style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                予定の承認フロー
              </span>
              <span style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                職人の枠数管理
              </span>
              <span style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                カスタムフィールド
              </span>
            </div>
          </div>

          {/* Calendar View */}
          <TimeTreeCalendar 
            view="month"
            selectedDate={new Date()}
            onDateSelect={(date) => console.log('Date selected:', date)}
            selectedCompanies={[]}
          />

          {/* Features */}
          <div style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📅
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                  3種類のビュー
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: '#6c7684', lineHeight: '1.6' }}>
                月表示で全体を俯瞰、週表示で詳細確認、日表示で当日の予定を時間軸で管理。用途に応じて切り替え可能です。
              </p>
            </div>
            
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #4ecdc4, #44a3aa)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  ✅
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                  承認フロー
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: '#6c7684', lineHeight: '1.6' }}>
                提案→承諾/保留/拒否の3段階承認。職人の予定が埋まっている場合は交渉機能で調整可能です。
              </p>
            </div>
            
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea, #5a67d8)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🎯
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                  カスタマイズ
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: '#6c7684', lineHeight: '1.6' }}>
                各社の業務に合わせて、カスタムフィールドや工事種別、時間枠設定などを自由にカスタマイズ可能です。
              </p>
            </div>
          </div>

          {/* Try Features */}
          <div style={{
            marginTop: '40px',
            padding: '32px',
            background: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#2c3e50' }}>
              さらに機能を試す
            </h3>
            <p style={{ fontSize: '16px', color: '#6c7684', marginBottom: '24px' }}>
              ログインすることで、全ての機能をお試しいただけます
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'left', background: '#f5f6f8', padding: '16px', borderRadius: '8px', minWidth: '200px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>管理者として</p>
                <p style={{ fontSize: '13px', color: '#6c7684', marginBottom: '4px' }}>Email: admin@hvac.jp</p>
                <p style={{ fontSize: '13px', color: '#6c7684' }}>Pass: demo123</p>
              </div>
              <div style={{ textAlign: 'left', background: '#f5f6f8', padding: '16px', borderRadius: '8px', minWidth: '200px' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>職人として</p>
                <p style={{ fontSize: '13px', color: '#6c7684', marginBottom: '4px' }}>Email: tanaka@worker.jp</p>
                <p style={{ fontSize: '13px', color: '#6c7684' }}>Pass: demo123</p>
              </div>
            </div>
            <Link href="/login" className="btn-primary" style={{
              marginTop: '24px',
              padding: '12px 32px',
              display: 'inline-block'
            }}>
              ログインして全機能を試す
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}