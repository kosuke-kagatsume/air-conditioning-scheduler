'use client'

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react'

interface MultiDayEventFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: any) => void
  initialDate?: Date
  workers?: { id: string; name: string }[]
  sites?: { id: string; name: string; address: string }[]
}

export default function MultiDayEventForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialDate,
  workers = [],
  sites = []
}: MultiDayEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: initialDate?.toISOString().split('T')[0] || '',
    endDate: '',
    isMultiDay: false,
    startTime: '09:00',
    endTime: '18:00',
    workerId: '',
    siteId: '',
    constructionType: '',
    estimatedHours: '',
    notes: ''
  })

  const [errors, setErrors] = useState<any>({})

  const constructionTypes = [
    'エアコン設置',
    'エアコン修理',
    'メンテナンス',
    '配管工事',
    '電気工事',
    '解体工事',
    'その他'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // バリデーション
    const newErrors: any = {}
    if (!formData.title) newErrors.title = 'タイトルは必須です'
    if (!formData.startDate) newErrors.startDate = '開始日は必須です'
    if (formData.isMultiDay && !formData.endDate) {
      newErrors.endDate = '終了日は必須です'
    }
    if (formData.isMultiDay && formData.endDate < formData.startDate) {
      newErrors.endDate = '終了日は開始日以降にしてください'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    onSubmit({
      ...formData,
      endDate: formData.isMultiDay ? formData.endDate : formData.startDate,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null
    })
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
            新規予定作成
          </h2>
          <button onClick={onClose} style={{
            padding: '8px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '24px'
          }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 基本情報 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              基本情報
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                タイトル <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: errors.title ? '1px solid #dc2626' : '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="例: ○○ビル エアコン設置工事"
              />
              {errors.title && (
                <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                  {errors.title}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                工事種別
              </label>
              <select
                value={formData.constructionType}
                onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">選択してください</option>
                {constructionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 日時設定 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              日時設定
            </h3>
            
            {/* 複数日フラグ */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.isMultiDay}
                  onChange={(e) => setFormData({ ...formData, isMultiDay: e.target.checked })}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '14px' }}>複数日にわたる工事</span>
              </label>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: formData.isMultiDay ? '1fr 1fr' : '1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                  {formData.isMultiDay ? '開始日' : '日付'} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: errors.startDate ? '1px solid #dc2626' : '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
                {errors.startDate && (
                  <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors.startDate}
                  </p>
                )}
              </div>
              
              {formData.isMultiDay && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                    終了日 <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: errors.endDate ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                  {errors.endDate && (
                    <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                      {errors.endDate}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                  開始時刻
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                  終了時刻
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>

            {formData.isMultiDay && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'start',
                gap: '8px'
              }}>
                <AlertCircle size={16} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#92400e' }}>
                  複数日工事の場合、各日の作業時間は上記の時間帯で固定されます。
                  日によって異なる場合は、個別に予定を作成してください。
                </p>
              </div>
            )}
          </div>

          {/* 現場情報 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              現場情報
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                現場
              </label>
              <select
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">選択してください</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.name} - {site.address}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                担当職人
              </label>
              <select
                value={formData.workerId}
                onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                <option value="">未割当</option>
                {workers.map(worker => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 詳細情報 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              詳細情報
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                作業見積時間（時間）
              </label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                step="0.5"
                min="0"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="例: 8.5"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                備考
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
                placeholder="特記事項があれば入力してください"
              />
            </div>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              予定を作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}