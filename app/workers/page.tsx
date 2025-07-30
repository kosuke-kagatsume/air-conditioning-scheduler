'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Skill {
  id: string
  name: string
  level: 'basic' | 'intermediate' | 'advanced'
}

interface Worker {
  id: string
  name: string
  company: string
  color: string
  viewPermission: boolean
  approvalPermission: boolean
  email: string
  phone: string
  emergencyPhone: string
  maxSlots: number
  currentSlots: number
  skills: Skill[]
  workAreas: string[]
  availableHours: {
    morning: boolean
    night: boolean
    weekend: boolean
    holiday: boolean
  }
  rating: number
  completedProjects: number
  joinDate: Date
  insurance: {
    liability: boolean
    accident: boolean
    expiryDate: Date
  }
}

const colorOptions = [
  { color: '#ff6b6b', name: '赤' },
  { color: '#74c0fc', name: '青' },
  { color: '#51cf66', name: '緑' },
  { color: '#ffd93d', name: '黄' },
  { color: '#9775fa', name: '紫' },
  { color: '#ff8cc3', name: 'ピンク' },
  { color: '#4ecdc4', name: 'ターコイズ' },
  { color: '#ff9a00', name: 'オレンジ' },
  { color: '#868e96', name: 'グレー' },
  { color: '#15aabf', name: 'シアン' }
]

const skillsList = [
  '第二種電気工事士',
  '第一種電気工事士',
  '冷媒取扱技術者',
  '高所作業車運転',
  'ガス溶接技能',
  '玉掛け技能',
  '職長・安全衛生責任者',
  'フルハーネス特別教育'
]

const areasList = [
  '東京23区',
  '東京都下',
  '神奈川県',
  '埼玉県',
  '千葉県',
  '茨城県',
  '栃木県',
  '群馬県'
]

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: '1',
      name: '山田太郎',
      company: 'A社',
      color: '#ff6b6b',
      viewPermission: true,
      approvalPermission: true,
      email: 'yamada@a-company.jp',
      phone: '090-1234-5678',
      emergencyPhone: '090-1234-5679',
      maxSlots: 3,
      currentSlots: 2,
      skills: [
        { id: '1', name: '第二種電気工事士', level: 'advanced' },
        { id: '2', name: '冷媒取扱技術者', level: 'advanced' },
        { id: '3', name: 'フルハーネス特別教育', level: 'intermediate' }
      ],
      workAreas: ['東京23区', '東京都下', '神奈川県'],
      availableHours: {
        morning: true,
        night: false,
        weekend: true,
        holiday: false
      },
      rating: 4.8,
      completedProjects: 256,
      joinDate: new Date(2020, 3, 1),
      insurance: {
        liability: true,
        accident: true,
        expiryDate: new Date(2026, 2, 31)
      }
    },
    {
      id: '2',
      name: '佐藤次郎',
      company: 'B社',
      color: '#74c0fc',
      viewPermission: true,
      approvalPermission: false,
      email: 'sato@b-company.jp',
      phone: '090-2345-6789',
      emergencyPhone: '090-2345-6790',
      maxSlots: 2,
      currentSlots: 1,
      skills: [
        { id: '1', name: '第一種電気工事士', level: 'advanced' },
        { id: '2', name: '高所作業車運転', level: 'intermediate' }
      ],
      workAreas: ['東京23区', '埼玉県'],
      availableHours: {
        morning: true,
        night: true,
        weekend: false,
        holiday: false
      },
      rating: 4.5,
      completedProjects: 182,
      joinDate: new Date(2021, 8, 15),
      insurance: {
        liability: true,
        accident: true,
        expiryDate: new Date(2025, 11, 31)
      }
    }
  ])

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'areas' | 'schedule' | 'performance'>('basic')

  const handleColorChange = (workerId: string, newColor: string) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId ? { ...worker, color: newColor } : worker
    ))
  }

  const handlePermissionChange = (workerId: string, permissionType: 'view' | 'approval', value: boolean) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId 
        ? { 
            ...worker, 
            ...(permissionType === 'view' ? { viewPermission: value } : { approvalPermission: value })
          } 
        : worker
    ))
  }

  const getUtilizationRate = (worker: Worker) => {
    return Math.round((worker.currentSlots / worker.maxSlots) * 100)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
      {/* Header */}
      <header className="nav-modern" style={{ background: 'white' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/demo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: 'white',
          borderRight: '1px solid #e1e4e8',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6c7684', marginBottom: '16px' }}>
            メニュー
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link href="/demo" className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
              📅 カレンダー
            </Link>
            <button className="nav-tab active" style={{ width: '100%', textAlign: 'left' }}>
              👷 職人管理
            </button>
            <button className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
              🏗️ 現場管理
            </button>
            <button className="nav-tab" style={{ width: '100%', textAlign: 'left' }}>
              📊 レポート
            </button>
          </nav>

          {/* 統計サマリー */}
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6c7684', marginBottom: '16px' }}>
              本日の稼働状況
            </h3>
            <div className="card" style={{ background: '#f5f6f8' }}>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>稼働中</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#51cf66' }}>8名</p>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>待機中</p>
                <p style={{ fontSize: '20px', fontWeight: '600', color: '#ffd93d' }}>3名</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>平均稼働率</p>
                <p style={{ fontSize: '20px', fontWeight: '600', color: '#74c0fc' }}>72%</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c3e50'
            }}>
              協力業者（職人）管理
            </h2>
            <button className="btn-primary">
              + 新規登録
            </button>
          </div>

          {/* Workers Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '16px'
          }}>
            {workers.map(worker => {
              const utilizationRate = getUtilizationRate(worker)
              return (
                <div
                  key={worker.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => {
                    setSelectedWorker(worker)
                    setIsEditModalOpen(true)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: worker.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      {worker.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '4px',
                            color: '#2c3e50'
                          }}>
                            {worker.name}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#6c7684', marginBottom: '8px' }}>
                            {worker.company}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div 
                            title="閲覧権限"
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: worker.viewPermission ? '#51cf66' : '#e1e4e8'
                            }} 
                          />
                          <div 
                            title="承認権限"
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: worker.approvalPermission ? '#51cf66' : '#e1e4e8'
                            }} 
                          />
                        </div>
                      </div>
                      
                      {/* 稼働状況 */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: '#6c7684' }}>本日の稼働</span>
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>
                            {worker.currentSlots}/{worker.maxSlots}件
                          </span>
                        </div>
                        <div style={{
                          height: '6px',
                          background: '#e1e4e8',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${utilizationRate}%`,
                            height: '100%',
                            background: utilizationRate > 80 ? '#ff6b6b' : utilizationRate > 50 ? '#ffd93d' : '#51cf66',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>

                      {/* スキル */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        {worker.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            background: '#f5f6f8',
                            borderRadius: '12px',
                            color: '#6c7684'
                          }}>
                            {skill.name}
                          </span>
                        ))}
                        {worker.skills.length > 3 && (
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            background: '#f5f6f8',
                            borderRadius: '12px',
                            color: '#6c7684'
                          }}>
                            +{worker.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* 連絡先と評価 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#6c7684' }}>
                          {worker.phone}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '14px' }}>⭐</span>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{worker.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedWorker && (
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
          <div className="card" style={{
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid #e1e4e8',
              paddingBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: selectedWorker.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '28px'
                }}>
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
                    {selectedWorker.name}
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6c7684' }}>
                    {selectedWorker.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c7684'
                }}
              >
                ×
              </button>
            </div>

            {/* タブメニュー */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #e1e4e8',
              marginBottom: '24px',
              gap: '4px'
            }}>
              {[
                { id: 'basic', label: '基本情報', icon: '👤' },
                { id: 'skills', label: 'スキル・資格', icon: '🎓' },
                { id: 'areas', label: '対応エリア・時間', icon: '📍' },
                { id: 'schedule', label: 'スケジュール', icon: '📅' },
                { id: 'performance', label: '実績・評価', icon: '📊' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    background: activeTab === tab.id ? 'white' : 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '2px solid #ff6b6b' : 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    color: activeTab === tab.id ? '#ff6b6b' : '#6c7684',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 基本情報タブ */}
            {activeTab === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 色設定 */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    色設定
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px'
                  }}>
                    {colorOptions.map(option => (
                      <button
                        key={option.color}
                        onClick={() => handleColorChange(selectedWorker.id, option.color)}
                        style={{
                          height: '48px',
                          background: option.color,
                          border: selectedWorker.color === option.color ? '3px solid #2c3e50' : 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 権限設定 */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    権限設定
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f5f6f8',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                          閲覧権限
                        </p>
                        <p style={{ fontSize: '14px', color: '#6c7684' }}>
                          カレンダーの予定を閲覧できます
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePermissionChange(selectedWorker.id, 'view', !selectedWorker.viewPermission)
                        }}
                        style={{
                          width: '48px',
                          height: '28px',
                          borderRadius: '14px',
                          background: selectedWorker.viewPermission ? '#51cf66' : '#e1e4e8',
                          border: 'none',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '3px',
                          left: selectedWorker.viewPermission ? '23px' : '3px',
                          transition: 'left 0.2s',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }} />
                      </button>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f5f6f8',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                          承認機能
                        </p>
                        <p style={{ fontSize: '14px', color: '#6c7684' }}>
                          予定の承諾・拒否・保留ができます
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePermissionChange(selectedWorker.id, 'approval', !selectedWorker.approvalPermission)
                        }}
                        style={{
                          width: '48px',
                          height: '28px',
                          borderRadius: '14px',
                          background: selectedWorker.approvalPermission ? '#51cf66' : '#e1e4e8',
                          border: 'none',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '3px',
                          left: selectedWorker.approvalPermission ? '23px' : '3px',
                          transition: 'left 0.2s',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }} />
                      </button>
                    </label>
                  </div>
                </div>

                {/* 連絡先 */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    連絡先情報
                  </label>
                  <div className="card" style={{ background: '#f5f6f8' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>メールアドレス</p>
                        <p style={{ fontSize: '14px' }}>{selectedWorker.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>電話番号</p>
                        <p style={{ fontSize: '14px' }}>{selectedWorker.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>緊急連絡先</p>
                        <p style={{ fontSize: '14px' }}>{selectedWorker.emergencyPhone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>1日の最大作業数</p>
                        <p style={{ fontSize: '14px' }}>{selectedWorker.maxSlots}件</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 保険情報 */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    保険加入状況
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="card" style={{ flex: 1, background: selectedWorker.insurance.liability ? '#51cf6620' : '#e1e4e8' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>賠償責任保険</p>
                      <p style={{ fontSize: '12px', color: selectedWorker.insurance.liability ? '#51cf66' : '#6c7684' }}>
                        {selectedWorker.insurance.liability ? '加入済' : '未加入'}
                      </p>
                    </div>
                    <div className="card" style={{ flex: 1, background: selectedWorker.insurance.accident ? '#51cf6620' : '#e1e4e8' }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>労災保険</p>
                      <p style={{ fontSize: '12px', color: selectedWorker.insurance.accident ? '#51cf66' : '#6c7684' }}>
                        {selectedWorker.insurance.accident ? '加入済' : '未加入'}
                      </p>
                    </div>
                    <div className="card" style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>保険期限</p>
                      <p style={{ fontSize: '12px', color: '#6c7684' }}>
                        {selectedWorker.insurance.expiryDate.toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* スキル・資格タブ */}
            {activeTab === 'skills' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>保有資格・スキル</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedWorker.skills.map(skill => (
                      <div key={skill.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: '#f5f6f8',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{skill.name}</span>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          background: 
                            skill.level === 'advanced' ? '#51cf66' :
                            skill.level === 'intermediate' ? '#74c0fc' : '#ffd93d',
                          color: 'white'
                        }}>
                          {skill.level === 'advanced' ? '上級' :
                           skill.level === 'intermediate' ? '中級' : '初級'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>追加可能な資格</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skillsList.filter(skill => 
                      !selectedWorker.skills.some(s => s.name === skill)
                    ).map(skill => (
                      <button
                        key={skill}
                        style={{
                          padding: '6px 16px',
                          border: '2px dashed #e1e4e8',
                          borderRadius: '20px',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: '#6c7684'
                        }}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 対応エリア・時間タブ */}
            {activeTab === 'areas' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>対応可能エリア</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {areasList.map(area => (
                      <label key={area} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: selectedWorker.workAreas.includes(area) ? '#51cf6620' : '#f5f6f8',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedWorker.workAreas.includes(area)}
                          onChange={() => {}}
                        />
                        <span style={{ fontSize: '14px' }}>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>対応可能時間帯</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { key: 'morning', label: '早朝対応（6:00〜8:00）', icon: '🌅' },
                      { key: 'night', label: '夜間対応（18:00〜22:00）', icon: '🌙' },
                      { key: 'weekend', label: '土日対応', icon: '📅' },
                      { key: 'holiday', label: '祝日対応', icon: '🎌' }
                    ].map(item => (
                      <div key={item.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f5f6f8',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '20px' }}>{item.icon}</span>
                          <span style={{ fontSize: '14px' }}>{item.label}</span>
                        </div>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: selectedWorker.availableHours[item.key as keyof typeof selectedWorker.availableHours] ? '#51cf66' : '#e1e4e8'
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* スケジュールタブ */}
            {activeTab === 'schedule' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>今週の予定</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                      <div key={index} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '8px' }}>{day}</p>
                        <div style={{
                          height: '60px',
                          background: index === 3 ? '#ff6b6b20' : index === 5 ? '#74c0fc20' : '#f5f6f8',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {index === 3 ? '2/3' : index === 5 ? '1/3' : '0/3'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>稼働率推移</h4>
                  <div style={{
                    height: '200px',
                    background: '#f5f6f8',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c7684'
                  }}>
                    📊 稼働率グラフ
                  </div>
                </div>

                <div className="card" style={{ background: '#f0f9ff' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>今月の統計</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>完了件数</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#51cf66' }}>24件</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>平均稼働率</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#74c0fc' }}>68%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6c7684', marginBottom: '4px' }}>キャンセル率</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#ff6b6b' }}>8%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 実績・評価タブ */}
            {activeTab === 'performance' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>総合評価</h4>
                  <div className="card" style={{
                    background: 'linear-gradient(135deg, #ff6b6b20, #4ecdc420)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>⭐</div>
                    <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>{selectedWorker.rating}</div>
                    <p style={{ fontSize: '14px', color: '#6c7684' }}>
                      {selectedWorker.completedProjects}件の実績
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>評価内訳</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: '技術力', score: 4.9 },
                      { label: '対応スピード', score: 4.7 },
                      { label: 'コミュニケーション', score: 4.8 },
                      { label: '清潔さ・マナー', score: 4.9 },
                      { label: '価格満足度', score: 4.6 }
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px' }}>{item.label}</span>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.score}</span>
                        </div>
                        <div style={{
                          height: '8px',
                          background: '#e1e4e8',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(item.score / 5) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>最近のレビュー</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { customer: '東京建設', date: '2025/07/15', comment: '丁寧な作業で満足しています。' },
                      { customer: '関東ビル', date: '2025/07/10', comment: '時間通りに来ていただき助かりました。' }
                    ].map((review, i) => (
                      <div key={i} className="card" style={{ background: '#f5f6f8' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '600' }}>{review.customer}</p>
                          <p style={{ fontSize: '12px', color: '#6c7684' }}>{review.date}</p>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6c7684' }}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={() => setIsEditModalOpen(false)}
              style={{ marginTop: '24px' }}
            >
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}