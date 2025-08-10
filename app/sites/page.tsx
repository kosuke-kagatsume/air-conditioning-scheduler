'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import { mockEvents } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'
import PageHeader from '@/components/PageHeader'
import { NotificationIcon, UserIcon } from '@/components/Icons'

type FilterStatus = 'all' | 'proposed' | 'accepted' | 'pending' | 'rejected' | 'completed'
type SortField = 'date' | 'clientName' | 'city' | 'status'
type SortOrder = 'asc' | 'desc'

export default function SitesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterCity, setFilterCity] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedSites, setSelectedSites] = useState<string[]>([])

  // 都市のリストを取得
  const cities = useMemo(() => {
    const citySet = new Set(mockEvents.map(event => event.city))
    return Array.from(citySet).sort()
  }, [])

  // フィルタリングとソート
  const filteredAndSortedSites = useMemo(() => {
    let filtered = [...mockEvents]

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(site =>
        site.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.constructorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // ステータスフィルター
    if (filterStatus !== 'all') {
      filtered = filtered.filter(site => site.status === filterStatus)
    }

    // 都市フィルター
    if (filterCity !== 'all') {
      filtered = filtered.filter(site => site.city === filterCity)
    }

    // 日付フィルター
    if (filterDateFrom) {
      filtered = filtered.filter(site => site.date >= filterDateFrom)
    }
    if (filterDateTo) {
      filtered = filtered.filter(site => site.date <= filterDateTo)
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date':
          comparison = a.date.localeCompare(b.date)
          break
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName)
          break
        case 'city':
          comparison = a.city.localeCompare(b.city)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, filterStatus, filterCity, filterDateFrom, filterDateTo, sortField, sortOrder])

  const handleSelectAll = () => {
    if (selectedSites.length === filteredAndSortedSites.length) {
      setSelectedSites([])
    } else {
      setSelectedSites(filteredAndSortedSites.map(site => site.id))
    }
  }

  const handleSelectSite = (siteId: string) => {
    if (selectedSites.includes(siteId)) {
      setSelectedSites(selectedSites.filter(id => id !== siteId))
    } else {
      setSelectedSites([...selectedSites, siteId])
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#22c55e'
      case 'proposed': return '#3b82f6'
      case 'pending': return '#eab308'
      case 'rejected': return '#ef4444'
      case 'completed': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return '確定'
      case 'proposed': return '提案中'
      case 'pending': return '保留'
      case 'rejected': return '拒否'
      case 'completed': return '完了'
      default: return status
    }
  }

  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
        {/* Header */}
<PageHeader />

        <Sidebar />
        
        <div style={{
          marginLeft: '240px',
          padding: '20px',
          minHeight: 'calc(100vh - 60px)'
        }}>
          {/* Page Title and Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              現場管理一覧
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '10px 20px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📥 エクスポート
              </button>
              <button style={{
                padding: '10px 20px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                + 新規現場追加
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* 検索 */}
              <div style={{ gridColumn: 'span 2' }}>
                <input
                  type="text"
                  placeholder="顧客名、住所、施工業者で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* ステータスフィルター */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">全ステータス</option>
                <option value="proposed">提案中</option>
                <option value="accepted">確定</option>
                <option value="pending">保留</option>
                <option value="rejected">拒否</option>
                <option value="completed">完了</option>
              </select>

              {/* 都市フィルター */}
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">全地域</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* 日付範囲 */}
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="開始日"
              />
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="終了日"
              />
            </div>

            {/* フィルターリセット */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {filteredAndSortedSites.length}件の現場が見つかりました
              </div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterCity('all')
                  setFilterDateFrom('')
                  setFilterDateTo('')
                }}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              >
                フィルターをリセット
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedSites.length === filteredAndSortedSites.length && filteredAndSortedSites.length > 0}
                        onChange={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th 
                      onClick={() => toggleSort('date')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      日付 {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => toggleSort('clientName')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      顧客名 {sortField === 'clientName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      onClick={() => toggleSort('city')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      地域 {sortField === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      工事内容
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      施工業者
                    </th>
                    <th 
                      onClick={() => toggleSort('status')}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#6b7280',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      ステータス {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#6b7280'
                    }}>
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedSites.map((site, index) => (
                    <tr 
                      key={site.id}
                      style={{
                        borderTop: '1px solid #e5e7eb',
                        background: selectedSites.includes(site.id) ? '#f9fafb' : 'white'
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <input
                          type="checkbox"
                          checked={selectedSites.includes(site.id)}
                          onChange={() => handleSelectSite(site.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                        {new Date(site.date).toLocaleDateString('ja-JP')}
                        <br />
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                          {site.startTime} - {site.endTime || '未定'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                        <div style={{ fontWeight: '500' }}>{site.clientName}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>03-1234-5678</div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                        <div>{site.city}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{site.address}</div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                        {site.constructionType}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>
                        {site.constructorName}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: `${getStatusColor(site.status)}20`,
                          color: getStatusColor(site.status)
                        }}>
                          {getStatusLabel(site.status)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button style={{
                            padding: '6px 12px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            詳細
                          </button>
                          <button style={{
                            padding: '6px 12px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            編集
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredAndSortedSites.length === 0 && (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
                <div style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
                  現場が見つかりませんでした
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  フィルター条件を変更してみてください
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredAndSortedSites.length > 0 && (
              <div style={{
                padding: '16px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {selectedSites.length > 0 && `${selectedSites.length}件を選択中`}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    前へ
                  </button>
                  <button style={{
                    padding: '8px 12px',
                    background: '#ff6b6b',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    1
                  </button>
                  <button style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    2
                  </button>
                  <button style={{
                    padding: '8px 12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    次へ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}