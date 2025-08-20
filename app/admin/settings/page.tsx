'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { 
  Users, 
  Upload, 
  Download, 
  Settings, 
  CreditCard, 
  Building2,
  UserPlus,
  FileText,
  Shield,
  AlertCircle,
  Check,
  X
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'worker'
  status: 'active' | 'inactive'
  createdAt: string
}

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  maxUsers: number
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState<User[]>([])
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkUsers, setBulkUsers] = useState('')
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  
  // ユーザーのロールをチェック
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        router.push('/dashboard')
      }
    } else {
      router.push('/login/demo')
    }
    
    // デモデータの読み込み
    loadDemoData()
  }, [])
  
  const loadDemoData = () => {
    // デモユーザーデータ
    setUsers([
      { id: '1', name: '山田 太郎', email: 'yamada@example.com', role: 'admin', status: 'active', createdAt: '2024-01-01' },
      { id: '2', name: '鈴木 一郎', email: 'suzuki@example.com', role: 'worker', status: 'active', createdAt: '2024-01-15' },
      { id: '3', name: '田中 花子', email: 'tanaka@example.com', role: 'worker', status: 'active', createdAt: '2024-02-01' },
      { id: '4', name: '佐藤 健', email: 'sato@example.com', role: 'worker', status: 'inactive', createdAt: '2024-02-15' },
    ])
    
    // 現在のプラン
    setCurrentPlan({
      id: 'standard',
      name: 'スタンダードプラン',
      price: 50000,
      features: ['ユーザー数無制限', 'データ保存1年', 'API連携', 'カスタマーサポート'],
      maxUsers: 100
    })
  }
  
  const handleBulkUpload = () => {
    setUploadStatus('uploading')
    
    // CSVパース処理（簡易版）
    const lines = bulkUsers.trim().split('\n')
    const newUsers: User[] = []
    
    lines.forEach((line, index) => {
      const [name, email, role] = line.split(',').map(s => s.trim())
      if (name && email) {
        newUsers.push({
          id: `bulk-${Date.now()}-${index}`,
          name,
          email,
          role: (role === 'admin' ? 'admin' : 'worker') as 'admin' | 'worker',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        })
      }
    })
    
    setTimeout(() => {
      setUsers([...users, ...newUsers])
      setUploadStatus('success')
      setBulkUsers('')
      setTimeout(() => {
        setShowBulkUpload(false)
        setUploadStatus('idle')
      }, 2000)
    }, 1500)
  }
  
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'ベーシックプラン',
      price: 10000,
      features: ['ユーザー数10名まで', 'データ保存3ヶ月', '基本機能のみ'],
      maxUsers: 10
    },
    {
      id: 'standard',
      name: 'スタンダードプラン',
      price: 50000,
      features: ['ユーザー数100名まで', 'データ保存1年', 'API連携', 'カスタマーサポート'],
      maxUsers: 100
    },
    {
      id: 'enterprise',
      name: 'エンタープライズプラン',
      price: 200000,
      features: ['ユーザー数無制限', 'データ保存無制限', 'API連携', '優先サポート', 'カスタマイズ可能'],
      maxUsers: -1
    }
  ]

  return (
    <AppLayout>
      <div style={{
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#f5f6f8',
        minHeight: 'calc(100vh - 56px)'
      }}>
        {/* ヘッダー */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield style={{ color: '#9333ea' }} />
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              管理者設定
            </h1>
          </div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            テナントの各種設定を管理できます
          </p>
        </div>

        {/* タブナビゲーション */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '4px'
        }}>
          {[
            { id: 'users', label: 'ユーザー管理', icon: Users },
            { id: 'plan', label: 'プラン管理', icon: CreditCard },
            { id: 'tenant', label: 'テナント設定', icon: Building2 },
            { id: 'system', label: 'システム設定', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#9333ea' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* ユーザー管理タブ */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                  ユーザー一覧
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowBulkUpload(true)}
                    style={{
                      padding: '10px 20px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={18} />
                    一括登録
                  </button>
                  <button
                    style={{
                      padding: '10px 20px',
                      background: '#9333ea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <UserPlus size={18} />
                    新規ユーザー
                  </button>
                </div>
              </div>

              {/* 一括登録モーダル */}
              {showBulkUpload && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    width: '600px',
                    maxWidth: '90%'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                      ユーザー一括登録
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
                      CSV形式で入力してください（名前,メールアドレス,役割）
                    </p>
                    <textarea
                      value={bulkUsers}
                      onChange={(e) => setBulkUsers(e.target.value)}
                      placeholder="山田太郎,yamada@example.com,worker
鈴木花子,suzuki@example.com,admin
田中一郎,tanaka@example.com,worker"
                      style={{
                        width: '100%',
                        height: '200px',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                      <button
                        onClick={() => {
                          setShowBulkUpload(false)
                          setBulkUsers('')
                          setUploadStatus('idle')
                        }}
                        style={{
                          padding: '10px 24px',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleBulkUpload}
                        disabled={!bulkUsers.trim() || uploadStatus === 'uploading'}
                        style={{
                          padding: '10px 24px',
                          background: uploadStatus === 'success' ? '#10b981' : '#9333ea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '14px',
                          cursor: bulkUsers.trim() && uploadStatus !== 'uploading' ? 'pointer' : 'not-allowed',
                          opacity: !bulkUsers.trim() || uploadStatus === 'uploading' ? 0.5 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {uploadStatus === 'uploading' && '登録中...'}
                        {uploadStatus === 'success' && (
                          <>
                            <Check size={18} />
                            登録完了
                          </>
                        )}
                        {uploadStatus === 'idle' && '登録する'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ユーザーテーブル */}
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        名前
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        メールアドレス
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        役割
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        ステータス
                      </th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        登録日
                      </th>
                      <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{user.name}</td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{user.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                            color: user.role === 'admin' ? '#dc2626' : '#2563eb'
                          }}>
                            {user.role === 'admin' ? '管理者' : '職人'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: user.status === 'active' ? '#d1fae5' : '#f3f4f6',
                            color: user.status === 'active' ? '#10b981' : '#6b7280'
                          }}>
                            {user.status === 'active' ? '有効' : '無効'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{user.createdAt}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button style={{
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            編集
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* プラン管理タブ */}
          {activeTab === 'plan' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
                プラン管理
              </h2>
              
              {/* 現在のプラン */}
              <div style={{
                background: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <Check style={{ color: '#10b981' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    現在のプラン: {currentPlan?.name}
                  </h3>
                </div>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
                  ¥{currentPlan?.price.toLocaleString()}/月
                </p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {currentPlan?.features.map((feature, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Check size={16} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '14px', color: '#4b5563' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 利用可能なプラン */}
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                プラン変更
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    style={{
                      border: plan.id === currentPlan?.id ? '2px solid #10b981' : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      position: 'relative'
                    }}
                  >
                    {plan.id === currentPlan?.id && (
                      <div style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '20px',
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        現在のプラン
                      </div>
                    )}
                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{plan.name}</h4>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#9333ea', marginBottom: '16px' }}>
                      ¥{plan.price.toLocaleString()}/月
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Check size={16} style={{ color: '#10b981' }} />
                          <span style={{ fontSize: '14px', color: '#4b5563' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.id !== currentPlan?.id && (
                      <button style={{
                        width: '100%',
                        padding: '10px',
                        background: '#9333ea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        このプランに変更
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* テナント設定タブ */}
          {activeTab === 'tenant' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
                テナント設定
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    会社名
                  </label>
                  <input
                    type="text"
                    defaultValue="株式会社サンプル空調"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      padding: '10px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    業種
                  </label>
                  <select style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option>空調設備工事</option>
                    <option>電気工事</option>
                    <option>建設業</option>
                    <option>その他</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    従業員数
                  </label>
                  <select style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option>1-10名</option>
                    <option>11-50名</option>
                    <option>51-100名</option>
                    <option>101名以上</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    タイムゾーン
                  </label>
                  <select style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    <option>Asia/Tokyo (JST)</option>
                    <option>Asia/Seoul</option>
                    <option>Asia/Shanghai</option>
                  </select>
                </div>

                <button style={{
                  width: 'fit-content',
                  padding: '10px 24px',
                  background: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  設定を保存
                </button>
              </div>
            </div>
          )}

          {/* システム設定タブ */}
          {activeTab === 'system' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
                システム設定
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                    データエクスポート
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                    全てのデータをCSV形式でダウンロードできます
                  </p>
                  <button style={{
                    padding: '10px 20px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Download size={18} />
                    データをエクスポート
                  </button>
                </div>

                <div style={{
                  padding: '20px',
                  background: '#fef2f2',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#dc2626' }}>
                    危険な操作
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      アカウント削除
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                      このテナントと全てのデータが削除されます。この操作は取り消せません。
                    </p>
                    <button style={{
                      padding: '10px 20px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      アカウントを削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}