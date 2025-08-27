'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Settings, Plus, Bell } from 'lucide-react'

interface AdminProfileProps {
  user: any
}

export default function AdminProfile({ user }: AdminProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [todayAlerts, setTodayAlerts] = useState({
    pendingApprovals: 2,
    problemReports: 1,
    scheduleChanges: 3,
    workerIssues: 0
  })

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock data for admin profile
  const adminData = {
    name: user?.name || 'DW管理者',
    role: '管理者',
    company: '田中工務店',
    todayStats: {
      totalJobs: 8,
      activeWorkers: 5,
      completedJobs: 3,
      pendingJobs: 5
    },
    quickActions: [
      { icon: Plus, label: '新規予定を作成', action: '/schedule/new' },
      { icon: Users, label: '職人を管理', action: '/workers' },
      { icon: AlertTriangle, label: '問題報告を確認', action: '/admin/problem-reports' },
      { icon: FileText, label: '予定変更を承認', action: '/schedule-change' }
    ],
    recentActivities: [
      { time: '10分前', action: '鈴木一郎から問題報告', type: 'problem' },
      { time: '30分前', action: '新規予定「品川オフィス」作成', type: 'schedule' },
      { time: '1時間前', action: '山田太郎が作業完了報告', type: 'completion' }
    ]
  }

  return (
    <>
      {/* デスクトップ版 */}
      <div className="admin-profile-desktop" style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {adminData.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '4px'
            }}>
              {adminData.name}
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#718096'
            }}>
              {adminData.role} | {adminData.company}
            </p>
          </div>
        </div>
      </div>

      {/* 今日のアラート */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        background: '#fef2f2'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Bell size={16} color="#ef4444" />
          要対応事項
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {todayAlerts.pendingApprovals > 0 && (
            <Link href="/schedule-change" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#fef5e7',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#92400e',
              fontSize: '13px'
            }}>
              <span>予定変更申請</span>
              <span style={{
                background: '#f59e0b',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px'
              }}>
                {todayAlerts.pendingApprovals}
              </span>
            </Link>
          )}
          {todayAlerts.problemReports > 0 && (
            <Link href="/admin/problem-reports" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#fee2e2',
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#991b1b',
              fontSize: '13px'
            }}>
              <span>問題報告</span>
              <span style={{
                background: '#ef4444',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px'
              }}>
                {todayAlerts.problemReports}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* 今日の統計 */}
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
          今日の状況
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            background: '#f0f9ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e40af'
            }}>
              {adminData.todayStats.totalJobs}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#1e40af',
              marginTop: '2px'
            }}>
              総予定数
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: '#f0fdf4',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#15803d'
            }}>
              {adminData.todayStats.activeWorkers}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#15803d',
              marginTop: '2px'
            }}>
              稼働職人
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: '#ecfdf5',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#059669'
            }}>
              {adminData.todayStats.completedJobs}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#059669',
              marginTop: '2px'
            }}>
              完了
            </div>
          </div>
          <div style={{
            padding: '12px',
            background: '#fffbeb',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#d97706'
            }}>
              {adminData.todayStats.pendingJobs}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#d97706',
              marginTop: '2px'
            }}>
              進行中
            </div>
          </div>
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
          {adminData.quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Link
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
              </Link>
            )
          })}
        </div>
      </div>

      {/* 最近の活動 */}
      <div style={{
        padding: '16px 20px'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '12px'
        }}>
          最近の活動
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {adminData.recentActivities.map((activity, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px',
                background: '#f9fafb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              <div style={{
                color: '#374151',
                marginBottom: '2px'
              }}>
                {activity.action}
              </div>
              <div style={{
                color: '#9ca3af',
                fontSize: '11px'
              }}>
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* モバイル版は今回省略 */}
    </>
  )
}