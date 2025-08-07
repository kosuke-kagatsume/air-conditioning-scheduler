'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

type SettingsTab = 'general' | 'custom-fields' | 'workers' | 'notifications' | 'integrations' | 'billing'

interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select' | 'url'
  required: boolean
  options?: string[]
  order: number
}

function SettingsContent() {
  const { currentTenant, user } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  
  // 一般設定
  const [companyName, setCompanyName] = useState(currentTenant?.name || '')
  const [industryType, setIndustryType] = useState('hvac')
  const [dataRetention, setDataRetention] = useState('365')
  const [archiveEnabled, setArchiveEnabled] = useState(true)
  
  // カスタムフィールド
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { id: '1', name: '設置台数', type: 'number', required: true, order: 1 },
    { id: '2', name: '物流センター', type: 'select', required: false, options: ['東京', '神奈川', '千葉', '埼玉'], order: 2 },
    { id: '3', name: 'ガントリワークURL', type: 'url', required: false, order: 3 },
    { id: '4', name: '納品先', type: 'text', required: false, order: 4 },
    { id: '5', name: '特記事項', type: 'text', required: false, order: 5 }
  ])
  
  // 通知設定
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [slackIntegration, setSlackIntegration] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState('')
  
  // 外部連携
  const [googleCalendarEnabled, setGoogleCalendarEnabled] = useState(false)
  const [timeTreeEnabled, setTimeTreeEnabled] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const handleAddCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false,
      order: customFields.length + 1
    }
    setCustomFields([...customFields, newField])
  }

  const handleUpdateCustomField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const handleDeleteCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const handleSaveSettings = () => {
    // 設定を保存する処理
    alert('設定を保存しました')
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f6f8'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            アクセス権限がありません
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            この画面は管理者のみアクセス可能です
          </p>
          <Link href="/demo" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none'
          }}>
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    )
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
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

            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/demo" style={{ color: '#6b7280', textDecoration: 'none' }}>
                カレンダー
              </Link>
              <Link href="/sites" style={{ color: '#6b7280', textDecoration: 'none' }}>
                現場管理
              </Link>
              <Link href="/workers" style={{ color: '#6b7280', textDecoration: 'none' }}>
                職人管理
              </Link>
              <Link href="/settings" style={{ color: '#ff6b6b', textDecoration: 'none', fontWeight: '600' }}>
                設定
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px'
        }}>
          システム設定
        </h2>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* サイドバータブ */}
          <div style={{
            width: '260px',
            background: 'white',
            borderRadius: '12px',
            padding: '8px',
            height: 'fit-content'
          }}>
            {[
              { id: 'general', label: '一般設定', icon: '⚙️' },
              { id: 'custom-fields', label: 'カスタムフィールド', icon: '📝' },
              { id: 'workers', label: '職人管理設定', icon: '👷' },
              { id: 'notifications', label: '通知設定', icon: '🔔' },
              { id: 'integrations', label: '外部連携', icon: '🔗' },
              { id: 'billing', label: '請求・プラン', icon: '💳' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '500' : '400',
                  color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* メインコンテンツ */}
          <div style={{
            flex: 1,
            background: 'white',
            borderRadius: '12px',
            padding: '24px'
          }}>
            {/* 一般設定 */}
            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  一般設定
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      会社名
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
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

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      業種
                    </label>
                    <select
                      value={industryType}
                      onChange={(e) => setIndustryType(e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="hvac">空調・エアコン工事</option>
                      <option value="electric">電気工事</option>
                      <option value="plumbing">配管工事</option>
                      <option value="construction">建設業</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                      データ保持期間
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="number"
                        value={dataRetention}
                        onChange={(e) => setDataRetention(e.target.value)}
                        style={{
                          width: '120px',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>日間</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                      指定期間を過ぎたデータは自動的にアーカイブされます
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={archiveEnabled}
                        onChange={(e) => setArchiveEnabled(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px' }}>自動アーカイブを有効にする</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* カスタムフィールド */}
            {activeTab === 'custom-fields' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                    カスタムフィールド
                  </h3>
                  <button
                    onClick={handleAddCustomField}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    + フィールド追加
                  </button>
                </div>

                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  予定作成時に入力できるカスタムフィールドを設定します（最大5個）
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {customFields.map((field, index) => (
                    <div key={field.id} style={{
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
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          フィールド {index + 1}
                        </div>
                        <button
                          onClick={() => handleDeleteCustomField(field.id)}
                          style={{
                            padding: '4px 8px',
                            background: '#fee2e2',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          削除
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                            フィールド名
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => handleUpdateCustomField(field.id, { name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                            タイプ
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateCustomField(field.id, { type: e.target.value as any })}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="text">テキスト</option>
                            <option value="number">数値</option>
                            <option value="date">日付</option>
                            <option value="select">選択肢</option>
                            <option value="url">URL</option>
                          </select>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                            選択肢（カンマ区切り）
                          </label>
                          <input
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => handleUpdateCustomField(field.id, {
                              options: e.target.value.split(',').map(o => o.trim()).filter(o => o)
                            })}
                            placeholder="例: 東京, 神奈川, 千葉"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      )}

                      <div style={{ marginTop: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => handleUpdateCustomField(field.id, { required: e.target.checked })}
                          />
                          <span style={{ fontSize: '13px' }}>必須項目にする</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 通知設定 */}
            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  通知設定
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px' }}>
                      通知方法
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '14px' }}>メール通知</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '14px' }}>プッシュ通知</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px' }}>
                      Slack連携
                    </h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={slackIntegration}
                        onChange={(e) => setSlackIntegration(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px' }}>Slack通知を有効にする</span>
                    </label>
                    {slackIntegration && (
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={slackWebhook}
                          onChange={(e) => setSlackWebhook(e.target.value)}
                          placeholder="https://hooks.slack.com/services/..."
                          style={{
                            width: '100%',
                            maxWidth: '500px',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 外部連携 */}
            {activeTab === 'integrations' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  外部連携
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px' }}>📅</div>
                      <h4 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
                        Google Calendar
                      </h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                      Googleカレンダーと同期して、予定を自動的に反映します
                    </p>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={googleCalendarEnabled}
                        onChange={(e) => setGoogleCalendarEnabled(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px' }}>連携を有効にする</span>
                    </label>
                  </div>

                  <div style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px' }}>🌳</div>
                      <h4 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
                        TimeTree
                      </h4>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                      TimeTreeカレンダーと同期して、チームで予定を共有します
                    </p>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={timeTreeEnabled}
                        onChange={(e) => setTimeTreeEnabled(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '14px' }}>連携を有効にする</span>
                    </label>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '12px' }}>
                      API設定
                    </h4>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                      APIキー
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        style={{
                          flex: 1,
                          maxWidth: '400px',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontFamily: 'monospace'
                        }}
                      />
                      <button style={{
                        padding: '8px 16px',
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        再生成
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 請求・プラン */}
            {activeTab === 'billing' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                  請求・プラン
                </h3>

                <div style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  color: 'white',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                    現在のプラン
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                    プロフェッショナル
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>
                    ¥980 / ユーザー / 月
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      利用ユーザー数
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '600' }}>
                      12人
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      次回請求額
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '600' }}>
                      ¥11,760
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    プランを変更
                  </button>
                  <button style={{
                    padding: '10px 20px',
                    background: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    請求履歴を見る
                  </button>
                </div>
              </div>
            )}

            {/* 保存ボタン */}
            {['general', 'custom-fields', 'notifications', 'integrations'].includes(activeTab) && (
              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button style={{
                  padding: '10px 24px',
                  background: 'white',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  キャンセル
                </button>
                <button
                  onClick={handleSaveSettings}
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
                  変更を保存
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <SettingsContent />
    </AuthProvider>
  )
}