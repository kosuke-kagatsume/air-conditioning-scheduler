'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LogoHeader from '@/components/LogoHeader'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // モックログイン処理
    const success = await login(email, password)
    
    if (success) {
      router.push('/demo')
    } else {
      setError('メールアドレスまたはパスワードが正しくありません')
    }
    
    setLoading(false)
  }

  // デモアカウントで自動入力
  const fillDemoAccount = (type: 'admin' | 'worker') => {
    if (type === 'admin') {
      setEmail('admin@dandori.jp')
      setPassword('demo123')
    } else {
      setEmail('tanaka@worker.jp')
      setPassword('demo123')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        maxWidth: '440px',
        width: '100%',
        margin: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              margin: '0 auto 20px',
              cursor: 'pointer'
            }}>
              <LogoHeader href="/" size={64} />
            </div>
          </Link>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            Dandori Scheduler
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6c7684' 
          }}>
            工事現場スケジューラー
          </p>
        </div>

        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: '#2c3e50'
        }}>
          ログイン
        </h2>

        {error && (
          <div style={{
            padding: '12px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#c00',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              メールアドレス
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e4e8',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              パスワード
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e4e8',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? 'ログイン中...' : 'ログイン →'}
          </button>
        </form>

        <div style={{ 
          marginTop: '32px', 
          paddingTop: '24px', 
          borderTop: '1px solid #e1e4e8' 
        }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6c7684',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            デモ用アカウント（クリックで自動入力）
          </p>
          <div 
            onClick={() => fillDemoAccount('admin')}
            style={{
              background: '#f5f6f8',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e8f4ff'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f6f8'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <p style={{ 
              fontSize: '13px', 
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              👨‍💼 管理者として
            </p>
            <p style={{ fontSize: '13px', color: '#6c7684', marginBottom: '4px' }}>
              Email: admin@hvac.jp
            </p>
            <p style={{ fontSize: '13px', color: '#6c7684' }}>
              Pass: demo123
            </p>
          </div>
          <div 
            onClick={() => fillDemoAccount('worker')}
            style={{
              background: '#f5f6f8',
              padding: '16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e8f4ff'
              e.currentTarget.style.borderColor = '#667eea'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f6f8'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <p style={{ 
              fontSize: '13px', 
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '8px'
            }}>
              👷 職人として
            </p>
            <p style={{ fontSize: '13px', color: '#6c7684', marginBottom: '4px' }}>
              Email: tanaka@worker.jp
            </p>
            <p style={{ fontSize: '13px', color: '#6c7684' }}>
              Pass: demo123
            </p>
          </div>
        </div>

        <p style={{ 
          marginTop: '24px',
          fontSize: '14px', 
          color: '#6c7684',
          textAlign: 'center'
        }}>
          アカウントをお持ちでない方は
          <Link href="/register" style={{ 
            color: '#667eea', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            {' '}新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}