'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'

interface WorkReport {
  id: string
  eventId: string
  date: string
  clientName: string
  address: string
  constructionType: string
  startTime: string
  endTime: string
  workContent: string
  materials: { name: string; quantity: number; unit: string }[]
  photos: string[]
  issues: string
  nextSteps: string
  workerSignature: string
  clientSignature: string
  status: 'draft' | 'submitted' | 'approved'
  createdAt: string
  location?: { lat: number; lng: number }
}

function ReportsContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [reports, setReports] = useState<WorkReport[]>([
    {
      id: '1',
      eventId: 'E001',
      date: '2025-08-07',
      clientName: '山田様',
      address: '東京都渋谷区渋谷2-1-1',
      constructionType: 'エアコン新設',
      startTime: '09:00',
      endTime: '12:00',
      workContent: 'リビングルームにエアコン2台設置完了',
      materials: [
        { name: 'エアコン本体', quantity: 2, unit: '台' },
        { name: '配管', quantity: 10, unit: 'm' },
        { name: 'ビス', quantity: 20, unit: '本' }
      ],
      photos: [],
      issues: '特になし',
      nextSteps: '1週間後に動作確認',
      workerSignature: '田中太郎',
      clientSignature: '山田花子',
      status: 'approved',
      createdAt: '2025-08-07T12:30:00'
    }
  ])

  // 新規報告書のフォームデータ
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    address: '',
    constructionType: '',
    startTime: '',
    endTime: '',
    workContent: '',
    materials: [{ name: '', quantity: 0, unit: '' }],
    photos: [] as string[],
    issues: '',
    nextSteps: '',
    location: undefined as { lat: number; lng: number } | undefined
  })

  const [showCamera, setShowCamera] = useState(false)
  const [signature, setSignature] = useState({ worker: '', client: '' })

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, { name: '', quantity: 0, unit: '' }]
    })
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    })
  }

  const handleMaterialChange = (index: number, field: string, value: any) => {
    const newMaterials = [...formData.materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setFormData({ ...formData, materials: newMaterials })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // 実際の実装では、ファイルをアップロードして URL を取得
      const photoUrls = Array.from(files).map(file => URL.createObjectURL(file))
      setFormData({ ...formData, photos: [...formData.photos, ...photoUrls] })
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
          alert('位置情報を取得しました')
        },
        (error) => {
          alert('位置情報の取得に失敗しました')
        }
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReport: WorkReport = {
      id: Date.now().toString(),
      eventId: 'E' + Date.now(),
      ...formData,
      workerSignature: signature.worker,
      clientSignature: signature.client,
      status: 'draft',
      createdAt: new Date().toISOString(),
      materials: formData.materials.filter(m => m.name)
    }
    setReports([newReport, ...reports])
    alert('作業報告書を保存しました')
    setActiveTab('list')
  }

  const handleSubmitReport = (reportId: string) => {
    setReports(reports.map(r =>
      r.id === reportId ? { ...r, status: 'submitted' } : r
    ))
    alert('報告書を提出しました')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e1e4e8',
        padding: '12px 20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/demo" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
              borderRadius: '10px',
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
              fontWeight: '600',
              margin: 0,
              color: '#2c3e50'
            }}>HVAC Scheduler</h1>
          </Link>
        </div>
      </header>

      <Sidebar />
      
      <div style={{
        marginLeft: '240px',
        padding: '20px',
        minHeight: 'calc(100vh - 60px)'
      }}>
        <div style={{ width: '100%' }}>
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
            作業報告書
          </h2>

          {/* タブ切り替え */}
          <div style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'create' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'create' ? '500' : '400',
                color: activeTab === 'create' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              新規作成
            </button>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'list' ? 'white' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: activeTab === 'list' ? '500' : '400',
                color: activeTab === 'list' ? '#1f2937' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              報告書一覧
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          /* 新規作成フォーム */
          <form onSubmit={handleSubmit} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px'
          }}>
            {/* 基本情報 */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                基本情報
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                    作業日 <span style={{ color: '#ef4444' }}>*</span>
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
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
                      background: 'white'
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

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
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

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                    顧客名 <span style={{ color: '#ef4444' }}>*</span>
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

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                    作業場所 <span style={{ color: '#ef4444' }}>*</span>
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
              </div>

              {/* 位置情報 */}
              <div style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  📍 現在地を記録
                </button>
                {formData.location && (
                  <span style={{ fontSize: '12px', color: '#22c55e', marginLeft: '12px' }}>
                    ✓ 位置情報記録済み
                  </span>
                )}
              </div>
            </div>

            {/* 作業内容 */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                作業内容
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                  作業詳細 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  value={formData.workContent}
                  onChange={(e) => setFormData({ ...formData, workContent: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="実施した作業内容を詳しく記入してください"
                  required
                />
              </div>

              {/* 使用材料 */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <label style={{ fontSize: '13px', fontWeight: '500' }}>
                    使用材料
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
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
                    + 材料追加
                  </button>
                </div>

                {formData.materials.map((material, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr auto',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <input
                      type="text"
                      value={material.name}
                      onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
                      placeholder="材料名"
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => handleMaterialChange(index, 'quantity', Number(e.target.value))}
                      placeholder="数量"
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <input
                      type="text"
                      value={material.unit}
                      onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                      placeholder="単位"
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    {formData.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        style={{
                          padding: '8px',
                          background: '#fee2e2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 写真アップロード */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                作業写真
              </h3>

              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                background: '#f9fafb'
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  📷 写真を選択
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                  または、ここにドラッグ＆ドロップ
                </p>
              </div>

              {formData.photos.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  {formData.photos.map((photo, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      background: `url(${photo}) center/cover`,
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* 問題点・次回対応 */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                特記事項
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                  問題点・課題
                </label>
                <textarea
                  value={formData.issues}
                  onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="作業中に発生した問題や課題があれば記入"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                  次回対応事項
                </label>
                <textarea
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="次回の作業や確認事項があれば記入"
                />
              </div>
            </div>

            {/* 署名 */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                確認署名
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                    作業者署名
                  </label>
                  <div style={{
                    padding: '20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    textAlign: 'center'
                  }}>
                    <input
                      type="text"
                      value={signature.worker}
                      onChange={(e) => setSignature({ ...signature, worker: e.target.value })}
                      placeholder="ここに署名"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '18px',
                        fontFamily: 'cursive',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                    お客様署名
                  </label>
                  <div style={{
                    padding: '20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    textAlign: 'center'
                  }}>
                    <input
                      type="text"
                      value={signature.client}
                      onChange={(e) => setSignature({ ...signature, client: e.target.value })}
                      placeholder="お客様に署名いただく"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '18px',
                        fontFamily: 'cursive',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
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
                style={{
                  padding: '10px 24px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                下書き保存
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                報告書を作成
              </button>
            </div>
          </form>
        ) : (
          /* 報告書一覧 */
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="報告書を検索..."
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reports.map(report => (
                <div key={report.id} style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: '#f9fafb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        {report.constructionType} - {report.clientName}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {new Date(report.date).toLocaleDateString('ja-JP')} {report.startTime} - {report.endTime}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {report.address}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: report.status === 'approved' ? '#dcfce7' :
                        report.status === 'submitted' ? '#fef3c7' : '#f3f4f6',
                      color: report.status === 'approved' ? '#15803d' :
                        report.status === 'submitted' ? '#a16207' : '#6b7280'
                    }}>
                      {report.status === 'approved' ? '承認済み' :
                        report.status === 'submitted' ? '提出済み' : '下書き'}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    marginBottom: '12px'
                  }}>
                    {report.workContent}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      作成: {new Date(report.createdAt).toLocaleString('ja-JP')}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                      <button style={{
                        padding: '6px 12px',
                        background: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        PDF
                      </button>
                      {report.status === 'draft' && (
                        <button
                          onClick={() => handleSubmitReport(report.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          提出
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <AuthProvider>
      <ReportsContent />
    </AuthProvider>
  )
}