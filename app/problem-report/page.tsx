'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { AlertTriangle, Camera, Send, MapPin, Clock, User } from 'lucide-react'

export default function ProblemReportPage() {
  const router = useRouter()
  const [reportType, setReportType] = useState('')
  const [urgency, setUrgency] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // シミュレート送信
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      
      // ローカルストレージに保存
      const report = {
        id: Date.now().toString(),
        type: reportType,
        urgency,
        description,
        photos,
        timestamp: new Date().toISOString(),
        reporter: '鈴木一郎'
      }
      
      const existingReports = JSON.parse(localStorage.getItem('problemReports') || '[]')
      existingReports.push(report)
      localStorage.setItem('problemReports', JSON.stringify(existingReports))
      
      // 3秒後にカレンダーページにリダイレクト
      setTimeout(() => {
        router.push('/demo')
      }, 3000)
    }, 1000)
  }

  const problemTypes = [
    { value: 'equipment', label: '機器の故障', icon: '🔧' },
    { value: 'parts', label: '部品不足', icon: '📦' },
    { value: 'safety', label: '安全上の問題', icon: '⚠️' },
    { value: 'access', label: '現場アクセス不可', icon: '🚫' },
    { value: 'customer', label: '顧客トラブル', icon: '👥' },
    { value: 'other', label: 'その他', icon: '📝' }
  ]

  const urgencyLevels = [
    { value: 'high', label: '緊急', color: '#ef4444' },
    { value: 'medium', label: '要対応', color: '#f59e0b' },
    { value: 'low', label: '報告のみ', color: '#3b82f6' }
  ]

  return (
    <AppLayout>
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={28} color="#ef4444" />
          問題報告
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#718096',
          marginBottom: '32px'
        }}>
          作業中に発生した問題を迅速に報告
        </p>

        {/* 現在の作業情報 */}
        <div style={{
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '12px',
              color: '#718096',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MapPin size={12} />
              現在の作業場所
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              新宿マンション
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '12px',
              color: '#718096',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clock size={12} />
              作業時間
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              14:00 - 17:00
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '12px',
              color: '#718096',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <User size={12} />
              報告者
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2d3748'
            }}>
              鈴木一郎
            </div>
          </div>
        </div>

        {submitted ? (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ✅
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#155724',
              marginBottom: '8px'
            }}>
              報告が送信されました
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#155724'
            }}>
              管理者に通知が送信されました。対応をお待ちください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 問題の種類 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '12px'
              }}>
                問題の種類 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                {problemTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReportType(type.value)}
                    style={{
                      padding: '16px',
                      background: reportType === type.value ? '#eff6ff' : 'white',
                      border: reportType === type.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{type.icon}</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: reportType === type.value ? '#3b82f6' : '#4a5568'
                    }}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 緊急度 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '12px'
              }}>
                緊急度 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                {urgencyLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setUrgency(level.value)}
                    style={{
                      padding: '12px',
                      background: urgency === level.value ? `${level.color}10` : 'white',
                      border: urgency === level.value ? `2px solid ${level.color}` : '2px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: urgency === level.value ? level.color : '#4a5568'
                    }}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 詳細説明 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                詳細説明 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="問題の詳細を記入してください..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 写真添付 */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                写真添付（任意）
              </label>
              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                background: '#f7fafc',
                cursor: 'pointer'
              }}>
                <Camera size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                <p style={{
                  fontSize: '14px',
                  color: '#718096'
                }}>
                  クリックまたはドラッグで写真を追加
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '4px'
                }}>
                  JPG, PNG (最大5MB)
                </p>
              </div>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={!reportType || !urgency || !description || submitting}
              style={{
                width: '100%',
                padding: '14px',
                background: (!reportType || !urgency || !description) ? '#e5e7eb' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!reportType || !urgency || !description || submitting) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {submitting ? (
                <>送信中...</>
              ) : (
                <>
                  <Send size={20} />
                  問題を報告する
                </>
              )}
            </button>
          </form>
        )}

        {/* 注意事項 */}
        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          borderRadius: '4px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#991b1b',
            marginBottom: '8px'
          }}>
            緊急時の対応
          </h4>
          <ul style={{
            fontSize: '13px',
            color: '#991b1b',
            marginLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li>人身事故や火災の場合は、まず119番通報してください</li>
            <li>緊急度「高」の報告は管理者の携帯に直接通知されます</li>
            <li>写真があると状況把握が早くなります</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}