'use client'

import { useRouter } from 'next/navigation'

export default function SettingsPage() {
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
          設定
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              通知設定
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '14px' }}>新しい予定の通知</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '14px' }}>予定変更の通知</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" />
                <span style={{ fontSize: '14px' }}>作業完了の通知</span>
              </label>
            </div>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              表示設定
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: '14px' }}>週末を含める</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" />
                <span style={{ fontSize: '14px' }}>完了した予定を隠す</span>
              </label>
            </div>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
              アカウント
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '14px' }}>メールアドレス: user@example.com</p>
              <p style={{ fontSize: '14px' }}>役割: 管理者</p>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={() => router.push('/demo')}
            style={{
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
          <button
            style={{
              padding: '8px 16px',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}