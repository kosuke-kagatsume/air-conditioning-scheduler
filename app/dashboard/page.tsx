'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import { mockEvents, mockUsers } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'

type DateRange = '7days' | '30days' | '90days' | '1year'

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30days')

  // 統計データの計算
  const stats = useMemo(() => {
    const now = new Date()
    const getRangeStart = (range: DateRange) => {
      const date = new Date()
      switch (range) {
        case '7days': date.setDate(date.getDate() - 7); break
        case '30days': date.setDate(date.getDate() - 30); break
        case '90days': date.setDate(date.getDate() - 90); break
        case '1year': date.setFullYear(date.getFullYear() - 1); break
      }
      return date.toISOString().split('T')[0]
    }

    const rangeStart = getRangeStart(dateRange)
    const eventsInRange = mockEvents.filter(e => e.date >= rangeStart)

    // ステータス別集計
    const statusCounts = {
      proposed: eventsInRange.filter(e => e.status === 'proposed').length,
      accepted: eventsInRange.filter(e => e.status === 'accepted').length,
      pending: eventsInRange.filter(e => e.status === 'pending').length,
      rejected: eventsInRange.filter(e => e.status === 'rejected').length,
      completed: eventsInRange.filter(e => e.status === 'completed').length
    }

    // 職人稼働率
    const workers = mockUsers.filter(u => u.role === 'worker' || u.role === 'master')
    const activeWorkers = new Set(eventsInRange.map(e => e.workerId)).size
    const workerUtilization = workers.length > 0 ? (activeWorkers / workers.length * 100).toFixed(1) : '0'

    // 月別の件数
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
      
      return {
        month: date.toLocaleDateString('ja-JP', { month: 'short' }),
        count: mockEvents.filter(e => e.date >= monthStart && e.date <= monthEnd).length
      }
    }).reverse()

    // トラブル発生率（ダミーデータ）
    const troubleRate = 5.2

    // 平均施工時間（ダミーデータ）
    const avgConstructionTime = 3.5

    return {
      totalEvents: eventsInRange.length,
      statusCounts,
      workerUtilization,
      monthlyData,
      troubleRate,
      avgConstructionTime,
      totalWorkers: workers.length,
      activeWorkers
    }
  }, [dateRange])

  // トップ職人データ（ダミー）
  const topWorkers = [
    { name: '田中太郎', company: '田中工務店', completed: 18, rating: 4.8 },
    { name: '山田次郎', company: '山田設備', completed: 15, rating: 4.9 },
    { name: '佐藤三郎', company: '佐藤空調', completed: 14, rating: 4.7 },
    { name: '鈴木四郎', company: '鈴木エアコン', completed: 12, rating: 4.6 },
    { name: '高橋五郎', company: '高橋サービス', completed: 11, rating: 4.8 }
  ]

  // 最近の活動
  const recentActivities = mockEvents
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      type: event.status,
      description: `${event.clientName}様の${event.constructionType}`,
      time: new Date(event.date).toLocaleDateString('ja-JP'),
      user: event.constructorName
    }))

  return (
    <AuthProvider>
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

        {/* Main Layout */}
        <div>
          {/* サイドバー */}
          <Sidebar />

          {/* Main Content */}
          <main style={{ marginLeft: '240px', padding: '20px', minHeight: 'calc(100vh - 60px)' }}>
          {/* Page Header */}
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
              ダッシュボード
            </h2>
            
            {/* Date Range Selector */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { value: '7days', label: '7日間' },
                { value: '30days', label: '30日間' },
                { value: '90days', label: '90日間' },
                { value: '1year', label: '1年間' }
              ].map(range => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as DateRange)}
                  style={{
                    padding: '8px 16px',
                    background: dateRange === range.value ? '#ff6b6b' : 'white',
                    color: dateRange === range.value ? 'white' : '#6b7280',
                    border: dateRange === range.value ? 'none' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: dateRange === range.value ? '500' : '400'
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* 総予定数 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    総予定数
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
                    {stats.totalEvents}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                    +12% 前月比
                  </div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#dbeafe',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📊
                </div>
              </div>
            </div>

            {/* 職人稼働率 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    職人稼働率
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
                    {stats.workerUtilization}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {stats.activeWorkers}/{stats.totalWorkers}人が稼働中
                  </div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#dcfce7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  👷
                </div>
              </div>
            </div>

            {/* トラブル発生率 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    トラブル発生率
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
                    {stats.troubleRate}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    +0.5% 前月比
                  </div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fee2e2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ⚠️
                </div>
              </div>
            </div>

            {/* 平均施工時間 */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    平均施工時間
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937' }}>
                    {stats.avgConstructionTime}h
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                    -0.2h 前月比
                  </div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fef3c7',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  ⏱️
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Charts Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status Chart */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  ステータス別予定数
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                  {[
                    { label: '提案中', value: stats.statusCounts.proposed, color: '#3b82f6' },
                    { label: '確定', value: stats.statusCounts.accepted, color: '#22c55e' },
                    { label: '保留', value: stats.statusCounts.pending, color: '#eab308' },
                    { label: '拒否', value: stats.statusCounts.rejected, color: '#ef4444' },
                    { label: '完了', value: stats.statusCounts.completed, color: '#6b7280' }
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: item.color,
                        marginBottom: '4px'
                      }}>
                        {item.value}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Progress bars */}
                <div style={{ display: 'flex', gap: '2px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ width: `${stats.statusCounts.proposed / stats.totalEvents * 100}%`, background: '#3b82f6' }} />
                  <div style={{ width: `${stats.statusCounts.accepted / stats.totalEvents * 100}%`, background: '#22c55e' }} />
                  <div style={{ width: `${stats.statusCounts.pending / stats.totalEvents * 100}%`, background: '#eab308' }} />
                  <div style={{ width: `${stats.statusCounts.rejected / stats.totalEvents * 100}%`, background: '#ef4444' }} />
                  <div style={{ width: `${stats.statusCounts.completed / stats.totalEvents * 100}%`, background: '#6b7280' }} />
                </div>
              </div>

              {/* Monthly Trend */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  月別予定数推移
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px' }}>
                  {stats.monthlyData.map((data, index) => {
                    const maxCount = Math.max(...stats.monthlyData.map(d => d.count))
                    const height = maxCount > 0 ? (data.count / maxCount * 100) : 0
                    
                    return (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          background: '#ff6b6b',
                          borderRadius: '4px 4px 0 0',
                          height: `${height}%`,
                          minHeight: '4px',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1f2937'
                          }}>
                            {data.count}
                          </div>
                        </div>
                        <div style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          {data.month}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Top Workers */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  トップパフォーマー
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {topWorkers.map((worker, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: index < 3 ? 'white' : '#6b7280'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                          {worker.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {worker.company}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {worker.completed}件
                        </div>
                        <div style={{ fontSize: '12px', color: '#f59e0b' }}>
                          ★ {worker.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  最近の活動
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentActivities.map((activity, index) => (
                    <div key={index} style={{
                      paddingBottom: '12px',
                      borderBottom: index < recentActivities.length - 1 ? '1px solid #e5e7eb' : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          {activity.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {activity.time}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {activity.user}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </AuthProvider>
  )
}