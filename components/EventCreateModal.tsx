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
    timeSlots: [] as string[]
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">新規予定作成</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本情報 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">基本情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  日付 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  工事内容 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.constructionType}
                  onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">選択してください</option>
                  {currentTenant?.settings.constructionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">開始時刻 <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">終了時刻</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 時間枠選択 */}
            {currentTenant?.settings.timeSlots && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">使用時間枠</label>
                <div className="flex gap-2">
                  {currentTenant.settings.timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleTimeSlotToggle(slot.id)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        formData.timeSlots.includes(slot.id)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot.name} ({slot.startTime}-{slot.endTime})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 現場情報 */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-700">現場情報</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">郵便番号</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                    placeholder="150-0002"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    住所 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">施主名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">工務店名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.constructorName}
                    onChange={(e) => setFormData({ ...formData, constructorName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 営業担当者 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">営業担当者</h3>
              <button
                type="button"
                onClick={handleAddSalesPerson}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + 担当者を追加
              </button>
            </div>
            {formData.salesPersons.map((sp, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sp.name}
                  onChange={(e) => handleSalesPersonChange(index, 'name', e.target.value)}
                  placeholder="担当者名"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={sp.role}
                  onChange={(e) => handleSalesPersonChange(index, 'role', e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="main">主担当</option>
                  <option value="sub">副担当</option>
                  <option value="support">サポート</option>
                </select>
                {formData.salesPersons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSalesPerson(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 職人選択 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              担当職人 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.workerId}
              onChange={(e) => handleWorkerSelect(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">選択してください</option>
              {workers.map(worker => (
                <option key={worker.id} value={worker.id}>
                  {worker.name} ({worker.role === 'master' ? '親方' : '職人'})
                </option>
              ))}
            </select>
            
            {showConflictWarning && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠️ この職人は指定日時に他の予定が入っている可能性があります
                </p>
                <textarea
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  placeholder="交渉メッセージを入力（例：別日への変更は可能でしょうか？）"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm"
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* カスタムフィールド */}
          {currentTenant?.settings.customFields && currentTenant.settings.customFields.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-gray-700">追加情報</h3>
              <div className="space-y-3">
                {currentTenant.settings.customFields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-1">
                      {field.name} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={formData.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={formData.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    {field.type === 'url' && (
                      <input
                        type="url"
                        value={formData.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={formData.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    {field.type === 'select' && field.options && (
                      <select
                        value={formData.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      >
                        <option value="">選択してください</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium mb-1">備考</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showConflictWarning ? '交渉して提案' : '予定を提案'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}