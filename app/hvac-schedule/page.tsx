'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import PageHeader from '@/components/LogoHeader'
import { NotificationIcon, UserIcon } from '@/components/Icons'
import { 
  loadHVACSchedules, 
  saveHVACSchedules, 
  exportHVACSchedules, 
  importHVACSchedules,
  HVACSchedule 
} from '@/lib/storage'

const MODE_LABELS = {
  cool: '冷房',
  heat: '暖房',
  dry: 'ドライ',
  fan: '送風',
  auto: '自動'
}

const FAN_SPEED_LABELS = {
  low: '弱',
  medium: '中',
  high: '強',
  auto: '自動'
}

const DAYS_OF_WEEK = [
  { value: 0, label: '日', color: 'text-red-600' },
  { value: 1, label: '月', color: '' },
  { value: 2, label: '火', color: '' },
  { value: 3, label: '水', color: '' },
  { value: 4, label: '木', color: '' },
  { value: 5, label: '金', color: '' },
  { value: 6, label: '土', color: 'text-blue-600' }
]

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
)

function HVACScheduleContent() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<HVACSchedule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<HVACSchedule | null>(null)
  const [selectedSite, setSelectedSite] = useState('site1')
  const [isLoading, setIsLoading] = useState(true)

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    time: '09:00',
    temperature: 24,
    mode: 'cool' as HVACSchedule['mode'],
    fanSpeed: 'auto' as HVACSchedule['fanSpeed'],
    enabled: true,
    days: [] as number[]
  })

  // localStorage からデータを読み込み
  useEffect(() => {
    const loaded = loadHVACSchedules()
    setSchedules(loaded)
    setIsLoading(false)
  }, [])

  // スケジュールが変更されたら保存
  useEffect(() => {
    if (!isLoading) {
      saveHVACSchedules(schedules)
    }
  }, [schedules, isLoading])

  const handleAddSchedule = () => {
    if (formData.days.length === 0) {
      alert('少なくとも1つの曜日を選択してください')
      return
    }

    const now = new Date().toISOString()
    const newSchedule: HVACSchedule = {
      id: Date.now().toString(),
      name: formData.name || undefined,
      siteId: selectedSite,
      siteName: selectedSite === 'site1' ? '第1現場' : '第2現場',
      date: new Date().toISOString().split('T')[0],
      time: formData.time,
      temperature: formData.temperature,
      mode: formData.mode,
      fanSpeed: formData.fanSpeed,
      enabled: formData.enabled,
      days: formData.days,
      createdAt: now,
      updatedAt: now,
      createdBy: user?.name
    }

    if (selectedSchedule) {
      // 編集モード
      setSchedules(schedules.map(s => 
        s.id === selectedSchedule.id 
          ? { ...newSchedule, id: selectedSchedule.id, createdAt: selectedSchedule.createdAt }
          : s
      ))
    } else {
      // 新規作成
      setSchedules([...schedules, newSchedule])
    }

    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      time: '09:00',
      temperature: 24,
      mode: 'cool',
      fanSpeed: 'auto',
      enabled: true,
      days: []
    })
    setSelectedSchedule(null)
  }

  const handleEdit = (schedule: HVACSchedule) => {
    setSelectedSchedule(schedule)
    setFormData({
      name: schedule.name || '',
      time: schedule.time,
      temperature: schedule.temperature,
      mode: schedule.mode,
      fanSpeed: schedule.fanSpeed,
      enabled: schedule.enabled,
      days: schedule.days
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('このスケジュールを削除しますか？')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  const handleToggle = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id 
        ? { ...s, enabled: !s.enabled, updatedAt: new Date().toISOString() }
        : s
    ))
  }

  const handleDuplicate = (schedule: HVACSchedule) => {
    const now = new Date().toISOString()
    const newSchedule: HVACSchedule = {
      ...schedule,
      id: Date.now().toString(),
      name: schedule.name ? `${schedule.name} (コピー)` : undefined,
      createdAt: now,
      updatedAt: now
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleExport = () => {
    exportHVACSchedules(schedules)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imported = await importHVACSchedules(file)
        setSchedules(imported)
        alert('スケジュールをインポートしました')
      } catch {
        alert('インポートに失敗しました')
      }
    }
  }

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }))
  }

  const filteredSchedules = schedules.filter(s => 
    selectedSite === 'all' || s.siteId === selectedSite
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <PageHeader href="/demo" size={36} showText={false} />
              <h1 className="text-2xl font-bold text-gray-900">空調スケジュール管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="w-6 h-6 text-gray-600">
                  <NotificationIcon />
                </span>
              </Link>
              <div className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="w-6 h-6 text-gray-600">
                  <UserIcon />
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto p-6">
          {/* ツールバー */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">全現場</option>
                  <option value="site1">第1現場</option>
                  <option value="site2">第2現場</option>
                </select>

                <button
                  onClick={handleExport}
                  disabled={schedules.length === 0}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  エクスポート
                </button>

                <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                  インポート
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={() => {
                  resetForm()
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                新規スケジュール
              </button>
            </div>
          </div>

          {/* カレンダービュー */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3 text-left font-medium text-gray-700">時間</th>
                    {DAYS_OF_WEEK.map(day => (
                      <th key={day.value} className={`p-3 text-center font-medium ${day.color}`}>
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(time => (
                    <tr key={time} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-700">{time}</td>
                      {DAYS_OF_WEEK.map(day => {
                        const schedule = filteredSchedules.find(s => 
                          s.time === time && s.days.includes(day.value)
                        )
                        return (
                          <td key={day.value} className="p-2">
                            {schedule && (
                              <div className={`p-2 rounded text-xs ${
                                schedule.enabled 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                <div className="font-semibold">
                                  {schedule.name || `${schedule.temperature}°C`}
                                </div>
                                <div>{MODE_LABELS[schedule.mode]}</div>
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => handleToggle(schedule.id)}
                                    className="text-xs hover:underline"
                                  >
                                    {schedule.enabled ? 'ON' : 'OFF'}
                                  </button>
                                  <button
                                    onClick={() => handleEdit(schedule)}
                                    className="text-xs hover:underline"
                                  >
                                    編集
                                  </button>
                                  <button
                                    onClick={() => handleDuplicate(schedule)}
                                    className="text-xs hover:underline"
                                  >
                                    複製
                                  </button>
                                  <button
                                    onClick={() => handleDelete(schedule.id)}
                                    className="text-xs text-red-600 hover:underline"
                                  >
                                    削除
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">スケジュールがありません</p>
              <p className="text-gray-400 text-sm mt-2">
                「新規スケジュール」ボタンから作成してください
              </p>
            </div>
          )}
        </main>
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedSchedule ? 'スケジュール編集' : '新規スケジュール'}
            </h2>

            <div className="space-y-4">
              {/* スケジュール名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  スケジュール名（オプション）
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例：朝の準備、夜の就寝時"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* 曜日選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  曜日
                </label>
                <div className="flex gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-2 rounded-lg border-2 ${
                        formData.days.includes(day.value)
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300'
                      } ${day.color}`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 時刻 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  時刻
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {TIME_SLOTS.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* 温度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  設定温度: {formData.temperature}°C
                </label>
                <input
                  type="range"
                  min="16"
                  max="32"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* 運転モード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  運転モード
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value as HVACSchedule['mode'] })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {Object.entries(MODE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 風量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  風量
                </label>
                <select
                  value={formData.fanSpeed}
                  onChange={(e) => setFormData({ ...formData, fanSpeed: e.target.value as HVACSchedule['fanSpeed'] })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {Object.entries(FAN_SPEED_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 有効/無効 */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                  スケジュールを有効にする
                </label>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {selectedSchedule ? '更新' : '作成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HVACSchedulePage() {
  return (
    <>
      <HVACScheduleContent />
    </>
  )
}