'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, Users, DollarSign, TrendingUp, 
  Plus, Search, Filter, MoreVertical,
  CheckCircle, AlertCircle, Clock, XCircle,
  ChevronDown, LogIn, Edit, Eye
} from 'lucide-react'
import { mockTenants, mockTenantStats, tenantPlans } from '@/lib/mockTenants'
import { Tenant } from '@/types/tenant'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  useEffect(() => {
    // ユーザー情報を確認
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      // SUPERADMIN以外はアクセス拒否
      if (parsedUser.role !== 'SUPERADMIN') {
        router.push('/demo')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login/demo')
    }
  }, [router])

  // フィルタリング
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  // ステータスバッジのスタイル
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { backgroundColor: '#dcfce7', color: '#166534' }
      case 'trial': return { backgroundColor: '#dbeafe', color: '#1e40af' }
      case 'suspended': return { backgroundColor: '#fee2e2', color: '#dc2626' }
      case 'cancelled': return { backgroundColor: '#f3f4f6', color: '#374151' }
      default: return { backgroundColor: '#f3f4f6', color: '#374151' }
    }
  }

  // プランバッジのスタイル
  const getPlanStyle = (plan: string) => {
    switch (plan) {
      case 'enterprise': return { backgroundColor: '#f3e8ff', color: '#7c3aed' }
      case 'pro': return { backgroundColor: '#e0e7ff', color: '#4338ca' }
      case 'basic': return { backgroundColor: '#dbeafe', color: '#1e40af' }
      case 'free': return { backgroundColor: '#f3f4f6', color: '#374151' }
      default: return { backgroundColor: '#f3f4f6', color: '#374151' }
    }
  }

  // テナントとしてログイン
  const loginAsTenant = (tenant: Tenant) => {
    // テナント情報を保存
    localStorage.setItem('currentTenant', JSON.stringify(tenant))
    localStorage.setItem('isDWAdmin', 'true')
    // テナントのダッシュボードへ
    router.push('/demo')
  }

  if (!user || user.role !== 'SUPERADMIN') {
    return null
  }

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
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0
        }}>
          DW管理コンソール
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            ログイン中: {user.name}
          </span>
          <button
            onClick={() => {
              localStorage.clear()
              router.push('/login/demo')
            }}
            style={{
              fontSize: '14px',
              color: '#dc2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* 統計サマリー */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>総テナント数</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{mockTenantStats.totalTenants}</p>
              </div>
              <Building2 size={40} color="#3b82f6" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>アクティブ</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{mockTenantStats.activeTenants}</p>
              </div>
              <CheckCircle size={40} color="#10b981" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>月間収益</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>¥{mockTenantStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={40} color="#f59e0b" />
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>成長率</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>+{mockTenantStats.growthRate}%</p>
              </div>
              <TrendingUp size={40} color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* フィルターとアクション */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
                {/* 検索 */}
                <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    placeholder="会社名・メールで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                {/* プランフィルター */}
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">全プラン</option>
                  <option value="free">無料</option>
                  <option value="basic">ベーシック</option>
                  <option value="pro">プロ</option>
                  <option value="enterprise">エンタープライズ</option>
                </select>
                
                {/* ステータスフィルター */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">全ステータス</option>
                  <option value="active">アクティブ</option>
                  <option value="trial">試用期間</option>
                  <option value="suspended">停止中</option>
                  <option value="cancelled">解約済み</option>
                </select>
              </div>
              
              {/* 新規作成ボタン */}
              <button
                onClick={() => router.push('/admin/tenants/new')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <Plus size={20} />
                新規テナント
              </button>
            </div>
          </div>

          {/* テナント一覧テーブル */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    会社名
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    プラン
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ユーザー数
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    ステータス
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    最終ログイン
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    月額料金
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {filteredTenants.map((tenant) => (
                  <tr 
                    key={tenant.id} 
                    style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{tenant.companyName}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{tenant.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        ...getPlanStyle(tenant.plan)
                      }}>
                        {tenantPlans[tenant.plan as keyof typeof tenantPlans].name}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#111827' }}>
                      {tenant.userCount} / {tenant.userLimit === -1 ? '無制限' : tenant.userLimit}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        ...getStatusStyle(tenant.status)
                      }}>
                        {tenant.status === 'active' ? 'アクティブ' : 
                         tenant.status === 'trial' ? '試用期間' :
                         tenant.status === 'suspended' ? '停止中' : '解約済み'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
                      {tenant.lastLoginAt ? new Date(tenant.lastLoginAt).toLocaleDateString('ja-JP') : '-'}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: '14px', color: '#111827' }}>
                      ¥{tenant.monthlyFee.toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setShowDropdown(showDropdown === tenant.id ? null : tenant.id)}
                          style={{
                            color: '#9ca3af',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {showDropdown === tenant.id && (
                          <div style={{
                            position: 'absolute',
                            right: 0,
                            marginTop: '8px',
                            width: '192px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            zIndex: 10,
                            border: '1px solid #e5e7eb'
                          }}>
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                router.push(`/admin/tenants/${tenant.id}`)
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 16px',
                                fontSize: '14px',
                                color: '#374151',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye size={16} />
                              詳細表示
                            </button>
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                router.push(`/admin/tenants/${tenant.id}/edit`)
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 16px',
                                fontSize: '14px',
                                color: '#374151',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Edit size={16} />
                              編集
                            </button>
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                loginAsTenant(tenant)
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '8px 16px',
                                fontSize: '14px',
                                color: '#1d4ed8',
                                background: 'none',
                                border: 'none',
                                borderTop: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <LogIn size={16} />
                              このテナントとしてログイン
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}