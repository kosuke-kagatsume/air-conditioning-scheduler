'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { ToastContainer } from '@/components/Toast'
import Modal, { ConfirmDialog } from '@/components/Modal'
import QRCodeModal from '@/components/QRCodeModal'
import ColorPicker from '@/components/ColorPicker'
import AppSyncModal from '@/components/AppSyncModal'
import ReportModal from '@/components/ReportModal'
import WorkerModal from '@/components/WorkerModal'
import AutoAssignmentModal from '@/components/AutoAssignmentModal'
import NotificationsTab from '@/components/settings/NotificationsTab'
import CalendarDisplayTab from '@/components/settings/CalendarDisplayTab'
import AutoAssignmentRules from '@/components/settings/AutoAssignmentRules'
import CalendarConfigTab from '@/components/settings/CalendarConfigTab'
import WorkersTab from '@/components/settings/WorkersTab'
import PermissionsTab from '@/components/settings/PermissionsTab'
import ReportsTab from '@/components/settings/ReportsTab'
// Constants are passed via props from Server Component
interface SettingsClientProps {
  colors: {
    INSTALLATION: string;
    MAINTENANCE: string;
    REPAIR: string;
    EMERGENCY: string;
  };
  defaultSkills: string[];
  defaultCertifications: string[];
  businessHours: any;
  shiftPatterns: any;
  approvalRoles: any;
  reportTypes: any;
  reportFormats: any;
  userRoles: any;
  tabLabels: any;
  notificationTimings: any[];
  holidayTypes: any;
  serverTimestamp: string;
}

export default function SettingsClient(props: SettingsClientProps) {
  const { colors: COLORS, defaultSkills: DEFAULT_SKILLS, defaultCertifications: DEFAULT_CERTIFICATIONS } = props;
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('calendar')

  // ID生成用カウンター（Hydration safe）
  const idCounterRef = useRef(0)
  const generateId = () => {
    idCounterRef.current += 1
    return `id-${idCounterRef.current}`
  }
  
  // Toast system
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info' | 'warning'}>>([])
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrData, setQrData] = useState({ title: '', data: '', description: '' })
  const [appSyncModalOpen, setAppSyncModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [workerModalOpen, setWorkerModalOpen] = useState(false)
  const [autoAssignmentModalOpen, setAutoAssignmentModalOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<any>(null)
  
  // Calendar display settings
  const [calendarSettings, setCalendarSettings] = useState({
    defaultView: 'month',
    includeWeekends: true,
    hideCompleted: false,
    colorRules: {
      installation: COLORS?.INSTALLATION || '#3B82F6',
      maintenance: COLORS?.MAINTENANCE || '#10B981',
      repair: COLORS?.REPAIR || '#F59E0B',
      emergency: COLORS?.EMERGENCY || '#EF4444'
    }
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    newSchedule: true,
    scheduleChange: true,
    workComplete: false,
    problemAlert: true,
    reminderTiming: 30 // minutes before
  })

  // Skills and certifications management
  const [skills, setSkills] = useState(DEFAULT_SKILLS ? Array.from(DEFAULT_SKILLS) : [])
  const [certifications, setCertifications] = useState(DEFAULT_CERTIFICATIONS ? Array.from(DEFAULT_CERTIFICATIONS) : [])
  const [newSkill, setNewSkill] = useState('')
  const [newCertification, setNewCertification] = useState('')

  // Workers data
  const [workers, setWorkers] = useState([
    { id: 1, name: '山田太郎', status: '稼働中', skills: ['エアコン設置', '電気工事'], cert: '2024/12/31', statusColor: '#10b981' },
    { id: 2, name: '佐藤次郎', status: '休憩中', skills: ['配管工事', '冷媒取扱'], cert: '2024/06/30', statusColor: '#f59e0b' },
    { id: 3, name: '鈴木三郎', status: '稼働中', skills: ['高所作業', 'クレーン操作'], cert: '2025/03/15', statusColor: '#10b981' },
    { id: 4, name: '田中四郎', status: '非番', skills: ['溶接作業', 'ダクト工事'], cert: '2024/08/20', statusColor: '#6b7280' }
  ])

  // Shift templates
  const [shiftTemplates, setShiftTemplates] = useState([
    { id: 1, name: '標準シフト', hours: '8:00-17:00', days: '月-金', workers: 4, active: true },
    { id: 2, name: '夜間メンテ', hours: '20:00-05:00', days: '土日', workers: 2, active: true },
    { id: 3, name: '緊急対応', hours: '24時間', days: '全日', workers: 1, active: false }
  ])

  // Approval templates
  const [approvalTemplates, setApprovalTemplates] = useState([
    { id: 1, name: '標準工事承認', condition: '設置・修理作業', approvers: ['現場責任者', '管理者'], autoApproval: false, active: true },
    { id: 2, name: '定期メンテナンス', condition: '定期点検・清掃', approvers: ['現場責任者'], autoApproval: true, active: true },
    { id: 3, name: '緊急対応', condition: '緊急修理・故障対応', approvers: ['管理者', '部長'], autoApproval: false, active: true },
    { id: 4, name: '高額工事', condition: '10万円以上の工事', approvers: ['現場責任者', '管理者', '部長'], autoApproval: false, active: false }
  ])

  // Report templates
  const [reportTemplates, setReportTemplates] = useState([
    { id: 1, name: '作業完了レポート', frequency: '毎日', recipients: ['管理者', '営業部'], format: 'PDF', active: true, lastSent: '8/23 09:00' },
    { id: 2, name: '売上集計レポート', frequency: '毎週月曜', recipients: ['管理者', '経理部'], format: 'Excel', active: true, lastSent: '8/19 10:00' },
    { id: 3, name: '職人稼働状況', frequency: '毎月末', recipients: ['人事部', '管理者'], format: 'PDF', active: true, lastSent: '7/31 17:00' },
    { id: 4, name: '顧客満足度調査', frequency: '四半期', recipients: ['営業部', '品質管理'], format: 'PDF+CSV', active: false, lastSent: '6/30 15:00' }
  ])

  // User roles
  const [userRoles, setUserRoles] = useState([
    { id: 1, name: '管理者', users: 3, permissions: ['全機能アクセス', 'ユーザー管理', 'システム設定', '承認権限'], color: '#dc2626', active: true },
    { id: 2, name: '現場責任者', users: 4, permissions: ['スケジュール管理', '職人管理', '作業報告確認', '承認申請'], color: '#f59e0b', active: true },
    { id: 3, name: '職人', users: 8, permissions: ['自分のスケジュール確認', '作業報告', 'チェックイン/アウト'], color: '#10b981', active: true },
    { id: 4, name: '閲覧者', users: 0, permissions: ['スケジュール閲覧のみ'], color: '#6b7280', active: false }
  ])

  // Users data
  const [users, setUsers] = useState([
    { id: 1, name: '田中管理者', email: 'admin@company.com', role: '管理者', roleColor: '#dc2626', lastLogin: '8/23 10:30', status: 'active' },
    { id: 2, name: '山田太郎', email: 'yamada@company.com', role: '現場責任者', roleColor: '#f59e0b', lastLogin: '8/23 09:15', status: 'active' },
    { id: 3, name: '佐藤次郎', email: 'sato@company.com', role: '職人', roleColor: '#10b981', lastLogin: '8/22 17:45', status: 'active' },
    { id: 4, name: '鈴木三郎', email: 'suzuki@company.com', role: '職人', roleColor: '#10b981', lastLogin: '8/20 16:20', status: 'inactive' }
  ])

  // Business hours settings
  const [businessHours, setBusinessHours] = useState({
    weekdayStart: '08:00',
    weekdayEnd: '17:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    saturdayEnabled: true,
    sundayEnabled: false,
    holidayEnabled: true
  })

  const tabs = [
    { id: 'calendar', label: 'カレンダー表示', icon: '📅' },
    { id: 'workers', label: '職人・スキル', icon: '👷' },
    { id: 'shifts', label: 'シフト・割当', icon: '⏰' },
    { id: 'notifications', label: '通知設定', icon: '🔔' },
    { id: 'approval', label: '承認フロー', icon: '✅' },
    { id: 'reports', label: 'レポート', icon: '📊' },
    { id: 'permissions', label: '権限管理', icon: '🔒' },
    { id: 'calendar-config', label: '営業日設定', icon: '📆' }
  ]
  // データベースから職人データを取得
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const response = await fetch('/api/workers')
        const result = await response.json()
        
        if (result.success) {
          setWorkers(result.workers.map((worker: any) => ({
            ...worker,
            statusColor: worker.employmentType === 'FULL_TIME' ? '#10b981' : '#f59e0b',
            status: worker.employmentType === 'FULL_TIME' ? '稼働中' : 'パート',
            cert: worker.certifications?.[0]?.issuedDate ? 
              new Date(worker.certifications[0].issuedDate).toISOString().split('T')[0] : 
              '2025/12/31',
            skills: worker.skills?.map((s: any) => s.name) || []
          })))
        }
      } catch (error) {
        console.error('Error loading workers:', error)
      }
    }
    
    loadWorkers()
  }, [])

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = generateId()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // Event handlers
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
      showToast(`スキル「${newSkill.trim()}」を追加しました`, 'success')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setDeletingItem({ name: skillToRemove, type: 'skill' })
    setDeleteModalOpen(true)
  }

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()])
      setNewCertification('')
      showToast(`資格「${newCertification.trim()}」を追加しました`, 'success')
    }
  }

  const removeCertification = (certToRemove: string) => {
    setDeletingItem({ name: certToRemove, type: 'certification' })
    setDeleteModalOpen(true)
  }

  const toggleWorkerStatus = (workerId: number) => {
    setWorkers(workers.map(worker => 
      worker.id === workerId 
        ? { ...worker, status: worker.status === 'active' ? 'inactive' : 'active' }
        : worker
    ))
    showToast('職人のステータスを変更しました', 'success')
  }

  const toggleTemplateStatus = (templateId: number, templateType: string) => {
    if (templateType === 'shift') {
      setShiftTemplates(shiftTemplates.map(template =>
        template.id === templateId
          ? { ...template, active: !template.active }
          : template
      ))
    } else if (templateType === 'approval') {
      setApprovalTemplates(approvalTemplates.map(template =>
        template.id === templateId
          ? { ...template, active: !template.active }
          : template
      ))
    } else if (templateType === 'report') {
      setReportTemplates(reportTemplates.map(template =>
        template.id === templateId
          ? { ...template, active: !template.active }
          : template
      ))
    }
    showToast(`テンプレートの状態を変更しました`, 'success')
  }

  const handleApprovalAction = (action: string, item: string) => {
    showToast(`${action}を実行しました: ${item}`, 'success')
  }

  const handleReportGenerate = () => {
    showToast('レポートを生成しています...', 'info')
    setTimeout(() => showToast('レポート生成完了！', 'success'), 1500)
  }

  const handleExportData = (format: string) => {
    showToast(`${format}形式でデータをエクスポートしています...`, 'info')
    setTimeout(() => showToast(`${format}ファイルのダウンロードを開始しました`, 'success'), 1000)
  }

  const toggleUserRole = (roleId: number) => {
    setUserRoles(userRoles.map(role =>
      role.id === roleId
        ? { ...role, active: !role.active }
        : role
    ))
    showToast('役割の状態を変更しました', 'success')
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
    showToast('ユーザーのステータスを変更しました', 'success')
  }

  const syncMobileApp = (feature: string) => {
    showToast(`${feature}をモバイルアプリに同期しています...`, 'info')
    setTimeout(() => showToast('モバイルアプリとの同期が完了しました！', 'success'), 1500)
  }

  const openQRModal = (title: string, data: string, description: string) => {
    setQrData({ title, data, description })
    setQrModalOpen(true)
  }

  const handleSave = () => {
    // Save settings logic here
    showToast('設定を保存しました', 'success')
  }

  const openEditModal = (item: any, type: string) => {
    setEditingItem({ ...item, type })
    setEditModalOpen(true)
  }

  const handleWorkerDelete = async (workerId: string) => {
    try {
      const response = await fetch(`/api/workers?id=${workerId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // データベースから職人リストを再取得
        const workersResponse = await fetch('/api/workers')
        const workersResult = await workersResponse.json()
        
        if (workersResult.success) {
          setWorkers(workersResult.workers.map((worker: any) => ({
            ...worker,
            statusColor: worker.employmentType === 'FULL_TIME' ? '#10b981' : '#f59e0b',
            status: worker.employmentType === 'FULL_TIME' ? '稼働中' : 'パート',
            cert: worker.certifications?.[0]?.issuedDate ? 
              new Date(worker.certifications[0].issuedDate).toISOString().split('T')[0] : 
              '2025/12/31',
            skills: worker.skills?.map((s: any) => s.name) || []
          })))
        }
      } else {
        alert(result.message || '削除に失敗しました')
      }
    } catch (error) {
      console.error('Error deleting worker:', error)
      alert('削除中にエラーが発生しました')
    }
  }

  const openDeleteModal = (item: any, type: string) => {
    setDeletingItem({ ...item, type })
    setDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (deletingItem) {
      // 実際の削除処理
      switch(deletingItem.type) {
        case 'skill':
          setSkills(skills.filter(s => s !== deletingItem.name))
          break
        case 'certification':
          setCertifications(certifications.filter(c => c !== deletingItem.name))
          break
        case 'worker':
          handleWorkerDelete(deletingItem.id)
          break
        case 'shift':
          setShiftTemplates(shiftTemplates.filter(t => t.id !== deletingItem.id))
          break
        case 'approval':
          setApprovalTemplates(approvalTemplates.filter(t => t.id !== deletingItem.id))
          break
        case 'report':
          setReportTemplates(reportTemplates.filter(r => r.id !== deletingItem.id))
          break
        case 'role':
          setUserRoles(userRoles.filter(r => r.id !== deletingItem.id))
          break
        case 'user':
          setUsers(users.filter(u => u.id !== deletingItem.id))
          break
      }
      
      showToast(`${deletingItem.name || deletingItem.title}を削除しました`, 'success')
      setDeleteModalOpen(false)
      setDeletingItem(null)
    }
  }

  const handleEdit = () => {
    if (editingItem) {
      // 実際の更新処理
      switch(editingItem.type) {
        case 'worker':
          setWorkers(workers.map(w => 
            w.id === editingItem.id ? { ...w, name: editingItem.name } : w
          ))
          break
        case 'shift':
          setShiftTemplates(shiftTemplates.map(t => 
            t.id === editingItem.id ? { ...t, name: editingItem.name } : t
          ))
          break
        case 'approval':
          setApprovalTemplates(approvalTemplates.map(t => 
            t.id === editingItem.id ? { ...t, name: editingItem.name } : t
          ))
          break
        case 'report':
          setReportTemplates(reportTemplates.map(r => 
            r.id === editingItem.id ? { ...r, name: editingItem.name } : r
          ))
          break
        case 'role':
          setUserRoles(userRoles.map(r => 
            r.id === editingItem.id ? { ...r, name: editingItem.name } : r
          ))
          break
        case 'user':
          setUsers(users.map(u => 
            u.id === editingItem.id ? { ...u, name: editingItem.name } : u
          ))
          break
      }
      
      showToast(`${editingItem.name || editingItem.title}を更新しました`, 'success')
      setEditModalOpen(false)
      setEditingItem(null)
    }
  }

  return (
    <AppLayout>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      
      {/* Edit Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        title={editingItem ? `${editingItem.name || editingItem.title}を編集` : '編集'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input
              type="text"
              value={editingItem?.name || editingItem?.title || ''}
              onChange={(e) => setEditingItem((prev: any) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="削除の確認"
        message={`${deletingItem?.name || deletingItem?.title || 'このアイテム'}を削除してもよろしいですか？この操作は取り消せません。`}
        confirmText="削除"
        cancelText="キャンセル"
        type="danger"
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={qrData.title}
        data={qrData.data}
        description={qrData.description}
      />

      {/* App Sync Modal */}
      <AppSyncModal
        isOpen={appSyncModalOpen}
        onClose={() => setAppSyncModalOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Worker Modal */}
      <WorkerModal
        isOpen={workerModalOpen}
        onClose={() => {
          setWorkerModalOpen(false)
          setEditingWorker(null)
        }}
        onSave={async (workerData) => {
          // データベースから職人リストを再取得
          try {
            const response = await fetch('/api/workers')
            const result = await response.json()
            
            if (result.success) {
              setWorkers(result.workers.map((worker: any) => ({
                ...worker,
                statusColor: worker.employmentType === 'FULL_TIME' ? '#10b981' : '#f59e0b',
                status: worker.employmentType === 'FULL_TIME' ? '稼働中' : 'パート',
                cert: worker.certifications?.[0]?.issuedDate ? 
                  new Date(worker.certifications[0].issuedDate).toISOString().split('T')[0] : 
                  '2025/12/31',
                skills: worker.skills?.map((s: any) => s.name) || []
              })))
              showToast(`${workerData.name}を${editingWorker ? '更新' : '登録'}しました`, 'success')
            }
          } catch (error) {
            console.error('Error refreshing workers:', error)
          }
          
          setWorkerModalOpen(false)
          setEditingWorker(null)
        }}
        skills={skills}
        certifications={certifications}
        editingWorker={editingWorker}
      />

      {/* Auto Assignment Modal */}
      <AutoAssignmentModal
        isOpen={autoAssignmentModalOpen}
        onClose={() => setAutoAssignmentModalOpen(false)}
        showToast={showToast}
      />

      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '80px',
        background: '#f5f6f8',
        minHeight: 'calc(100vh - 56px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            管理者設定
          </h1>

          {/* Tabs Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  background: activeTab === tab.id ? '#3B82F6' : 'white',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'calendar' && (
            <CalendarDisplayTab
              calendarSettings={calendarSettings}
              setCalendarSettings={setCalendarSettings}
            />
          )}

          {activeTab === 'workers' && (
            <WorkersTab
              skills={skills}
              certifications={certifications}
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              newCertification={newCertification}
              setNewCertification={setNewCertification}
              addSkill={addSkill}
              removeSkill={removeSkill}
              addCertification={addCertification}
              removeCertification={removeCertification}
              workers={workers}
              setEditingWorker={setEditingWorker}
              setWorkerModalOpen={setWorkerModalOpen}
              openDeleteModal={openDeleteModal}
              syncMobileApp={syncMobileApp}
              openQRModal={openQRModal}
              generateId={generateId}
            />
          )}

          {activeTab === 'shifts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>シフト・自動割当設定</h2>

              {/* Shift Templates */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px' 
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>シフトテンプレート</h3>
                  <button 
                    onClick={() => showToast('シフトテンプレートの新規作成機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規テンプレート
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {shiftTemplates.map((template, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      background: template.active ? '#f0f9ff' : '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px' 
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{template.name}</h4>
                        <div style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: template.active ? '#dcfce7' : '#f3f4f6',
                          color: template.active ? '#166534' : '#6b7280'
                        }}>
                          {template.active ? '有効' : '無効'}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        🕐 {template.hours}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        📅 {template.days}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                        👥 {template.workers}名体制
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => openEditModal(template, 'shift')}
                          style={{
                            padding: '4px 8px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          編集
                        </button>
                        <button 
                          onClick={() => toggleTemplateStatus(template.id, 'shift')}
                          style={{
                            padding: '4px 8px',
                            background: template.active ? '#fef2f2' : '#dcfce7',
                            color: template.active ? '#dc2626' : '#166534',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          {template.active ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AutoAssignmentRules
                onOpenAutoAssignmentModal={() => setAutoAssignmentModalOpen(true)}
                onOpenAppSyncModal={() => setAppSyncModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

          {activeTab === 'approval' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>承認フロー設定</h2>
              
              {/* Approval Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>5</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>承認待ち</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>23</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>承認済み</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>2</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>差し戻し</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>1.2日</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>平均承認時間</div>
                </div>
              </div>

              {/* Approval Rules */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  承認ルール設定
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      自動承認条件
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>定期メンテナンス（作業時間2時間以下）</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>同じ現場での継続作業</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" />
                        <span style={{ fontSize: '13px' }}>費用5万円以下の作業</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" />
                        <span style={{ fontSize: '13px' }}>緊急対応（24時間以内）</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      承認者設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>第一承認者:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>現場責任者</option>
                          <option>営業担当者</option>
                          <option>主任</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>最終承認者:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>管理者</option>
                          <option>部長</option>
                          <option>社長</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>承認期限:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>24時間</option>
                          <option>48時間</option>
                          <option>72時間</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Approvals */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  承認待ち一覧
                </h3>
                
                <div style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    background: '#f9fafb',
                    padding: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div>申請日</div>
                    <div>現場/作業内容</div>
                    <div>申請者</div>
                    <div>ステータス</div>
                    <div>アクション</div>
                  </div>
                  
                  {[
                    { 
                      date: '8/23', 
                      work: '渋谷オフィス/エアコン交換', 
                      requester: '山田太郎', 
                      status: '承認待ち',
                      urgency: 'normal',
                      statusColor: '#f59e0b'
                    },
                    { 
                      date: '8/22', 
                      work: '新宿マンション/定期点検', 
                      requester: '佐藤次郎', 
                      status: '第一承認済み',
                      urgency: 'normal',
                      statusColor: '#3b82f6'
                    },
                    { 
                      date: '8/22', 
                      work: '品川ビル/緊急修理', 
                      requester: '鈴木三郎', 
                      status: '承認待ち',
                      urgency: 'urgent',
                      statusColor: '#ef4444'
                    },
                    { 
                      date: '8/21', 
                      work: '池袋店舗/メンテナンス', 
                      requester: '田中四郎', 
                      status: '差し戻し',
                      urgency: 'normal',
                      statusColor: '#ef4444'
                    }
                  ].map((approval, idx) => (
                    <div key={idx} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                      padding: '8px',
                      fontSize: '13px',
                      borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none',
                      alignItems: 'center',
                      background: approval.urgency === 'urgent' ? '#fef2f2' : 'white'
                    }}>
                      <div style={{ fontWeight: '500' }}>
                        {approval.date}
                        {approval.urgency === 'urgent' && (
                          <span style={{ 
                            marginLeft: '4px',
                            fontSize: '10px',
                            background: '#ef4444',
                            color: 'white',
                            padding: '1px 4px',
                            borderRadius: '8px'
                          }}>
                            急
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        <div style={{ fontWeight: '500' }}>
                          {approval.work.split('/')[0]}
                        </div>
                        <div style={{ color: '#6b7280' }}>
                          {approval.work.split('/')[1]}
                        </div>
                      </div>
                      <div>{approval.requester}</div>
                      <div>
                        <span style={{ 
                          color: approval.statusColor,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {approval.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {approval.status === '承認待ち' && (
                          <>
                            <button 
                              onClick={() => handleApprovalAction('承認', approval.work)}
                              style={{
                                padding: '4px 8px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px'
                              }}>
                              承認
                            </button>
                            <button 
                              onClick={() => {
                                const reason = prompt('差し戻し理由を入力してください：')
                                if (reason) {
                                  handleApprovalAction(`差し戻し（理由：${reason}）`, approval.work)
                                }
                              }}
                              style={{
                                padding: '4px 8px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px'
                              }}>
                              差戻
                            </button>
                          </>
                        )}
                        {approval.status === '差し戻し' && (
                          <button 
                            onClick={() => showToast(`${approval.work}を差し戻しました`, 'warning')}
                            style={{
                              padding: '4px 8px',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}>
                            詳細
                          </button>
                        )}
                        {approval.status === '第一承認済み' && (
                          <button 
                            onClick={() => handleApprovalAction('最終承認', approval.work)}
                            style={{
                              padding: '4px 8px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}>
                            最終承認
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Templates */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px' 
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>承認テンプレート</h3>
                  <button 
                    onClick={() => showToast('承認テンプレートの新規作成機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規テンプレート
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {approvalTemplates.map((template, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      background: template.active ? '#f0f9ff' : '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px' 
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{template.name}</h4>
                        <div style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: template.active ? '#dcfce7' : '#f3f4f6',
                          color: template.active ? '#166534' : '#6b7280'
                        }}>
                          {template.active ? '有効' : '無効'}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                        適用条件: {template.condition}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                        承認者: {template.approvers.join(' → ')}
                      </div>
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                        {template.autoApproval && (
                          <span style={{ 
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '2px 6px',
                            borderRadius: '12px'
                          }}>
                            自動承認
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => openEditModal(template, 'approval')}
                          style={{
                            padding: '4px 8px',
                            background: '#f3f4f6',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          編集
                        </button>
                        <button 
                          onClick={() => toggleTemplateStatus(template.id, 'approval')}
                          style={{
                            padding: '4px 8px',
                            background: template.active ? '#fef2f2' : '#dcfce7',
                            color: template.active ? '#dc2626' : '#166534',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          {template.active ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #8b5cf6', 
                borderRadius: '8px',
                background: '#faf5ff'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#7c3aed' }}>
                  📱 モバイル承認機能
                </h3>
                <div style={{ fontSize: '14px', color: '#6b46c1', marginBottom: '12px' }}>
                  職人・現場責任者がスマホアプリで承認申請・承認を行えます
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      showToast('モバイルアプリ承認機能を有効にしました', 'success')
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリ承認機能を有効化
                  </button>
                  <button 
                    onClick={() => {
                      setQrData({
                        title: '承認権限付与QRコード',
                        data: `https://dandori-scheduler.app/grant-approval/${generateId()}`,

                        description: 'このQRコードをスキャンして承認権限を取得してください'
                      })
                      setQrModalOpen(true)
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#8b5cf6',
                      border: '1px solid #8b5cf6',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    承認権限をQRコードで付与
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <ReportsTab
              reportTemplates={reportTemplates}
              showToast={showToast}
              openEditModal={openEditModal}
              toggleTemplateStatus={toggleTemplateStatus}
              handleReportGenerate={handleReportGenerate}
              setReportModalOpen={setReportModalOpen}
              handleExportData={handleExportData}
              syncMobileApp={syncMobileApp}
            />
          )}

          {activeTab === 'permissions' && (
            <PermissionsTab
              userRoles={userRoles}
              users={users}
              showToast={showToast}
              openEditModal={openEditModal}
              toggleUserStatus={toggleUserStatus}
              syncMobileApp={syncMobileApp}
              setQrData={setQrData}
              setQrModalOpen={setQrModalOpen}
              setAppSyncModalOpen={setAppSyncModalOpen}
              generateId={generateId}
            />
          )}

          {activeTab === 'calendar-config' && (
            <CalendarConfigTab
              businessHours={businessHours}
              setBusinessHours={setBusinessHours}
              showToast={showToast}
            />
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => router.push('/demo')}
              style={{
                padding: '10px 20px',
                background: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              カレンダーに戻る
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '10px 20px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}