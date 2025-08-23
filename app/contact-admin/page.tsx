'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, CheckCircle, AlertCircle, Phone, Mail, Clock } from 'lucide-react'
import AppLayout from '@/components/AppLayout'

export default function ContactAdminPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'normal',
    message: '',
    contactMethod: 'email'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const categories = [
    { value: 'general', label: '一般的な問い合わせ', icon: '📋' },
    { value: 'schedule', label: 'スケジュール変更', icon: '📅' },
    { value: 'emergency', label: '緊急連絡', icon: '🚨' },
    { value: 'report', label: '作業報告', icon: '📝' },
    { value: 'equipment', label: '機材・資材について', icon: '🔧' },
    { value: 'other', label: 'その他', icon: '💭' }
  ]

  const priorities = [
    { value: 'low', label: '低', color: '#10b981' },
    { value: 'normal', label: '通常', color: '#3b82f6' },
    { value: 'high', label: '高', color: '#f59e0b' },
    { value: 'urgent', label: '緊急', color: '#ef4444' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // メール送信のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 実際の実装では、ここでAPIを呼び出してメールを送信
      // const response = await fetch('/api/contact-admin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      setSubmitStatus('success')
      
      // 3秒後にカレンダーページにリダイレクト
      setTimeout(() => {
        router.push('/demo')
      }, 3000)
      
      // 成功後、フォームをリセット
      setTimeout(() => {
        setFormData({
          subject: '',
          category: 'general',
          priority: 'normal',
          message: '',
          contactMethod: 'email'
        })
        setSubmitStatus('idle')
      }, 3000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* ヘッダー */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            padding: '24px',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Mail size={28} />
              管理者への連絡
            </h1>
            <p style={{
              fontSize: '14px',
              opacity: 0.9
            }}>
              スケジュール変更や緊急連絡など、管理者にメールで連絡します
            </p>
          </div>

          {/* 管理者情報 */}
          <div style={{
            padding: '20px 24px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              山
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                山田 太郎（管理者）
              </h3>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> admin@example.com
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> 090-1234-5678
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> 営業時間: 9:00-18:00
                </span>
              </div>
            </div>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* カテゴリー選択 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                カテゴリー <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    style={{
                      padding: '12px',
                      border: '2px solid',
                      borderColor: formData.category === cat.value ? '#667eea' : '#e5e7eb',
                      borderRadius: '8px',
                      background: formData.category === cat.value ? '#f0f4ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                    <span style={{
                      fontSize: '12px',
                      color: formData.category === cat.value ? '#667eea' : '#6b7280',
                      fontWeight: formData.category === cat.value ? '600' : '400'
                    }}>
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 優先度 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                優先度 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                {priorities.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: priority.value })}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      border: '2px solid',
                      borderColor: formData.priority === priority.value ? priority.color : '#e5e7eb',
                      borderRadius: '8px',
                      background: formData.priority === priority.value ? priority.color + '10' : 'white',
                      color: formData.priority === priority.value ? priority.color : '#6b7280',
                      fontWeight: formData.priority === priority.value ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '14px'
                    }}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 件名 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                件名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="例: 明日の現場作業について"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* メッセージ */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                メッセージ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="詳細な内容をご記入ください..."
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* 連絡方法 */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                返信方法の希望
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                  />
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>メール</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                  />
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>電話</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value="both"
                    checked={formData.contactMethod === 'both'}
                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                  />
                  <span style={{ fontSize: '14px', color: '#4b5563' }}>どちらでも</span>
                </label>
              </div>
            </div>

            {/* ステータスメッセージ */}
            {submitStatus === 'success' && (
              <div style={{
                padding: '12px',
                background: '#d1fae5',
                border: '1px solid #6ee7b7',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#065f46'
              }}>
                <CheckCircle size={20} />
                <span style={{ fontSize: '14px' }}>
                  メールを送信しました。管理者から返信があるまでお待ちください。
                </span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                padding: '12px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#991b1b'
              }}>
                <AlertCircle size={20} />
                <span style={{ fontSize: '14px' }}>
                  送信に失敗しました。もう一度お試しください。
                </span>
              </div>
            )}

            {/* 送信ボタン */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => router.back()}
                style={{
                  padding: '10px 24px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
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
                disabled={isSubmitting || !formData.subject || !formData.message}
                style={{
                  padding: '10px 24px',
                  background: isSubmitting || !formData.subject || !formData.message
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isSubmitting || !formData.subject || !formData.message
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} />
                {isSubmitting ? '送信中...' : 'メールを送信'}
              </button>
            </div>
          </form>
        </div>

        {/* 注意事項 */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#92400e',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            ご注意
          </h3>
          <ul style={{
            fontSize: '13px',
            color: '#78350f',
            paddingLeft: '20px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            <li>緊急の場合は、直接電話（090-1234-5678）でご連絡ください</li>
            <li>営業時間外の連絡は、翌営業日の対応となります</li>
            <li>作業報告書は別途、専用フォームからご提出ください</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}