'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('worker')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // パスワードの検証
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      // Supabaseでユーザー登録
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0], // 名前が空の場合はメールアドレスの@前を使用
            role,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      if (data?.user?.identities?.length === 0) {
        setError('このメールアドレスは既に登録されています')
        return
      }

      // 登録成功
      alert('登録確認メールを送信しました。メールを確認してください。\n\n開発環境の場合、メール確認なしでログインできます。')
      router.push('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '48px 16px'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        maxWidth: '440px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            新規アカウント登録
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#6c7684' 
          }}>
            エアコンスケジューラーへようこそ
          </p>
        </div>
        
        <form onSubmit={handleRegister}>
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
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              名前
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田太郎"
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
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '500',
              color: '#2c3e50'
            }}>
              パスワード（6文字以上）
            </label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              役割
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e1e4e8',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="worker">作業者</option>
              <option value="manager1">管理者1</option>
              <option value="manager2">管理者2</option>
              <option value="admin">システム管理者</option>
            </select>
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
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              marginBottom: '20px'
            }}
          >
            {loading ? '登録中...' : '登録する'}
          </button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '14px'
          }}>
            <Link 
              href="/login" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none'
              }}
            >
              既にアカウントをお持ちの方はこちら
            </Link>
            <Link 
              href="/demo" 
              style={{ 
                color: '#6c7684', 
                textDecoration: 'none'
              }}
            >
              デモを試す
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}