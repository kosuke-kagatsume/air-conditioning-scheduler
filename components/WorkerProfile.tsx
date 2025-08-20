'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Star, Clock, Package, MessageCircle, Award, TrendingUp } from 'lucide-react'

interface WorkerProfileProps {
  user: any
}

export default function WorkerProfile({ user }: WorkerProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock data for worker profile
  const workerData = {
    name: user?.name || '田中太郎',
    id: `W-${user?.id || '001'}`,
    company: '田中工務店',
    role: 'エアコン設置工事',
    experience: 18,
    totalJobs: 142,
    rating: 4.8,
    todaySchedule: [
      { time: '09:00 - 12:00', location: '渋谷区 - エアコン新設', client: '山田様', status: 'upcoming' },
      { time: '14:00 - 17:00', location: '新宿区 - メンテナンス', client: '鈴木様', status: 'upcoming' }
    ],
    quickActions: [
      { icon: Package, label: '作業報告書を作成', action: '/reports' },
      { icon: Calendar, label: '予定変更を申請', action: '/schedule-change' },
      { icon: MessageCircle, label: '管理者に連絡', action: '/contact-admin' }
    ],
    monthlyStats: {
      completedJobs: 18,
      workHours: 142,
      rating: 4.8
    },
    skills: [
      '第二種電気工事士',
      'ガス溶接技能',
      '高所作業車運転'
    ]
  }

  return (
    <>
      {/* デスクトップ版 - 右側固定 */}
      <div className="worker-profile-desktop" style={{
        position: 'fixed',
        right: '20px',
        top: '76px',
        width: '320px',
        maxHeight: 'calc(100vh - 96px)',
        overflowY: 'auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 30,
        display: !isMobile ? 'block' : 'none'
      }}>
      {/* プロフィールヘッダー */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {workerData.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '4px'
            }}>
              {workerData.name}
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#718096'
            }}>
              職人ID: {workerData.id}
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          fontSize: '12px',
          color: '#718096'
        }}>
          <span>所属: {workerData.company}</span>
          <span>•</span>
          <span>役割: {workerData.role}</span>
        </div>
      </div>

      {/* 今日の予定 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '12px'
        }}>
          今日の予定
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {workerData.todaySchedule.map((schedule, idx) => (
            <div key={idx} style={{
              padding: '12px',
              background: idx === 0 ? '#fef5e7' : '#e8f5e9',
              borderRadius: '8px',
              borderLeft: `3px solid ${idx === 0 ? '#f39c12' : '#27ae60'}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px'
              }}>
                <Clock size={14} color="#718096" />
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  {schedule.time}
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <MapPin size={14} color="#718096" />
                <span style={{
                  fontSize: '12px',
                  color: '#4a5568'
                }}>
                  {schedule.location}
                </span>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#718096',
                marginLeft: '22px'
              }}>
                顧客: {schedule.client}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* クイックアクション */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '12px'
        }}>
          クイックアクション
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {workerData.quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <a
                key={idx}
                href={action.action}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#4a5568',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#edf2f7'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f7fafc'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <Icon size={16} />
                <span>{action.label}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* 今月の実績 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '12px'
        }}>
          今月の実績
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0'
          }}>
            <span style={{ fontSize: '12px', color: '#718096' }}>完了件数</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748' }}>
              {workerData.monthlyStats.completedJobs}件
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0'
          }}>
            <span style={{ fontSize: '12px', color: '#718096' }}>稼働時間</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748' }}>
              {workerData.monthlyStats.workHours}時間
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0'
          }}>
            <span style={{ fontSize: '12px', color: '#718096' }}>評価</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={16} fill="#fbbf24" color="#fbbf24" />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748' }}>
                {workerData.monthlyStats.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 保有資格（展開可能） */}
      <div style={{
        padding: '16px 20px'
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: isExpanded ? '12px' : 0
          }}
        >
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2d3748'
          }}>
            保有資格・スキル
          </h4>
          <span style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </button>
        {isExpanded && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {workerData.skills.map((skill, idx) => (
              <span key={idx} style={{
                padding: '4px 10px',
                background: '#edf2f7',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#4a5568'
              }}>
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* モバイル版 - 上部に表示 */}
    <div className="worker-profile-mobile" style={{
      display: isMobile ? 'block' : 'none',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      margin: '0 0 16px 0'
    }}>
      {/* 簡易版プロフィール */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {workerData.name.charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1a202c'
          }}>
            {workerData.name}
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '4px'
          }}>
            <span style={{ fontSize: '12px', color: '#718096' }}>
              本日: {workerData.todaySchedule.length}件
            </span>
            <span style={{ fontSize: '12px', color: '#718096' }}>
              評価: ⭐{workerData.rating}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#4a5568'
          }}
        >
          {isExpanded ? '閉じる' : '詳細'}
        </button>
      </div>
      
      {/* 展開時の詳細 */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid #e5e7eb' }}>
          {/* 今日の予定 */}
          <div style={{ padding: '16px' }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '12px'
            }}>
              今日の予定
            </h4>
            {workerData.todaySchedule.map((schedule, idx) => (
              <div key={idx} style={{
                padding: '8px',
                background: idx === 0 ? '#fef5e7' : '#e8f5e9',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: '600' }}>{schedule.time}</div>
                <div style={{ color: '#718096' }}>{schedule.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}