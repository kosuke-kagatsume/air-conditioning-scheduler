'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { mockWorkerCapacities } from '@/lib/mockData'
import Link from 'next/link'

export default function WorkerCapacityPage() {
  const { user, isMaster, isWorker } = useAuth()
  
  // 現在のユーザーの枠数設定を取得
  const currentCapacity = mockWorkerCapacities.find(c => c.workerId === user?.id) || {
    workerId: user?.id || '',
    baseCapacity: 2,
    weekdayCapacities: {},
    specificDates: {},
    timeSlotCapacities: {}
  }

  const [baseCapacity, setBaseCapacity] = useState(currentCapacity.baseCapacity)
  const [weekdayCapacities, setWeekdayCapacities] = useState(currentCapacity.weekdayCapacities || {})
  const [specificDates, setSpecificDates] = useState<Record<string, number>>(currentCapacity.specificDates || {})
  const [timeSlotCapacities, setTimeSlotCapacities] = useState(currentCapacity.timeSlotCapacities || {})
  const [showAddSpecificDate, setShowAddSpecificDate] = useState(false)
  const [newSpecificDate, setNewSpecificDate] = useState('')
  const [newSpecificCapacity, setNewSpecificCapacity] = useState(0)

  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const timeSlots = [
    { id: 'ts1', name: '午前', time: '08:00-12:00' },
    { id: 'ts2', name: '午後', time: '13:00-17:00' },
    { id: 'ts3', name: '夜間', time: '18:00-21:00' }
  ]

  const handleWeekdayChange = (day: number, value: string) => {
    const capacity = value === '' ? undefined : parseInt(value)
    if (capacity === undefined) {
      const newCapacities = { ...weekdayCapacities }
      delete newCapacities[day]
      setWeekdayCapacities(newCapacities)
    } else {
      setWeekdayCapacities({ ...weekdayCapacities, [day]: capacity })
    }
  }

  const handleTimeSlotChange = (slotId: string, value: string) => {
    const capacity = value === '' ? undefined : parseInt(value)
    if (capacity === undefined) {
      const newCapacities = { ...timeSlotCapacities }
      delete newCapacities[slotId]
      setTimeSlotCapacities(newCapacities)
    } else {
      setTimeSlotCapacities({ ...timeSlotCapacities, [slotId]: capacity })
    }
  }

  const handleAddSpecificDate = () => {
    if (newSpecificDate && newSpecificCapacity >= 0) {
      setSpecificDates({ ...specificDates, [newSpecificDate]: newSpecificCapacity })
      setNewSpecificDate('')
      setNewSpecificCapacity(0)
      setShowAddSpecificDate(false)
    }
  }

  const handleRemoveSpecificDate = (date: string) => {
    const newDates = { ...specificDates }
    delete newDates[date]
    setSpecificDates(newDates)
  }

  const handleSave = () => {
    // ここで保存処理を行う
    alert('枠数設定を保存しました')
  }

  // 権限チェック
  if (!isMaster && !isWorker) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>アクセス権限がありません</h2>
        <p style={{ color: '#6c7684', marginBottom: '24px' }}>このページは職人専用です</p>
        <Link href="/" className="btn-primary">
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: '32px' }}>
          <Link href="/workers" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#6c7684',
            textDecoration: 'none',
            marginBottom: '16px'
          }}>
            ← 職人管理に戻る
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
            工事対応可能枠数の設定
          </h1>
          <p style={{ fontSize: '16px', color: '#6c7684', marginTop: '8px' }}>
            日ごとの工事対応可能な件数を設定してください
          </p>
        </div>

        {/* 基本枠数設定 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2c3e50' }}>
            基本設定
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#6c7684', marginBottom: '8px' }}>
              基本枠数（1日あたりの標準対応件数）
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="number"
                min="0"
                max="10"
                value={baseCapacity}
                onChange={(e) => setBaseCapacity(parseInt(e.target.value) || 0)}
                style={{
                  width: '100px',
                  padding: '8px 12px',
                  border: '2px solid #e1e4e8',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
              <span style={{ fontSize: '16px', color: '#6c7684' }}>件</span>
            </div>
            <p style={{ fontSize: '12px', color: '#6c7684', marginTop: '8px' }}>
              この設定が標準となり、曜日別・特定日の設定で上書きされます
            </p>
          </div>
        </div>

        {/* 曜日別設定 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2c3e50' }}>
            曜日別設定
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '16px' }}>
            {weekdays.map((day, index) => (
              <div key={index}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: index === 0 ? '#ff6b6b' : index === 6 ? '#4ecdc4' : '#2c3e50',
                  marginBottom: '8px' 
                }}>
                  {day}曜日
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={weekdayCapacities[index] ?? ''}
                  onChange={(e) => handleWeekdayChange(index, e.target.value)}
                  placeholder={baseCapacity.toString()}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '2px solid #e1e4e8',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#6c7684', marginTop: '16px' }}>
            空欄の場合は基本枠数が適用されます
          </p>
        </div>

        {/* 時間帯別設定 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2c3e50' }}>
            時間帯別設定
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            {timeSlots.map(slot => (
              <div key={slot.id}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                  {slot.name}
                </label>
                <span style={{ display: 'block', fontSize: '12px', color: '#6c7684', marginBottom: '8px' }}>
                  {slot.time}
                </span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={timeSlotCapacities[slot.id] ?? ''}
                  onChange={(e) => handleTimeSlotChange(slot.id, e.target.value)}
                  placeholder="設定なし"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '2px solid #e1e4e8',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#6c7684', marginTop: '16px' }}>
            時間帯別の枠数を設定すると、その合計が1日の上限となります
          </p>
        </div>

        {/* 特定日設定 */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50' }}>
              特定日設定
            </h2>
            <button
              onClick={() => setShowAddSpecificDate(true)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              + 特定日を追加
            </button>
          </div>
          
          {Object.keys(specificDates).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(specificDates).map(([date, capacity]) => (
                <div key={date} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f5f6f8',
                  borderRadius: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: '500' }}>
                      {new Date(date).toLocaleDateString('ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                    <span style={{ 
                      marginLeft: '16px', 
                      padding: '4px 12px', 
                      background: capacity === 0 ? '#ff6b6b' : '#4ecdc4',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}>
                      {capacity === 0 ? '休み' : `${capacity}件`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveSpecificDate(date)}
                    style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#6c7684', textAlign: 'center', padding: '20px' }}>
              特定日の設定はありません
            </p>
          )}
          
          {showAddSpecificDate && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#f5f6f8',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                特定日を追加
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>
                    日付
                  </label>
                  <input
                    type="date"
                    value={newSpecificDate}
                    onChange={(e) => setNewSpecificDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '2px solid #e1e4e8',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#6c7684', marginBottom: '4px' }}>
                    枠数
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newSpecificCapacity}
                    onChange={(e) => setNewSpecificCapacity(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100px',
                      padding: '8px 12px',
                      border: '2px solid #e1e4e8',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <button
                  onClick={handleAddSpecificDate}
                  className="btn-primary"
                  style={{ padding: '8px 20px' }}
                >
                  追加
                </button>
                <button
                  onClick={() => setShowAddSpecificDate(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 20px' }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 保存ボタン */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link href="/workers" className="btn-secondary" style={{ padding: '12px 32px' }}>
            キャンセル
          </Link>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{ padding: '12px 32px' }}
          >
            設定を保存
          </button>
        </div>
      </div>
    </div>
  )
}