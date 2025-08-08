'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

interface InventoryItem {
  id: string
  name: string
  category: 'equipment' | 'parts' | 'tools' | 'consumables'
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  location: string
  supplier: string
  lastRestocked: Date
  price: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'ordered'
}

interface StockMovement {
  id: string
  itemId: string
  itemName: string
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  date: Date
  reason: string
  performedBy: string
  projectId?: string
  notes?: string
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  items: { itemId: string; itemName: string; quantity: number; unitPrice: number }[]
  totalAmount: number
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
  orderDate: Date
  expectedDelivery?: Date
  notes?: string
}

function InventoryContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'items' | 'movements' | 'orders'>('items')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  // サンプル在庫データ
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'エアコン室内機 (6畳用)',
      category: 'equipment',
      sku: 'AC-IN-6',
      currentStock: 15,
      minStock: 5,
      maxStock: 30,
      unit: '台',
      location: '東京倉庫 A-1',
      supplier: 'ダイキン工業',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      price: 45000,
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'エアコン室外機 (6畳用)',
      category: 'equipment',
      sku: 'AC-OUT-6',
      currentStock: 12,
      minStock: 5,
      maxStock: 30,
      unit: '台',
      location: '東京倉庫 A-2',
      supplier: 'ダイキン工業',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      price: 35000,
      status: 'in-stock'
    },
    {
      id: '3',
      name: '冷媒配管 (2分3分)',
      category: 'parts',
      sku: 'PIPE-23',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unit: 'm',
      location: '東京倉庫 B-1',
      supplier: '配管サプライ',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      price: 800,
      status: 'in-stock'
    },
    {
      id: '4',
      name: 'ドレンホース',
      category: 'parts',
      sku: 'DRAIN-01',
      currentStock: 3,
      minStock: 10,
      maxStock: 50,
      unit: '巻',
      location: '東京倉庫 B-2',
      supplier: '配管サプライ',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      price: 1500,
      status: 'low-stock'
    },
    {
      id: '5',
      name: 'トルクレンチ',
      category: 'tools',
      sku: 'TOOL-TW-01',
      currentStock: 8,
      minStock: 3,
      maxStock: 15,
      unit: '本',
      location: '東京倉庫 C-1',
      supplier: 'ツールマート',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      price: 12000,
      status: 'in-stock'
    },
    {
      id: '6',
      name: '冷媒ガス R32',
      category: 'consumables',
      sku: 'GAS-R32',
      currentStock: 0,
      minStock: 5,
      maxStock: 20,
      unit: '本',
      location: '東京倉庫 D-1',
      supplier: 'ガスサプライヤー',
      lastRestocked: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      price: 8000,
      status: 'out-of-stock'
    }
  ])

  // 在庫移動履歴
  const [movements] = useState<StockMovement[]>([
    {
      id: '1',
      itemId: '1',
      itemName: 'エアコン室内機 (6畳用)',
      type: 'out',
      quantity: 2,
      date: new Date(),
      reason: '渋谷現場への出庫',
      performedBy: '田中太郎',
      projectId: 'PRJ-001'
    },
    {
      id: '2',
      itemId: '3',
      itemName: '冷媒配管 (2分3分)',
      type: 'in',
      quantity: 100,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      reason: '定期補充',
      performedBy: '山田管理者'
    }
  ])

  // 発注データ
  const [orders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2025-001',
      supplier: 'ダイキン工業',
      items: [
        { itemId: '1', itemName: 'エアコン室内機 (6畳用)', quantity: 10, unitPrice: 45000 },
        { itemId: '2', itemName: 'エアコン室外機 (6畳用)', quantity: 10, unitPrice: 35000 }
      ],
      totalAmount: 800000,
      status: 'confirmed',
      orderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      expectedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return '#22c55e'
      case 'low-stock': return '#eab308'
      case 'out-of-stock': return '#ef4444'
      case 'ordered': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock': return '在庫あり'
      case 'low-stock': return '在庫少'
      case 'out-of-stock': return '在庫切れ'
      case 'ordered': return '発注中'
      default: return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'equipment': return '機器'
      case 'parts': return '部品'
      case 'tools': return '工具'
      case 'consumables': return '消耗品'
      default: return category
    }
  }

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'in': return '入庫'
      case 'out': return '出庫'
      case 'transfer': return '移動'
      case 'adjustment': return '調整'
      default: return type
    }
  }

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleStockUpdate = (itemId: string, type: 'in' | 'out', quantity: number) => {
    // 在庫更新処理
    alert(`在庫を${type === 'in' ? '追加' : '出庫'}しました`)
    setShowStockModal(false)
    setSelectedItem(null)
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '12px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/demo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'white'
              }}>
                📅
              </div>
              <h1 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#2c3e50'
              }}>HVAC Scheduler</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div>
        {/* サイドバー */}
        <Sidebar />

        {/* Main Content */}
        <main style={{ marginLeft: '240px', padding: '20px', minHeight: 'calc(100vh - 60px)', marginTop: '60px' }}>
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
              在庫管理
            </h2>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                padding: '10px 20px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                📥 CSVエクスポート
              </button>
              <button
                onClick={() => setShowAddItemModal(true)}
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                + 商品追加
              </button>
            </div>
          </div>

          {/* サマリーカード */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {[
              { label: '総在庫数', value: '198', unit: '品目', color: '#3b82f6' },
              { label: '在庫切れ', value: '1', unit: '品目', color: '#ef4444' },
              { label: '要発注', value: '2', unit: '品目', color: '#eab308' },
              { label: '総在庫額', value: '¥2,450,000', unit: '', color: '#22c55e' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                borderLeft: `4px solid ${stat.color}`
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>
                  {stat.value}
                  <span style={{ fontSize: '14px', fontWeight: '400', marginLeft: '4px' }}>
                    {stat.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* タブ */}
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'items', label: '在庫一覧' },
              { id: 'movements', label: '入出庫履歴' },
              { id: 'orders', label: '発注管理' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 24px',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'items' && (
            /* 在庫一覧 */
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              {/* フィルター */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <input
                  type="text"
                  placeholder="商品名・SKUで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="all">全カテゴリー</option>
                  <option value="equipment">機器</option>
                  <option value="parts">部品</option>
                  <option value="tools">工具</option>
                  <option value="consumables">消耗品</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white'
                  }}
                >
                  <option value="all">全ステータス</option>
                  <option value="in-stock">在庫あり</option>
                  <option value="low-stock">在庫少</option>
                  <option value="out-of-stock">在庫切れ</option>
                  <option value="ordered">発注中</option>
                </select>
              </div>

              {/* テーブル */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        商品名
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        カテゴリー
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        在庫数
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'left',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        在庫レベル
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        ステータス
                      </th>
                      <th style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '2px solid #e5e7eb'
                      }}>
                        アクション
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(item => (
                      <tr key={item.id} style={{
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              SKU: {item.sku} | {item.location}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: '#f3f4f6',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                            {item.currentStock}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {item.unit}
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ width: '120px' }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                              color: '#6b7280',
                              marginBottom: '4px'
                            }}>
                              <span>最小: {item.minStock}</span>
                              <span>最大: {item.maxStock}</span>
                            </div>
                            <div style={{
                              height: '8px',
                              background: '#e5e7eb',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${getStockPercentage(item.currentStock, item.maxStock)}%`,
                                background: item.currentStock <= item.minStock ? '#ef4444' :
                                  item.currentStock <= item.minStock * 1.5 ? '#eab308' : '#22c55e',
                                transition: 'width 0.3s'
                              }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: `${getStatusColor(item.status)}20`,
                            color: getStatusColor(item.status)
                          }}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => {
                                setSelectedItem(item)
                                setShowStockModal(true)
                              }}
                              style={{
                                padding: '6px 12px',
                                background: 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              在庫調整
                            </button>
                            <button style={{
                              padding: '6px 12px',
                              background: 'white',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}>
                              詳細
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            /* 入出庫履歴 */
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {movements.map(movement => (
                  <div key={movement.id} style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        background: movement.type === 'in' ? '#dcfce7' : '#fee2e2',
                        color: movement.type === 'in' ? '#15803d' : '#dc2626'
                      }}>
                        {movement.type === 'in' ? '↓' : '↑'}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                          {movement.itemName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {getMovementTypeLabel(movement.type)} - {movement.reason}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: movement.type === 'in' ? '#15803d' : '#dc2626' }}>
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {movement.performedBy} • {movement.date.toLocaleString('ja-JP')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            /* 発注管理 */
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map(order => (
                  <div key={order.id} style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '12px'
                    }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {order.orderNumber}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {order.supplier} • {order.items.length}品目
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#dbeafe',
                        color: '#1e40af'
                      }}>
                        {order.status === 'confirmed' ? '確認済み' : order.status}
                      </span>
                    </div>
                    <div style={{
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '6px',
                      marginBottom: '12px'
                    }}>
                      {order.items.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                          marginBottom: index < order.items.length - 1 ? '8px' : 0
                        }}>
                          <span>{item.itemName} × {item.quantity}</span>
                          <span>¥{(item.quantity * item.unitPrice).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        発注日: {order.orderDate.toLocaleDateString('ja-JP')}
                        {order.expectedDelivery && (
                          <span> • 納期: {order.expectedDelivery.toLocaleDateString('ja-JP')}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        合計: ¥{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 在庫調整モーダル */}
      {showStockModal && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              在庫調整 - {selectedItem.name}
            </h3>

            <div style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                現在の在庫
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>
                {selectedItem.currentStock} {selectedItem.unit}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                調整タイプ
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  background: '#dcfce7',
                  border: '2px solid #22c55e',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  入庫
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  background: '#fee2e2',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  出庫
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                数量
              </label>
              <input
                type="number"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                理由
              </label>
              <textarea
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowStockModal(false)
                  setSelectedItem(null)
                }}
                style={{
                  padding: '8px 20px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => handleStockUpdate(selectedItem.id, 'in', 10)}
                style={{
                  padding: '8px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InventoryPage() {
  return (
    <AuthProvider>
      <InventoryContent />
    </AuthProvider>
  )
}