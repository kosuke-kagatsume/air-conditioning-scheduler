import Link from 'next/link'

export default function FeaturesPage() {
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
          機能ページ
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c7684',
          marginBottom: '40px',
          lineHeight: '1.8'
        }}>
          このページは現在準備中です。<br />
          詳細な機能説明を近日公開予定です。
        </p>
        <Link href="/" style={{
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
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}