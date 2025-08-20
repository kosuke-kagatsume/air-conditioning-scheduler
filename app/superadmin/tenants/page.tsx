'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { 
  Building2, 
  Users, 
  CreditCard,
  Activity,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react'

interface Tenant {
  id: string
  name: string
  companyName: string
  plan: 'basic' | 'standard' | 'enterprise'
  status: 'active' | 'suspended' | 'trial'
  userCount: number
  maxUsers: number
  createdAt: string
  lastActivity: string
  monthlyRevenue: number
  storageUsed: number
  storageLimit: number
}

export default function SuperAdminTenantsPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [showTenantModal, setShowTenantModal] = useState(false)
  
  // スーパー管理者のチェック
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user.role !== 'superadmin') {
        router.push('/dashboard')
      }
    } else {
      router.push('/login/demo')
    }
    
    // デモデータの読み込み
    loadDemoTenants()
  }, [])
  
  const loadDemoTenants = () => {
    setTenants([
      {
        id: '1',
        name: 'tenant-001',
        companyName: '株式会社サンプル空調',
        plan: 'standard',
        status: 'active',
        userCount: 25,
        maxUsers: 100,
        createdAt: '2024-01-15',
        lastActivity: '2025-01-20',
        monthlyRevenue: 50000,
        storageUsed: 2.5,
        storageLimit: 10
      },
      {
        id: '2',
        name: 'tenant-002',
        companyName: '東京エアコンサービス',
        plan: 'enterprise',
        status: 'active',
        userCount: 150,
        maxUsers: -1,
        createdAt: '2023-06-01',
        lastActivity: '2025-01-19',
        monthlyRevenue: 200000,
        storageUsed: 15.2,
        storageLimit: -1
      },
      {
        id: '3',
        name: 'tenant-003',
        companyName: '関西空調メンテナンス',
        plan: 'basic',
        status: 'trial',
        userCount: 5,
        maxUsers: 10,
        createdAt: '2025-01-10',
        lastActivity: '2025-01-18',
        monthlyRevenue: 0,
        storageUsed: 0.3,
        storageLimit: 1
      },
      {
        id: '4',
        name: 'tenant-004',
        companyName: '九州設備工業',
        plan: 'standard',
        status: 'suspended',
        userCount: 45,
        maxUsers: 100,
        createdAt: '2023-11-20',
        lastActivity: '2024-12-15',
        monthlyRevenue: 0,
        storageUsed: 5.8,
        storageLimit: 10
      },
      {
        id: '5',
        name: 'tenant-005',
        companyName: '北海道クーラーサービス',
        plan: 'standard',
        status: 'active',
        userCount: 32,
        maxUsers: 100,
        createdAt: '2024-03-01',
        lastActivity: '2025-01-20',
        monthlyRevenue: 50000,
        storageUsed: 3.2,
        storageLimit: 10
      }
    ])
  }
  
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return '#3b82f6'
      case 'standard': return '#10b981'
      case 'enterprise': return '#9333ea'
      default: return '#6b7280'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'trial': return '#f59e0b'
      case 'suspended': return '#ef4444'
      default: return '#6b7280'
    }
  }
  
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })
  
  const totalRevenue = tenants.reduce((sum, t) => sum + t.monthlyRevenue, 0)
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length
  const totalUsers = tenants.reduce((sum, t) => sum + t.userCount, 0)

  return (
    <AppLayout>
      <div style={{
        padding: '20px',
        maxWidth: '1600px',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Building2 style={{ color: '#9333ea' }} size={28} />
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  テナント管理
                </h1>
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                全テナントの管理とモニタリング
              </p>
            </div>
            <button
              onClick={() => setShowTenantModal(true)}
              style={{
                padding: '12px 24px',
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
              <Plus size={18} />
              新規テナント
            </button>
          </div>
        </div>

        {/* 統計カード */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>総テナント数</span>
              <Building2 size={20} style={{ color: '#9333ea' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
              {tenants.length}
            </p>
            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
              アクティブ: {activeTenantsCount}
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>月間収益</span>
              <DollarSign size={20} style={{ color: '#10b981' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
              ¥{totalRevenue.toLocaleString()}
            </p>
            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
              前月比: +12.5%
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>総ユーザー数</span>
              <Users size={20} style={{ color: '#3b82f6' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
              {totalUsers}
            </p>
            <p style={{ fontSize: '12px', color: '#3b82f6', marginTop: '8px' }}>
              平均: {Math.round(totalUsers / tenants.length)}人/テナント
            </p>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>システム稼働率</span>
              <Activity size={20} style={{ color: '#10b981' }} />
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
              99.9%
            </p>
            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
              過去30日間
            </p>
          </div>
        </div>

        {/* フィルターとテーブル */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* フィルター */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              position: 'relative'
            }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="テナント名または会社名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="all">全プラン</option>
              <option value="basic">ベーシック</option>
              <option value="standard">スタンダード</option>
              <option value="enterprise">エンタープライズ</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="all">全ステータス</option>
              <option value="active">アクティブ</option>
              <option value="trial">トライアル</option>
              <option value="suspended">停止中</option>
            </select>
          </div>

          {/* テナントテーブル */}
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    テナント
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    プラン
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    ステータス
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    ユーザー数
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    ストレージ
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    月額料金
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    最終アクティビティ
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map(tenant => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {tenant.companyName}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          {tenant.name}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getPlanColor(tenant.plan)}20`,
                        color: getPlanColor(tenant.plan)
                      }}>
                        {tenant.plan === 'basic' && 'ベーシック'}
                        {tenant.plan === 'standard' && 'スタンダード'}
                        {tenant.plan === 'enterprise' && 'エンタープライズ'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getStatusColor(tenant.status)}20`,
                        color: getStatusColor(tenant.status)
                      }}>
                        {tenant.status === 'active' && 'アクティブ'}
                        {tenant.status === 'trial' && 'トライアル'}
                        {tenant.status === 'suspended' && '停止中'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>
                          {tenant.userCount}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          / {tenant.maxUsers === -1 ? '無制限' : tenant.maxUsers}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>
                          {tenant.storageUsed} GB
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          / {tenant.storageLimit === -1 ? '無制限' : `${tenant.storageLimit} GB`}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: tenant.monthlyRevenue > 0 ? '#1f2937' : '#6b7280'
                      }}>
                        ¥{tenant.monthlyRevenue.toLocaleString()}
                      </p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>
                        {tenant.lastActivity}
                      </p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedTenant(tenant)}
                          style={{
                            padding: '6px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={16} style={{ color: '#6b7280' }} />
                        </button>
                        <button
                          style={{
                            padding: '6px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit size={16} style={{ color: '#6b7280' }} />
                        </button>
                        <button
                          style={{
                            padding: '6px',
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* テナント詳細モーダル */}
        {selectedTenant && (
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
              maxWidth: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                  テナント詳細
                </h2>
                <button
                  onClick={() => setSelectedTenant(null)}
                  style={{
                    padding: '8px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>会社名</p>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTenant.companyName}</p>
                </div>
                
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>テナントID</p>
                  <p style={{ fontSize: '14px', fontFamily: 'monospace' }}>{selectedTenant.name}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>プラン</p>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${getPlanColor(selectedTenant.plan)}20`,
                      color: getPlanColor(selectedTenant.plan)
                    }}>
                      {selectedTenant.plan === 'basic' && 'ベーシック'}
                      {selectedTenant.plan === 'standard' && 'スタンダード'}
                      {selectedTenant.plan === 'enterprise' && 'エンタープライズ'}
                    </span>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ステータス</p>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${getStatusColor(selectedTenant.status)}20`,
                      color: getStatusColor(selectedTenant.status)
                    }}>
                      {selectedTenant.status === 'active' && 'アクティブ'}
                      {selectedTenant.status === 'trial' && 'トライアル'}
                      {selectedTenant.status === 'suspended' && '停止中'}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ユーザー数</p>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>
                      {selectedTenant.userCount} / {selectedTenant.maxUsers === -1 ? '無制限' : selectedTenant.maxUsers}
                    </p>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>月額料金</p>
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>
                      ¥{selectedTenant.monthlyRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ストレージ使用量</p>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(selectedTenant.storageUsed / (selectedTenant.storageLimit === -1 ? 100 : selectedTenant.storageLimit)) * 100}%`,
                        background: '#10b981'
                      }} />
                    </div>
                  </div>
                  <p style={{ fontSize: '14px' }}>
                    {selectedTenant.storageUsed} GB / {selectedTenant.storageLimit === -1 ? '無制限' : `${selectedTenant.storageLimit} GB`}
                  </p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>作成日</p>
                    <p style={{ fontSize: '14px' }}>{selectedTenant.createdAt}</p>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>最終アクティビティ</p>
                    <p style={{ fontSize: '14px' }}>{selectedTenant.lastActivity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}