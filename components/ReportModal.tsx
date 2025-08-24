'use client'

import { useState, useEffect } from 'react'
import * as React from 'react'
import Modal from './Modal'
import { FileText, Download, Eye, Image, Calendar, User, MapPin, Clock, Camera } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportType?: 'daily' | 'weekly' | 'monthly' | 'custom'
}

export default function ReportModal({ isOpen, onClose, reportType = 'daily' }: ReportModalProps) {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv'>('pdf')
  const [includePhotos, setIncludePhotos] = useState(true)
  const [activeReportType, setActiveReportType] = useState<'worker-performance' | 'sales-summary' | 'schedule-efficiency' | 'customer-satisfaction'>('worker-performance')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const loadReport = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports?type=${type}&from=${dateRange.start}&to=${dateRange.end}`)
      const result = await response.json()
      
      if (result.success) {
        setReportData(result.data)
      }
    } catch (error) {
      console.error('Report loading error:', error)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    if (isOpen) {
      loadReport(activeReportType)
    }
  }, [isOpen, activeReportType, dateRange])

  const handleReportTypeChange = (type: 'worker-performance' | 'sales-summary' | 'schedule-efficiency' | 'customer-satisfaction') => {
    setActiveReportType(type)
  }

  const reportTypes = [
    { id: 'worker-performance', label: '職人パフォーマンス', icon: '👷‍♂️' },
    { id: 'sales-summary', label: '売上サマリー', icon: '💰' },
    { id: 'schedule-efficiency', label: 'スケジュール効率', icon: '⚡' },
    { id: 'customer-satisfaction', label: '顧客満足度', icon: '⭐' }
  ]

  const handleExport = () => {
    console.log(`Exporting ${activeReportType} report as ${exportFormat}`)
    onClose()
  }

  const renderReportContent = () => {
    if (loading) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
          <div>レポートを生成中...</div>
        </div>
      )
    }

    if (!reportData) return null

    switch (activeReportType) {
      case 'worker-performance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {[
                { label: '総職人数', value: reportData.summary?.totalWorkers || 0, color: '#3b82f6' },
                { label: '完了作業数', value: reportData.summary?.totalJobsCompleted || 0, color: '#10b981' },
                { label: '総売上', value: `¥${(reportData.summary?.totalRevenue || 0).toLocaleString()}`, color: '#f59e0b' },
                { label: '平均効率', value: `${reportData.summary?.avgEfficiency || 0}%`, color: '#8b5cf6' }
              ].map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Worker Performance Table */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Mobile View */}
              <div style={{ display: 'block' }} className="md:hidden">
                {reportData.workers?.map((worker: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '16px',
                    borderBottom: idx < (reportData.workers?.length - 1) ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
                      {worker.name}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>完了数: </span>
                        <span>{worker.completedJobs}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>効率: </span>
                        <span style={{ 
                          color: worker.efficiency >= 90 ? '#10b981' : worker.efficiency >= 70 ? '#f59e0b' : '#ef4444' 
                        }}>
                          {worker.efficiency}%
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>売上: </span>
                        <span>¥{worker.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>月平均: </span>
                        <span>{worker.avgJobsPerMonth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div style={{ display: 'none' }} className="md:block">
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '12px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 100px 120px 80px',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div>職人名</div>
                  <div>完了数</div>
                  <div>月平均</div>
                  <div>売上</div>
                  <div>効率</div>
                </div>
                {reportData.workers?.map((worker: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 100px 120px 80px',
                    fontSize: '13px',
                    borderBottom: idx < (reportData.workers?.length - 1) ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div style={{ fontWeight: '500' }}>{worker.name}</div>
                    <div>{worker.completedJobs}</div>
                    <div>{worker.avgJobsPerMonth}</div>
                    <div>¥{worker.totalRevenue.toLocaleString()}</div>
                    <div style={{ 
                      color: worker.efficiency >= 90 ? '#10b981' : worker.efficiency >= 70 ? '#f59e0b' : '#ef4444' 
                    }}>
                      {worker.efficiency}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'sales-summary':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { label: '総売上', value: `¥${(reportData.totalRevenue || 0).toLocaleString()}`, color: '#10b981' },
                { label: '総作業数', value: reportData.totalJobs || 0, color: '#3b82f6' },
                { label: '平均単価', value: `¥${(reportData.avgJobValue || 0).toLocaleString()}`, color: '#f59e0b' }
              ].map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Construction Type Revenue */}
            <div>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>工事種別売上</h4>
              {Object.entries(reportData.constructionTypeRevenue || {}).map(([type, revenue]: [string, any]) => (
                <div key={type} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span>{type}</span>
                  <span style={{ fontWeight: '600' }}>¥{revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'schedule-efficiency':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { label: '割り当て成功率', value: `${reportData.assignmentSuccess}%`, color: '#10b981' },
                { label: '自動割り当て率', value: `${reportData.autoAssignmentRate}%`, color: '#3b82f6' },
                { label: '職人稼働率', value: `${reportData.workerUtilization}%`, color: '#f59e0b' }
              ].map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>平均応答時間</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{reportData.avgResponseTime}</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>スケジュール変更率</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{reportData.reschedulingRate}%</div>
              </div>
            </div>
          </div>
        )

      case 'customer-satisfaction':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {[
                { label: '平均評価', value: `${reportData.avgRating}/5.0`, color: '#10b981' },
                { label: '満足度', value: `${reportData.satisfactionRate}%`, color: '#3b82f6' },
                { label: '回答率', value: `${reportData.responseRate}%`, color: '#f59e0b' }
              ].map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{reportData.compliments}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>お褒めの言葉</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>{reportData.complaints}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>苦情</div>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{reportData.totalResponses}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>総回答数</div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>選択されたレポートタイプのデータがありません</div>
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="レポート・分析" size="xl">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Report Type Selection */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleReportTypeChange(type.id as any)}
              style={{
                padding: '6px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                background: activeReportType === type.id ? '#3b82f6' : 'white',
                color: activeReportType === type.id ? 'white' : '#374151',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: 0,
                flex: '1 1 auto'
              }}
            >
              <span>{type.icon}</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {type.label}
              </span>
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              開始日
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              終了日
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            />
          </div>
        </div>

        {/* Report Content */}
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '16px', 
          maxHeight: '400px', 
          overflowY: 'auto' 
        }}>
          {renderReportContent()}
        </div>

        {/* Export Options */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>エクスポート形式:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['excel', 'pdf', 'csv'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  style={{
                    padding: '6px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    background: exportFormat === format ? '#3b82f6' : 'white',
                    color: exportFormat === format ? 'white' : '#374151',
                    fontSize: '13px',
                    cursor: 'pointer',
                    flex: '1 0 auto'
                  }}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              閉じる
            </button>
            <button
              onClick={handleExport}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={16} />
              エクスポート
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}