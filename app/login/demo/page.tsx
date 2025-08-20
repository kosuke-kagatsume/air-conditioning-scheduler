'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Users, Shield, CheckCircle } from 'lucide-react'

interface DemoAccount {
  id: string
  name: string
  role: 'superadmin' | 'admin' | 'worker'
  email: string
  password: string
  description: string
  features: string[]
  avatar: string
}

const demoAccounts: DemoAccount[] = [
  {
    id: '0',
    name: 'DW 管理者',
    role: 'superadmin',
    email: 'superadmin@dandori.com',
    password: 'dw_admin2025',
    description: 'DW社システム管理者',
    features: [
      'テナント管理',
      'プラン管理',
      'システム監視',
      '利用統計',
      '全権限'
    ],
    avatar: '🛡️'
  },
  {
    id: '1',
    name: '山田 太郎',
    role: 'admin',
    email: 'admin@demo.com',
    password: 'admin123',
    description: '管理者として全ての機能にアクセス可能',
    features: [
      'スケジュール管理',
      '職人管理',
      '現場管理', 
      '売上分析',
      '承認権限'
    ],
    avatar: '👨‍💼'
  },
  {
    id: '2',
    name: '鈴木 一郎',
    role: 'worker',
    email: 'worker1@demo.com',
    password: 'worker123',
    description: '職人',
    features: [
      '自分のスケジュール確認',
      '作業報告書作成',
      '予定変更申請',
      'チャット機能'
    ],
    avatar: '👷'
  }
]

export default function DemoLoginPage() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<DemoAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickLogin = async (account: DemoAccount) => {
    setSelectedAccount(account)
    setIsLoading(true)
    
    try {
      // デモログインAPIを呼び出し
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'demo-login',
          email: account.email
        })
      })

      const data = await response.json()

      if (data.success) {
        // 実際のユーザー情報をローカルストレージに保存
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)
        
        // Cookieを設定（ミドルウェアの認証用）
        document.cookie = 'demo=1; path=/; max-age=86400'; // 24時間有効
        
        // ダッシュボードへリダイレクト
        router.push('/demo')
      } else {
        console.error('Demo login failed:', data.message)
        alert('ログインに失敗しました: ' + data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('ログインエラーが発生しました')
    } finally {
      setIsLoading(false)
      setSelectedAccount(null)
    }
  }

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
        maxWidth: '1200px',
        width: '100%'
      }}>
        {/* ヘッダー */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🗓️ Dandori Scheduler
          </h1>
          <p style={{
            fontSize: '20px',
            opacity: 0.9
          }}>
            デモアカウントを選択してログイン
          </p>
        </div>

        {/* アカウント選択カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {demoAccounts.map((account) => (
            <div
              key={account.id}
              onClick={() => handleQuickLogin(account)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transform: selectedAccount?.id === account.id ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: selectedAccount?.id === account.id 
                  ? '0 4px 20px rgba(0,0,0,0.15)' 
                  : '0 10px 40px rgba(0,0,0,0.2)',
                border: selectedAccount?.id === account.id 
                  ? '3px solid #667eea' 
                  : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedAccount?.id !== account.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.25)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAccount?.id !== account.id) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)'
                }
              }}
            >
              {/* アカウントヘッダー */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginRight: '16px'
                }}>
                  {account.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1a202c',
                    marginBottom: '4px'
                  }}>
                    {account.name}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: account.role === 'superadmin' ? '#9333ea' : account.role === 'admin' ? '#f56565' : '#48bb78',
                    color: 'white'
                  }}>
                    {account.role === 'superadmin' ? 'スーパー管理者' : account.role === 'admin' ? '管理者' : '職人'}
                  </div>
                </div>
              </div>

              {/* 説明 */}
              <p style={{
                fontSize: '14px',
                color: '#718096',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                {account.description}
              </p>

              {/* 機能リスト */}
              <div style={{
                background: '#f7fafc',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  利用可能な機能：
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {account.features.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: 'white',
                        borderRadius: '12px',
                        color: '#4a5568',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* ログイン情報 */}
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#a0aec0'
                }}>
                  <div>Email: {account.email}</div>
                  <div>Pass: {account.password}</div>
                </div>
                
                {selectedAccount?.id === account.id && isLoading ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#667eea'
                  }}>
                    <div className="spinner" />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                      ログイン中...
                    </span>
                  </div>
                ) : (
                  <button style={{
                    padding: '8px 20px',
                    background: account.role === 'superadmin'
                      ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
                      : account.role === 'admin' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    クイックログイン →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          opacity: 0.8
        }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            ※ これはデモ環境です。実際のデータは保存されません。
          </p>
          <p style={{ fontSize: '12px' }}>
            通常のログインは
            <a 
              href="/login" 
              style={{ 
                color: 'white', 
                textDecoration: 'underline',
                marginLeft: '4px'
              }}
            >
              こちら
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}