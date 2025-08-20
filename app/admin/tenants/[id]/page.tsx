'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  Building2, Users, Mail, Phone, MapPin, Calendar, 
  Settings, Edit, LogIn, ArrowLeft, Crown, Zap,
  Activity, FileText, Clock, CheckCircle, AlertTriangle,
  TrendingUp, DollarSign, User
} from 'lucide-react'
import { mockTenants, mockTenantUsers, tenantPlans } from '@/lib/mockTenants'
import { Tenant, TenantUser } from '@/types/tenant'

export default function TenantDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(true)

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

    // テナント情報を取得
    const tenantId = params.id as string
    const foundTenant = mockTenants.find(t => t.id === tenantId)
    if (foundTenant) {
      setTenant(foundTenant)
      setTenantUsers(mockTenantUsers[tenantId] || [])
    }
    
    setLoading(false)
  }, [params.id, router])

  // テナントとしてログイン
  const loginAsTenant = (tenant: Tenant) => {
    localStorage.setItem('currentTenant', JSON.stringify(tenant))
    localStorage.setItem('isDWAdmin', 'true')
    router.push('/demo')
  }

  // ステータスのスタイル
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { backgroundColor: '#dcfce7', color: '#166534', text: 'アクティブ' }
      case 'trial': return { backgroundColor: '#dbeafe', color: '#1e40af', text: '試用期間' }
      case 'suspended': return { backgroundColor: '#fee2e2', color: '#dc2626', text: '停止中' }
      case 'cancelled': return { backgroundColor: '#f3f4f6', color: '#374151', text: '解約済み' }
      default: return { backgroundColor: '#f3f4f6', color: '#374151', text: '不明' }
    }
  }

  // プランのアイコン
  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise': return <Crown size={20} color="#7c3aed" />
      case 'pro': return <Zap size={20} color="#4338ca" />
      case 'basic': return <CheckCircle size={20} color="#1e40af" />
      case 'free': return <User size={20} color="#374151" />
      default: return <User size={20} color="#374151" />
    }
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

  if (!tenant) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>テナントが見つかりません</div>
      </div>
    )
  }

  const statusInfo = getStatusStyle(tenant.status)
  const planInfo = tenantPlans[tenant.plan as keyof typeof tenantPlans]

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
            {tenant.companyName}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.push(`/admin/tenants/${tenant.id}/edit`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            <Edit size={16} />
            編集
          </button>
          <button
            onClick={() => loginAsTenant(tenant)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <LogIn size={16} />
            ログイン
          </button>
        </div>
      </header>

      <div style={{ padding: '32px 24px' }}>
        {/* 基本情報セクション */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* 会社情報 */}
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
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 16px 0'
            }}>
              <Building2 size={20} color="#6b7280" />
              会社情報
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  会社名
                </span>
                <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>
                  {tenant.companyName}
                </span>
              </div>
              {tenant.address && (
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    住所
                  </span>
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    {tenant.address}
                  </span>
                </div>
              )}
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  メールアドレス
                </span>
                <span style={{ fontSize: '14px', color: '#111827' }}>
                  {tenant.email}
                </span>
              </div>
              {tenant.phone && (
                <div>
                  <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    電話番号
                  </span>
                  <span style={{ fontSize: '14px', color: '#111827' }}>
                    {tenant.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* プラン・ステータス情報 */}
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
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 16px 0'
            }}>
              <Settings size={20} color="#6b7280" />
              プラン・ステータス
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  プラン
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getPlanIcon(tenant.plan)}
                  <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>
                    {planInfo.name}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: '2px 8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px'
                  }}>
                    ¥{planInfo.price.toLocaleString()}/月
                  </span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  ステータス
                </span>
                <span style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '9999px',
                  backgroundColor: statusInfo.backgroundColor,
                  color: statusInfo.color
                }}>
                  {statusInfo.text}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  ユーザー数
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>
                    {tenant.userCount} / {tenant.userLimit === -1 ? '無制限' : tenant.userLimit}
                  </span>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: tenant.userLimit === -1 ? '30%' : `${Math.min(100, (tenant.userCount / tenant.userLimit) * 100)}%`,
                      height: '100%',
                      backgroundColor: tenant.userCount / (tenant.userLimit || 1) > 0.8 ? '#ef4444' : '#10b981',
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                  最終ログイン
                </span>
                <span style={{ fontSize: '14px', color: '#111827' }}>
                  {tenant.lastLoginAt ? new Date(tenant.lastLoginAt).toLocaleString('ja-JP') : 'なし'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 利用統計 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 16px 0'
          }}>
            <Activity size={20} color="#6b7280" />
            利用統計
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {tenant.userCount}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                登録ユーザー数
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                ¥{tenant.monthlyFee.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                月額料金
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {planInfo.storage}GB
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                ストレージ容量
              </div>
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: '#fefce8',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {Math.floor((new Date().getTime() - new Date(tenant.createdAt).getTime()) / (1000 * 60 * 60 * 24))}日
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                利用開始から
              </div>
            </div>
          </div>
        </div>

        {/* ユーザー一覧 */}
        {tenantUsers.length > 0 && (
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
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 16px 0'
            }}>
              <Users size={20} color="#6b7280" />
              ユーザー一覧
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6b7280', 
                      textTransform: 'uppercase'
                    }}>
                      ユーザー名
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6b7280', 
                      textTransform: 'uppercase'
                    }}>
                      役割
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6b7280', 
                      textTransform: 'uppercase'
                    }}>
                      最終ログイン
                    </th>
                    <th style={{ 
                      padding: '12px 16px', 
                      textAlign: 'left', 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6b7280', 
                      textTransform: 'uppercase'
                    }}>
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tenantUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '4px',
                          backgroundColor: user.role === 'admin' ? '#fef2f2' : '#f0fdf4',
                          color: user.role === 'admin' ? '#dc2626' : '#166534'
                        }}>
                          {user.role === 'admin' ? '管理者' : user.role === 'manager' ? 'マネージャー' : 'スタッフ'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ja-JP') : 'なし'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '4px',
                          backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                          color: user.isActive ? '#166534' : '#dc2626'
                        }}>
                          {user.isActive ? 'アクティブ' : '無効'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}