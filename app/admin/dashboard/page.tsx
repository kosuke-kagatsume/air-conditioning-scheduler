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

  // ステータスバッジの色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // プランバッジの色
  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-indigo-100 text-indigo-800'
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DW管理コンソール</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                ログイン中: {user.name}
              </span>
              <button
                onClick={() => {
                  localStorage.clear()
                  router.push('/login/demo')
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 統計サマリー */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">総テナント数</p>
                <p className="text-2xl font-bold text-gray-900">{mockTenantStats.totalTenants}</p>
              </div>
              <Building2 className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">アクティブ</p>
                <p className="text-2xl font-bold text-gray-900">{mockTenantStats.activeTenants}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">月間収益</p>
                <p className="text-2xl font-bold text-gray-900">¥{mockTenantStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">成長率</p>
                <p className="text-2xl font-bold text-gray-900">+{mockTenantStats.growthRate}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* フィルターとアクション */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-1 gap-4">
                {/* 検索 */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="会社名・メールで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* プランフィルター */}
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                新規テナント
              </button>
            </div>
          </div>

          {/* テナント一覧テーブル */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    会社名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プラン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最終ログイン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    月額料金
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.companyName}</div>
                        <div className="text-sm text-gray-500">{tenant.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanColor(tenant.plan)}`}>
                        {tenantPlans[tenant.plan as keyof typeof tenantPlans].name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tenant.userCount} / {tenant.userLimit === -1 ? '無制限' : tenant.userLimit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tenant.status)}`}>
                        {tenant.status === 'active' ? 'アクティブ' : 
                         tenant.status === 'trial' ? '試用期間' :
                         tenant.status === 'suspended' ? '停止中' : '解約済み'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tenant.lastLoginAt ? new Date(tenant.lastLoginAt).toLocaleDateString('ja-JP') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{tenant.monthlyFee.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === tenant.id ? null : tenant.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {showDropdown === tenant.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                router.push(`/admin/tenants/${tenant.id}`)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                              詳細表示
                            </button>
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                router.push(`/admin/tenants/${tenant.id}/edit`)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4" />
                              編集
                            </button>
                            <button
                              onClick={() => {
                                setShowDropdown(null)
                                loginAsTenant(tenant)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 border-t border-gray-200"
                            >
                              <LogIn className="w-4 h-4" />
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