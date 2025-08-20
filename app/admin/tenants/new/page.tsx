'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, Mail, Phone, MapPin, Save, ArrowLeft, 
  Users, DollarSign, Palette, Settings, Upload,
  Plus, X, User, FileText, Download, AlertCircle
} from 'lucide-react'
import { tenantPlans } from '@/lib/mockTenants'

interface NewUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  password: string
}

export default function NewTenantPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // フォームデータ
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    plan: 'free' as keyof typeof tenantPlans,
    primaryColor: '#3b82f6',
    secondaryColor: '#60a5fa',
    logo: null as File | null
  })

  // 初期ユーザー
  const [users, setUsers] = useState<NewUser[]>([
    {
      id: '1',
      name: '',
      email: '',
      role: 'admin',
      password: ''
    }
  ])

  // CSVアップロード
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvUsers, setCsvUsers] = useState<NewUser[]>([])

  useEffect(() => {
    // ユーザー情報を確認
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'SUPERADMIN') {
        router.push('/demo')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login/demo')
      return
    }
    
    setLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // バリデーション
    if (!formData.companyName || !formData.email) {
      alert('必須項目を入力してください')
      setSaving(false)
      return
    }

    const finalUsers = csvUsers.length > 0 ? csvUsers : users.filter(u => u.name && u.email)
    if (finalUsers.length === 0) {
      alert('最低1人のユーザーを登録してください')
      setSaving(false)
      return
    }

    // TODO: 実際のAPI呼び出し
    console.log('Creating tenant:', {
      ...formData,
      users: finalUsers
    })
    
    setTimeout(() => {
      setSaving(false)
      alert('テナントが正常に作成されました！')
      router.push('/admin/dashboard')
    }, 2000)
  }

  const handleInputChange = (field: string, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addUser = () => {
    const newUser: NewUser = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'staff',
      password: ''
    }
    setUsers([...users, newUser])
  }

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const updateUser = (id: string, field: keyof NewUser, value: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, [field]: value } : u))
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const csv = event.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const parsedUsers: NewUser[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length >= 3) {
          parsedUsers.push({
            id: i.toString(),
            name: values[0] || '',
            email: values[1] || '',
            role: (values[2] === 'admin' || values[2] === 'manager') ? values[2] as 'admin' | 'manager' : 'staff',
            password: values[3] || 'temp123'
          })
        }
      }
      setCsvUsers(parsedUsers)
    }
    reader.readAsText(file)
  }

  const downloadCsvTemplate = () => {
    const csvContent = "名前,メールアドレス,役割,パスワード\n山田太郎,admin@example.com,admin,password123\n田中花子,manager@example.com,manager,password123\n佐藤一郎,staff@example.com,staff,password123"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'users_template.csv'
    link.click()
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>読み込み中...</div>
      </div>
    )
  }

  const selectedPlan = tenantPlans[formData.plan]
  const totalSteps = 4

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ヘッダー */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => router.push('/admin/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <ArrowLeft size={16} />
            管理画面に戻る
          </button>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0
          }}>
            新規テナント作成
          </h1>
        </div>
        
        {/* ステップインジケーター */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: i + 1 <= currentStep ? '#3b82f6' : '#d1d5db'
            }} />
          ))}
          <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
            {currentStep}/{totalSteps}
          </span>
        </div>
      </header>

      <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* ステップ1: 基本情報 */}
          {currentStep === 1 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 24px 0'
              }}>
                <Building2 size={24} color="#6b7280" />
                ステップ1: 基本情報
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    会社名 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                    placeholder="株式会社サンプル"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    メールアドレス <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="admin@company.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="03-1234-5678"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    住所
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="東京都新宿区西新宿1-1-1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.companyName || !formData.email}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: (!formData.companyName || !formData.email) ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: (!formData.companyName || !formData.email) ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* ステップ2: プラン選択 */}
          {currentStep === 2 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 24px 0'
              }}>
                <DollarSign size={24} color="#6b7280" />
                ステップ2: プラン選択
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {Object.entries(tenantPlans).map(([key, plan]) => (
                  <div
                    key={key}
                    style={{
                      padding: '20px',
                      border: formData.plan === key ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: formData.plan === key ? '#f0f9ff' : 'white'
                    }}
                    onClick={() => handleInputChange('plan', key)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0
                      }}>
                        {plan.name}
                      </h4>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: '2px solid ' + (formData.plan === key ? '#3b82f6' : '#d1d5db'),
                        backgroundColor: formData.plan === key ? '#3b82f6' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formData.plan === key && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'white'
                          }} />
                        )}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      ¥{plan.price.toLocaleString()}
                      <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#6b7280' }}>/月</span>
                    </div>
                    
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                      ユーザー数: {plan.userLimit === -1 ? '無制限' : `${plan.userLimit}人`}
                    </div>
                    
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {plan.features.map((feature, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px'
                        }}>
                          <div style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981'
                          }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* ステップ3: ユーザー登録 */}
          {currentStep === 3 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 24px 0'
              }}>
                <Users size={24} color="#6b7280" />
                ステップ3: ユーザー登録
              </h3>

              {/* CSVアップロード */}
              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 12px 0'
                }}>
                  CSV一括登録
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={downloadCsvTemplate}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} />
                    テンプレートダウンロード
                  </button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    style={{ display: 'none' }}
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Upload size={16} />
                    CSVファイル選択
                  </label>
                </div>
                {csvFile && (
                  <div style={{
                    fontSize: '14px',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <FileText size={16} />
                    {csvFile.name} ({csvUsers.length}人)
                  </div>
                )}
                {csvUsers.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#166534'
                  }}>
                    {csvUsers.length}人のユーザーがCSVから読み込まれました。
                  </div>
                )}
              </div>

              {/* 手動入力 */}
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  手動入力
                </h4>
                
                {csvUsers.length === 0 && users.map((user, index) => (
                  <div key={user.id} style={{
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <h5 style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#111827',
                        margin: 0
                      }}>
                        ユーザー {index + 1} {index === 0 && <span style={{ color: '#ef4444' }}>*</span>}
                      </h5>
                      {users.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUser(user.id)}
                          style={{
                            padding: '4px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 120px 1fr',
                      gap: '12px'
                    }}>
                      <input
                        type="text"
                        placeholder="名前"
                        value={user.name}
                        onChange={(e) => updateUser(user.id, 'name', e.target.value)}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <input
                        type="email"
                        placeholder="メールアドレス"
                        value={user.email}
                        onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <select
                        value={user.role}
                        onChange={(e) => updateUser(user.id, 'role', e.target.value)}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="admin">管理者</option>
                        <option value="manager">マネージャー</option>
                        <option value="staff">スタッフ</option>
                      </select>
                      <input
                        type="password"
                        placeholder="パスワード"
                        value={user.password}
                        onChange={(e) => updateUser(user.id, 'password', e.target.value)}
                        style={{
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}

                {csvUsers.length === 0 && (
                  <button
                    type="button"
                    onClick={addUser}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px dashed #9ca3af',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={16} />
                    ユーザーを追加
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* ステップ4: 確認・作成 */}
          {currentStep === 4 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '24px'
            }}>
              <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 24px 0'
              }}>
                <AlertCircle size={24} color="#6b7280" />
                ステップ4: 確認・作成
              </h3>

              {/* 確認内容 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                    基本情報
                  </h4>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                    <div><strong>会社名:</strong> {formData.companyName}</div>
                    <div><strong>メール:</strong> {formData.email}</div>
                    {formData.phone && <div><strong>電話:</strong> {formData.phone}</div>}
                    {formData.address && <div><strong>住所:</strong> {formData.address}</div>}
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                    プラン
                  </h4>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <strong>{selectedPlan.name}</strong> - ¥{selectedPlan.price.toLocaleString()}/月
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  backgroundColor: '#fef7ff',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>
                    ユーザー ({csvUsers.length > 0 ? csvUsers.length : users.filter(u => u.name && u.email).length}人)
                  </h4>
                  <div style={{ fontSize: '14px', color: '#374151', maxHeight: '200px', overflowY: 'auto' }}>
                    {(csvUsers.length > 0 ? csvUsers : users.filter(u => u.name && u.email)).map((user, index) => (
                      <div key={index} style={{ marginBottom: '6px' }}>
                        {user.name} ({user.email}) - {user.role === 'admin' ? '管理者' : user.role === 'manager' ? 'マネージャー' : 'スタッフ'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: saving ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Save size={16} />
                  {saving ? '作成中...' : 'テナント作成'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}