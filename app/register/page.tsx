import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px',
        maxWidth: '600px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          新規登録
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c7684',
          marginBottom: '40px',
          lineHeight: '1.8'
        }}>
          新規登録機能は現在準備中です。<br />
          まずはデモ版をお試しください。
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/login/demo" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}>
            デモ版を試す
          </Link>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}>
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}