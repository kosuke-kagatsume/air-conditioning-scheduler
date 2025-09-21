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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>カレンダー表示設定</h2>
              
              {/* Default View */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  デフォルト表示
                </h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  {['day', 'week', 'month'].map(view => (
                    <label key={view} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input 
                        type="radio" 
                        name="defaultView"
                        checked={calendarSettings.defaultView === view}
                        onChange={() => setCalendarSettings({...calendarSettings, defaultView: view})}
                      />
                      <span>{view === 'day' ? '日' : view === 'week' ? '週' : '月'}表示</span>
                    </label>
                  ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={calendarSettings.includeWeekends}
                      onChange={(e) => setCalendarSettings({...calendarSettings, includeWeekends: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>週末を表示</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={calendarSettings.hideCompleted}
                      onChange={(e) => setCalendarSettings({...calendarSettings, hideCompleted: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>完了した予定を隠す</span>
                  </label>
                </div>
              </div>

              {/* Color Rules */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  色分けルール
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(calendarSettings.colorRules).map(([type, color]) => (
                    <ColorPicker
                      key={type}
                      color={color}
                      onChange={(newColor) => setCalendarSettings({
                        ...calendarSettings, 
                        colorRules: {...calendarSettings.colorRules, [type]: newColor}
                      })}
                      label={
                        type === 'installation' ? '設置工事' : 
                        type === 'maintenance' ? 'メンテナンス' : 
                        type === 'repair' ? '修理' : '緊急対応'
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>職人・スキル管理</h2>
              
              {/* Worker Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>12</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>登録職人数</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>8</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>稼働中</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>3</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>資格期限切れ間近</div>
                </div>
              </div>

              {/* Skill Management */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  スキルマスター管理
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                      利用可能スキル
                    </label>
                    <div style={{ 
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px',
                      height: '120px',
                      overflowY: 'auto',
                      fontSize: '13px'
                    }}>
                      {skills.map((skill, idx) => (
                        <div key={idx} style={{ 
                          padding: '4px 8px', 
                          margin: '2px 0',
                          background: '#f3f4f6',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{skill}</span>
                          <button 
                            onClick={() => removeSkill(skill)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#ef4444', 
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}>
                            削除
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="新しいスキルを追加"
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                      <button 
                        onClick={addSkill}
                        style={{
                          padding: '6px 12px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                        追加
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                      資格マスター
                    </label>
                    <div style={{ 
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px',
                      height: '120px',
                      overflowY: 'auto',
                      fontSize: '13px'
                    }}>
                      {certifications.map((cert, idx) => (
                        <div key={idx} style={{ 
                          padding: '4px 8px', 
                          margin: '2px 0',
                          background: '#f0f9ff',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{cert}</span>
                          <button 
                            onClick={() => removeCertification(cert)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#ef4444', 
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}>
                            削除
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="新しい資格を追加"
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                      <button 
                        onClick={addCertification}
                        style={{
                          padding: '6px 12px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Worker List */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>職人一覧</h3>
                  <button 
                    onClick={() => {
                      setEditingWorker(null)
                      setWorkerModalOpen(true)
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規登録
                  </button>
                </div>
                
                <div style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
                    background: '#f9fafb',
                    padding: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div>名前</div>
                    <div>ステータス</div>
                    <div>保有スキル</div>
                    <div>資格期限</div>
                    <div>アクション</div>
                  </div>
                  
                  {workers.map((worker, idx) => (
                    <div key={idx} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 2fr 1fr 1fr',
                      padding: '8px',
                      fontSize: '13px',
                      borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontWeight: '500' }}>{worker.name}</div>
                      <div>
                        <span style={{ 
                          color: worker.statusColor,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {worker.status}
                        </span>
                      </div>
                      <div>
                        {worker.skills.map((skill, skillIdx) => (
                          <span key={skillIdx} style={{
                            display: 'inline-block',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            margin: '2px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: worker.cert && new Date(worker.cert) < new Date(new Date().getTime() + 90*24*60*60*1000) ? '#ef4444' : '#374151'
                      }}>
                        {worker.cert}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => {
                            setEditingWorker(worker)
                            setWorkerModalOpen(true)
                          }}
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
                          onClick={() => openDeleteModal(worker, 'worker')}
                          style={{
                            padding: '4px 8px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #3b82f6', 
                borderRadius: '8px',
                background: '#eff6ff'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1d4ed8' }}>
                  📱 モバイルアプリ連携
                </h3>
                <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '12px' }}>
                  職人がアプリで更新した情報がこちらに反映されます
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => syncMobileApp('職人データ')}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリデータを同期
                  </button>
                  <button 
                    onClick={() => openQRModal(
                      '職人登録用QRコード',
                      `https://dandori-scheduler.vercel.app/register/worker?token=${generateId()}`,

                      '職人にこのQRコードをスキャンしてもらって、アプリに登録してください。'
                    )}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    QRコード生成（職人登録用）
                  </button>
                </div>
              </div>
            </div>
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

              {/* Auto Assignment Rules */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  自動割当ルール
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      優先順位設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { rule: 'スキルマッチング', priority: 1, enabled: true },
                        { rule: '距離（近い順）', priority: 2, enabled: true },
                        { rule: '空き時間', priority: 3, enabled: true },
                        { rule: '作業負荷バランス', priority: 4, enabled: false },
                        { rule: 'コスト最適化', priority: 5, enabled: false }
                      ].map((rule, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: rule.enabled ? '#f0f9ff' : '#f9fafb'
                        }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '500' }}>
                              {rule.priority}. {rule.rule}
                            </span>
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="checkbox" 
                              checked={rule.enabled}
                              style={{ transform: 'scale(0.9)' }}
                            />
                            <span style={{ fontSize: '12px' }}>有効</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      制約条件
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', minWidth: '120px' }}>連続勤務上限:</label>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}>
                          <option>5日</option>
                          <option>6日</option>
                          <option>7日</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', minWidth: '120px' }}>移動時間考慮:</label>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '12px' }}>30分以上は警告</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', minWidth: '120px' }}>残業時間上限:</label>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}>
                          <option>2時間</option>
                          <option>4時間</option>
                          <option>制限なし</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '13px', minWidth: '120px' }}>緊急時対応:</label>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '12px' }}>自動で待機者を割当</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Preview */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  自動割当プレビュー
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  現在の設定で明日のスケジュールを自動割当した場合の結果を確認できます
                </div>

                <button 
                  onClick={() => setAutoAssignmentModalOpen(true)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  📊 自動割当結果を詳しく見る
                </button>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #10b981', 
                borderRadius: '8px',
                background: '#ecfdf5'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#047857' }}>
                  📱 アプリ連携機能
                </h3>
                <div style={{ fontSize: '14px', color: '#065f46', marginBottom: '12px' }}>
                  職人アプリに自動で新しいスケジュールが通知されます
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setAppSyncModalOpen(true)}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリに自動通知ON
                  </button>
                  <button 
                    onClick={() => setAppSyncModalOpen(true)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#10b981',
                      border: '1px solid #10b981',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    手動確認後に通知
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>通知設定</h2>
              
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  通知項目
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={notifications.newSchedule}
                      onChange={(e) => setNotifications({...notifications, newSchedule: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>新しい予定の通知</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={notifications.scheduleChange}
                      onChange={(e) => setNotifications({...notifications, scheduleChange: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>予定変更の通知</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={notifications.workComplete}
                      onChange={(e) => setNotifications({...notifications, workComplete: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>作業完了の通知</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={notifications.problemAlert}
                      onChange={(e) => setNotifications({...notifications, problemAlert: e.target.checked})}
                    />
                    <span style={{ fontSize: '14px' }}>問題報告のアラート</span>
                  </label>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>
                    リマインダーのタイミング:
                  </label>
                  <select 
                    value={notifications.reminderTiming}
                    onChange={(e) => setNotifications({...notifications, reminderTiming: parseInt(e.target.value)})}
                    style={{ 
                      marginLeft: '8px',
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  >
                    <option value={15}>15分前</option>
                    <option value={30}>30分前</option>
                    <option value={60}>1時間前</option>
                    <option value={120}>2時間前</option>
                  </select>
                </div>
              </div>
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>レポート設定</h2>
              
              {/* Report Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>156</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>今月の作業件数</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>94.2%</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>完了率</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>2.1h</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>平均作業時間</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>¥2.1M</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>今月の売上</div>
                </div>
              </div>

              {/* Report Templates */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>定期レポート設定</h3>
                  <button 
                    onClick={() => showToast('レポートテンプレートの新規作成機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規レポート
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {reportTemplates.map((report, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      background: report.active ? '#f0f9ff' : '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px' 
                      }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{report.name}</h4>
                        <div style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: report.active ? '#dcfce7' : '#f3f4f6',
                          color: report.active ? '#166534' : '#6b7280'
                        }}>
                          {report.active ? '有効' : '無効'}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        📅 {report.frequency} | 📄 {report.format}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                        📧 {report.recipients.join(', ')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                        最終送信: {report.lastSent}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => openEditModal(report, 'report')}
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
                          onClick={() => {
                            showToast(`レポート「${report.name}」を送信しています...`, 'info')
                            setTimeout(() => showToast(`${report.format}形式のレポートを${report.recipients.join('、')}に送信しました`, 'success'), 1500)
                          }}
                          style={{
                            padding: '4px 8px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          今すぐ送信
                        </button>
                        <button 
                          onClick={() => toggleTemplateStatus(report.id, 'report')}
                          style={{
                            padding: '4px 8px',
                            background: report.active ? '#fef2f2' : '#dcfce7',
                            color: report.active ? '#dc2626' : '#166534',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          {report.active ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Report Builder */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  カスタムレポート作成
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      データ項目選択
                    </h4>
                    <div style={{ 
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px',
                      height: '120px',
                      overflowY: 'auto',
                      fontSize: '13px'
                    }}>
                      {[
                        '作業日時', '現場名', '作業内容', '担当職人', '作業時間', 
                        '材料費', '人件費', '総費用', '顧客評価', '完了状況'
                      ].map((item, idx) => (
                        <label key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '4px 0'
                        }}>
                          <input type="checkbox" defaultChecked={idx < 5} />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      フィルター条件
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>期間:</label>
                        <select style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}>
                          <option>今月</option>
                          <option>先月</option>
                          <option>過去3ヶ月</option>
                          <option>カスタム期間</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>職人:</label>
                        <select style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}>
                          <option>全員</option>
                          <option>山田太郎</option>
                          <option>佐藤次郎</option>
                          <option>鈴木三郎</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>作業タイプ:</label>
                        <select style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}>
                          <option>すべて</option>
                          <option>設置工事</option>
                          <option>メンテナンス</option>
                          <option>修理</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handleReportGenerate}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    レポート生成
                  </button>
                  <button 
                    onClick={() => setReportModalOpen(true)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    プレビュー
                  </button>
                  <button 
                    onClick={() => {
                      const templateName = prompt('テンプレート名を入力してください:')
                      if (templateName) {
                        showToast(`カスタムレポートテンプレート「${templateName}」を保存しました`, 'success')
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    テンプレート保存
                  </button>
                </div>
              </div>

              {/* Export Options */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  データエクスポート
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Excel形式</h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      表計算ソフトで編集可能
                    </p>
                    <button 
                      onClick={() => handleExportData('Excel')}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                      Excel出力
                    </button>
                  </div>

                  <div style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>PDF形式</h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      印刷・共有に最適
                    </p>
                    <button 
                      onClick={() => handleExportData('PDF')}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                      PDF出力
                    </button>
                  </div>

                  <div style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>グラフ付き</h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      視覚的な分析レポート
                    </p>
                    <button 
                      onClick={() => handleExportData('グラフ付きレポート')}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                      グラフ出力
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                background: '#fffbeb'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#d97706' }}>
                  📱 アプリ連携レポート
                </h3>
                <div style={{ fontSize: '14px', color: '#b45309', marginBottom: '12px' }}>
                  職人アプリからの作業報告データを自動でレポートに反映
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => syncMobileApp('レポートデータ')}
                    style={{
                      padding: '8px 16px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリデータ同期
                  </button>
                  <button 
                    onClick={() => setReportModalOpen(true)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#f59e0b',
                      border: '1px solid #f59e0b',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    写真付きレポート生成
                  </button>
                  <button 
                    onClick={() => {
                      showToast('GPS位置情報を含むレポートを生成しています...', 'info')
                      setTimeout(() => showToast('GPS位置データ込みレポートが完成しました', 'success'), 2000)
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#f59e0b',
                      border: '1px solid #f59e0b',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    GPS位置データ込み
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>権限管理</h2>
              
              {/* Permission Statistics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>15</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>総ユーザー数</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>3</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>管理者</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>8</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>職人</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>4</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>現場責任者</div>
                </div>
              </div>

              {/* Role Management */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>役割・権限設定</h3>
                  <button 
                    onClick={() => showToast('ユーザー役割の新規作成機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規役割
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {userRoles.map((role, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      background: role.active ? '#f0f9ff' : '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: role.color,
                            borderRadius: '50%'
                          }}></div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{role.name}</h4>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#6b7280',
                            background: '#f3f4f6',
                            padding: '2px 6px',
                            borderRadius: '8px'
                          }}>
                            {role.users}人
                          </span>
                        </div>
                        <div style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: role.active ? '#dcfce7' : '#f3f4f6',
                          color: role.active ? '#166534' : '#6b7280'
                        }}>
                          {role.active ? '有効' : '無効'}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '8px' }}>
                        {role.permissions.map((permission, permIdx) => (
                          <div key={permIdx} style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '2px',
                            paddingLeft: '8px',
                            position: 'relative'
                          }}>
                            <span style={{ 
                              position: 'absolute',
                              left: '0',
                              color: role.color
                            }}>•</span>
                            {permission}
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => openEditModal(role, 'role')}
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
                          onClick={() => showToast(`役割「${role.name}」の管理画面を開きます (現在${role.users}名)`, 'info')}
                          style={{
                            padding: '4px 8px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          ユーザー管理
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Management */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>ユーザー管理</h3>
                  <button 
                    onClick={() => showToast('ユーザーの新規登録機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規ユーザー
                  </button>
                </div>
                
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
                    <div>名前</div>
                    <div>メール</div>
                    <div>役割</div>
                    <div>最終ログイン</div>
                    <div>アクション</div>
                  </div>
                  
                  {users.map((user, idx) => (
                    <div key={idx} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                      padding: '8px',
                      fontSize: '13px',
                      borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: user.status === 'active' ? '#10b981' : '#6b7280',
                          borderRadius: '50%'
                        }}></div>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {user.email}
                      </div>
                      <div>
                        <span style={{ 
                          color: user.roleColor,
                          fontSize: '12px',
                          fontWeight: '500',
                          background: `${user.roleColor}20`,
                          padding: '2px 6px',
                          borderRadius: '8px'
                        }}>
                          {user.role}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {user.lastLogin}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          onClick={() => openEditModal(user, 'user')}
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
                          onClick={() => toggleUserStatus(user.id)}
                          style={{
                            padding: '4px 8px',
                            background: user.status === 'active' ? '#fef2f2' : '#dcfce7',
                            color: user.status === 'active' ? '#dc2626' : '#166534',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}>
                          {user.status === 'active' ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Control */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  アクセス制御設定
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      セキュリティ設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>2段階認証を必須にする</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>強力なパスワードを必須にする</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" />
                        <span style={{ fontSize: '13px' }}>IP制限を有効にする</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>自動ログアウト（30分）</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      機能制限
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '100px' }}>データ出力:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>管理者のみ</option>
                          <option>現場責任者以上</option>
                          <option>全員可能</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '100px' }}>設定変更:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>管理者のみ</option>
                          <option>管理者と責任者</option>
                          <option>制限なし</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '100px' }}>削除権限:</span>
                        <select style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px',
                          flex: 1
                        }}>
                          <option>管理者のみ</option>
                          <option>承認後のみ</option>
                          <option>制限なし</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Log */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  操作ログ（直近）
                </h3>
                
                <div style={{ 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 2fr 1fr 1fr',
                    background: '#f9fafb',
                    padding: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div>時刻</div>
                    <div>操作内容</div>
                    <div>ユーザー</div>
                    <div>結果</div>
                  </div>
                  
                  {[
                    { 
                      time: '10:30', 
                      action: '新規ユーザー「鈴木四郎」を追加', 
                      user: '田中管理者', 
                      result: '成功',
                      resultColor: '#10b981'
                    },
                    { 
                      time: '10:15', 
                      action: '職人「山田太郎」の権限を現場責任者に変更', 
                      user: '田中管理者', 
                      result: '成功',
                      resultColor: '#10b981'
                    },
                    { 
                      time: '09:45', 
                      action: 'データエクスポート実行（作業レポート）', 
                      user: '佐藤責任者', 
                      result: '成功',
                      resultColor: '#10b981'
                    },
                    { 
                      time: '09:30', 
                      action: 'ログイン試行（無効なパスワード）', 
                      user: '不明ユーザー', 
                      result: '失敗',
                      resultColor: '#ef4444'
                    }
                  ].map((log, idx) => (
                    <div key={idx} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 2fr 1fr 1fr',
                      padding: '8px',
                      fontSize: '13px',
                      borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontWeight: '500' }}>{log.time}</div>
                      <div style={{ fontSize: '12px' }}>{log.action}</div>
                      <div style={{ fontSize: '12px' }}>{log.user}</div>
                      <div>
                        <span style={{ 
                          color: log.resultColor,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {log.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #ef4444', 
                borderRadius: '8px',
                background: '#fef2f2'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#dc2626' }}>
                  📱 モバイルアプリ権限連携
                </h3>
                <div style={{ fontSize: '14px', color: '#b91c1c', marginBottom: '12px' }}>
                  職人アプリの権限もWebで一元管理できます
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => syncMobileApp('権限設定')}
                    style={{
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリ権限を同期
                  </button>
                  <button 
                    onClick={() => {
                      setQrData({
                        title: 'アプリ登録用QRコード',
                        data: `https://dandori-scheduler.app/register/${generateId()}`,

                        description: 'このQRコードをスキャンしてアプリに登録してください'
                      })
                      setQrModalOpen(true)
                    }}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    QRコード発行（アプリ登録用）
                  </button>
                  <button 
                    onClick={() => setAppSyncModalOpen(true)}
                    style={{
                      padding: '8px 16px',
                      background: 'white',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    アプリ利用状況確認
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar-config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>営業日設定</h2>
              
              {/* Calendar Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>22</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>今月営業日</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>6</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>休日数</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>3</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>特別営業日</div>
                </div>
                <div style={{ 
                  padding: '16px', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>176</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>年間営業時間</div>
                </div>
              </div>

              {/* Basic Working Hours */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  基本営業時間
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      平日営業時間
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <label style={{ fontSize: '13px', minWidth: '60px' }}>開始:</label>
                      <input 
                        type="time" 
                        value={businessHours.weekdayStart}
                        onChange={(e) => setBusinessHours({...businessHours, weekdayStart: e.target.value})}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                      <label style={{ fontSize: '13px', marginLeft: '16px', minWidth: '60px' }}>終了:</label>
                      <input 
                        type="time" 
                        value={businessHours.weekdayEnd}
                        onChange={(e) => setBusinessHours({...businessHours, weekdayEnd: e.target.value})}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '13px', minWidth: '60px' }}>昼休み:</label>
                      <input 
                        type="time" 
                        value={businessHours.lunchStart}
                        onChange={(e) => setBusinessHours({...businessHours, lunchStart: e.target.value})}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                      <span style={{ fontSize: '13px' }}>〜</span>
                      <input 
                        type="time" 
                        value={businessHours.lunchEnd}
                        onChange={(e) => setBusinessHours({...businessHours, lunchEnd: e.target.value})}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      週末営業設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          checked={businessHours.saturdayEnabled}
                          onChange={(e) => {
                            setBusinessHours({...businessHours, saturdayEnabled: e.target.checked})
                            showToast(e.target.checked ? '土曜日営業を有効にしました' : '土曜日営業を無効にしました', 'success')
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>土曜日営業（9:00-15:00）</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          checked={businessHours.sundayEnabled}
                          onChange={(e) => {
                            setBusinessHours({...businessHours, sundayEnabled: e.target.checked})
                            showToast(e.target.checked ? '日曜日営業を有効にしました' : '日曜日営業を無効にしました', 'success')
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>日曜日営業（緊急対応のみ）</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          checked={businessHours.holidayEnabled}
                          onChange={(e) => {
                            setBusinessHours({...businessHours, holidayEnabled: e.target.checked})
                            showToast(e.target.checked ? '祝日営業を有効にしました' : '祝日営業を無効にしました', 'success')
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>祝日営業（要相談）</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Holiday Management */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>休日・特別営業日管理</h3>
                  <button 
                    onClick={() => showToast('休日・特別営業日の新規追加機能を実装中です', 'info')}
                    style={{
                      padding: '6px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                    + 新規追加
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      定期休日
                    </h4>
                    <div style={{ 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: '#f9fafb',
                        padding: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        曜日設定
                      </div>
                      {[
                        { day: '日曜日', enabled: true, color: '#ef4444' },
                        { day: '月曜日', enabled: false, color: '#6b7280' },
                        { day: '火曜日', enabled: false, color: '#6b7280' },
                        { day: '水曜日', enabled: false, color: '#6b7280' },
                        { day: '木曜日', enabled: false, color: '#6b7280' },
                        { day: '金曜日', enabled: false, color: '#6b7280' },
                        { day: '土曜日', enabled: false, color: '#6b7280' }
                      ].map((dayConfig, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          fontSize: '13px',
                          borderBottom: idx < 6 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          <span>{dayConfig.day}</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="checkbox" 
                              checked={dayConfig.enabled}
                              style={{ transform: 'scale(0.9)' }}
                            />
                            <span style={{ 
                              fontSize: '12px',
                              color: dayConfig.enabled ? '#ef4444' : '#6b7280'
                            }}>
                              {dayConfig.enabled ? '休日' : '営業日'}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      特別日程（今月）
                    </h4>
                    <div style={{ 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        background: '#f9fafb',
                        padding: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        日付・種別
                      </div>
                      {[
                        { date: '8/24(土)', type: '特別営業', note: '大型案件対応', color: '#10b981' },
                        { date: '8/30(金)', type: '休業', note: '社員研修', color: '#ef4444' },
                        { date: '9/2(月)', type: '短縮営業', note: '9:00-15:00', color: '#f59e0b' },
                        { date: '9/23(月)', type: '祝日休業', note: '秋分の日', color: '#6b7280' }
                      ].map((special, idx) => (
                        <div key={idx} style={{ 
                          padding: '8px',
                          fontSize: '12px',
                          borderBottom: idx < 3 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <span style={{ fontWeight: '500' }}>{special.date}</span>
                            <span style={{ 
                              color: special.color,
                              background: `${special.color}20`,
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '11px'
                            }}>
                              {special.type}
                            </span>
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '11px' }}>
                            {special.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seasonal Schedule */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  季節別営業スケジュール
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { 
                      season: '夏季（6-8月）', 
                      schedule: '6:00-15:00', 
                      note: '暑さ対策で早朝開始',
                      active: true,
                      color: '#ef4444'
                    },
                    { 
                      season: '冬季（12-2月）', 
                      schedule: '9:00-18:00', 
                      note: '暖房需要により延長',
                      active: true,
                      color: '#3b82f6'
                    },
                    { 
                      season: '春季（3-5月）', 
                      schedule: '8:00-17:00', 
                      note: '通常営業時間',
                      active: false,
                      color: '#10b981'
                    },
                    { 
                      season: '秋季（9-11月）', 
                      schedule: '8:00-17:00', 
                      note: '通常営業時間',
                      active: false,
                      color: '#f59e0b'
                    }
                  ].map((season, idx) => (
                    <div key={idx} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      background: season.active ? '#f0f9ff' : '#f9fafb'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: season.color,
                            borderRadius: '50%'
                          }}></div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{season.season}</h4>
                        </div>
                        <div style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          background: season.active ? '#dcfce7' : '#f3f4f6',
                          color: season.active ? '#166534' : '#6b7280'
                        }}>
                          {season.active ? '適用中' : '停止中'}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                        🕐 {season.schedule}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                        {season.note}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button style={{
                          padding: '4px 8px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}>
                          編集
                        </button>
                        <button style={{
                          padding: '4px 8px',
                          background: season.active ? '#fef2f2' : '#dcfce7',
                          color: season.active ? '#dc2626' : '#166534',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}>
                          {season.active ? '無効化' : '有効化'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Settings */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px' 
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  緊急対応設定
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      24時間対応
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>緊急修理（エアコン故障）</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" defaultChecked />
                        <span style={{ fontSize: '13px' }}>水漏れ・電気トラブル</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" />
                        <span style={{ fontSize: '13px' }}>定期メンテナンス</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      割増料金設定
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>夜間:</span>
                        <input 
                          type="number" 
                          defaultValue="150"
                          style={{
                            width: '60px',
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>休日:</span>
                        <input 
                          type="number" 
                          defaultValue="200"
                          style={{
                            width: '60px',
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', minWidth: '80px' }}>緊急:</span>
                        <input 
                          type="number" 
                          defaultValue="300"
                          style={{
                            width: '60px',
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}
                        />
                        <span style={{ fontSize: '13px' }}>%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App Integration */}
              <div style={{ 
                padding: '16px', 
                border: '1px solid #16a34a', 
                borderRadius: '8px',
                background: '#f0fdf4'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#15803d' }}>
                  📱 アプリカレンダー連携
                </h3>
                <div style={{ fontSize: '14px', color: '#166534', marginBottom: '12px' }}>
                  営業時間・休日設定が職人アプリに自動で反映されます
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    アプリに設定を同期
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#16a34a',
                    border: '1px solid #16a34a',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    カレンダー出力
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: '#16a34a',
                    border: '1px solid #16a34a',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}>
                    Google Calendar連携
                  </button>
                </div>
              </div>
            </div>
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