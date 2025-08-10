'use client'

import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingBottom: '80px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#1f2937'
        }}>
          通知
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontWeight: '600' }}>新しい予定が追加されました</p>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>2時間前</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              8月12日 14:00からエアコン設置作業が予定されています
            </p>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            borderLeft: '4px solid #22c55e'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontWeight: '600' }}>作業が完了しました</p>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>5時間前</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              渋谷区のメンテナンス作業が正常に完了しました
            </p>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontWeight: '600' }}>予定変更のリクエスト</p>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>1日前</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              高橋次郎さんから予定変更のリクエストがあります
            </p>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/demo')}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          カレンダーに戻る
        </button>
      </div>
    </div>
  )
}