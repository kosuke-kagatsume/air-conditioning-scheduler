'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { mockUsers, mockWorkerCapacities } from '@/lib/mockData'

interface EventCreateModalProps {
  initialDate?: string
  onClose: () => void
  onSave?: (event: any) => void
}

export default function EventCreateModal({ initialDate = '', onClose, onSave }: EventCreateModalProps) {
  const { currentTenant, user } = useAuth()
  
  const [formData, setFormData] = useState({
    date: initialDate || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    constructionType: '',
    address: '',
    zipCode: '',
    city: '',
    clientName: '',
    constructorName: '',
    salesPersons: [{ name: '', role: 'main' }],
    workerId: '',
    description: '',
    customFields: {} as Record<string, any>,
    timeSlots: [] as string[],
    physicalCenter: '',
    equipment: '',
    notes: ''
  })

  const [showConflictWarning, setShowConflictWarning] = useState(false)
  const [negotiationMessage, setNegotiationMessage] = useState('')

  // 郵便番号から住所を自動入力（モック）
  const handleZipCodeChange = (zipCode: string) => {
    setFormData({ ...formData, zipCode })
    
    // 簡易的な郵便番号マッピング
    if (zipCode === '150-0002') {
      setFormData({
        ...formData,
        zipCode,
        address: '東京都渋谷区渋谷2-1-1',
        city: '渋谷区'
      })
    }
  }

  // 職人の空き状況チェック
  const checkWorkerAvailability = (workerId: string, date: string) => {
    const capacity = mockWorkerCapacities.find(c => c.workerId === workerId)
    if (!capacity) return { available: true, hasConflict: false }
    
    // ここでは簡易的に、既存の予定があるかチェック
    // 実際はGoogleカレンダー/TimeTree連携でチェック
    const hasConflict = Math.random() > 0.7 // 30%の確率で予定あり
    
    return {
      available: !hasConflict,
      hasConflict
    }
  }

  const handleWorkerSelect = (workerId: string) => {
    setFormData({ ...formData, workerId })
    
    const availability = checkWorkerAvailability(workerId, formData.date)
    if (availability.hasConflict) {
      setShowConflictWarning(true)
    } else {
      setShowConflictWarning(false)
    }
  }

  const handleAddSalesPerson = () => {
    setFormData({
      ...formData,
      salesPersons: [...formData.salesPersons, { name: '', role: 'sub' }]
    })
  }

  const handleRemoveSalesPerson = (index: number) => {
    const newSalesPersons = formData.salesPersons.filter((_, i) => i !== index)
    setFormData({ ...formData, salesPersons: newSalesPersons })
  }

  const handleSalesPersonChange = (index: number, field: string, value: string) => {
    const newSalesPersons = [...formData.salesPersons]
    newSalesPersons[index] = { ...newSalesPersons[index], [field]: value }
    setFormData({ ...formData, salesPersons: newSalesPersons })
  }

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData({
      ...formData,
      customFields: { ...formData.customFields, [fieldId]: value }
    })
  }

  const handleTimeSlotToggle = (slotId: string) => {
    const newSlots = formData.timeSlots.includes(slotId)
      ? formData.timeSlots.filter(id => id !== slotId)
      : [...formData.timeSlots, slotId]
    setFormData({ ...formData, timeSlots: newSlots })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    if (!formData.constructionType || !formData.address || !formData.workerId) {
      alert('必須項目を入力してください')
      return
    }
    
    // 保存処理
    const eventData = {
      ...formData,
      status: showConflictWarning ? 'negotiation' : 'proposed',
      negotiationMessage: showConflictWarning ? negotiationMessage : undefined,
      createdBy: user?.id,
      tenantId: currentTenant?.id
    }
    
    if (onSave) {
      onSave(eventData)
    }
    
    onClose()
  }

  const workers = mockUsers.filter(u => ['master', 'worker'].includes(u.role))

  return (
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            新規予定作成
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* 基本情報 */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
              基本情報
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  日付 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  工事内容 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.constructionType}
                  onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  required
                >
                  <option value="">選択してください</option>
                  <option value="エアコン新設">エアコン新設</option>
                  <option value="エアコン交換">エアコン交換</option>
                  <option value="メンテナンス">メンテナンス</option>
                  <option value="修理">修理</option>
                  <option value="点検">点検</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  開始時刻 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  終了時刻 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                使用時間枠
              </label>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                午前 (08:00-12:00) 午後 (13:00-17:00) 夜間 (18:00-21:00)
              </div>
            </div>
          </div>

          {/* 現場情報 */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
              現場情報
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                郵便番号
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                placeholder="150-0002"
                style={{
                  width: '200px',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  住所 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  施主名 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                工務店名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.constructorName}
                onChange={(e) => setFormData({ ...formData, constructorName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              />
            </div>
          </div>

          {/* 営業担当者 */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', margin: 0 }}>
                営業担当者
              </h3>
              <button
                type="button"
                onClick={handleAddSalesPerson}
                style={{
                  padding: '4px 12px',
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#3b82f6',
                  cursor: 'pointer'
                }}
              >
                + 担当者を追加
              </button>
            </div>
            
            {formData.salesPersons.map((sp, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={sp.name}
                  onChange={(e) => handleSalesPersonChange(index, 'name', e.target.value)}
                  placeholder="担当者名"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <select
                  value={sp.role}
                  onChange={(e) => handleSalesPersonChange(index, 'role', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="main">主担当</option>
                  <option value="sub">副担当</option>
                  <option value="support">サポート</option>
                </select>
                {formData.salesPersons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSalesPerson(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#fee2e2',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
            
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                担当職人 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.workerId}
                onChange={(e) => handleWorkerSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer'
                }}
                required
              >
                <option value="">選択してください</option>
                {workers.map(worker => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} ({worker.role === 'master' ? '親方' : '職人'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 追加情報 */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
              追加情報
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  設置台数 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                  物流センター
                </label>
                <select
                  value={formData.physicalCenter}
                  onChange={(e) => setFormData({ ...formData, physicalCenter: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="東京">東京</option>
                  <option value="神奈川">神奈川</option>
                  <option value="千葉">千葉</option>
                  <option value="埼玉">埼玉</option>
                </select>
              </div>
            </div>


            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                納品先
              </label>
              <input
                type="text"
                value=""
                placeholder="納品先を入力"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                特記事項
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>
                備考
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          </div>

          {/* ボタン */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 24px',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6'
              }}
            >
              予定を提案
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}