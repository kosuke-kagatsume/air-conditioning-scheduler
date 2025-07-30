'use client'

import { useState } from 'react'

interface EventModalProps {
  onClose: () => void
}

export default function EventModal({ onClose }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    jobSite: '',
    date: '',
    startTime: '',
    endTime: '',
    allDay: false,
    label: '',
    assignees: [] as string[],
    description: ''
  })

  const jobSites = [
    { id: '1', name: 'オフィスビルA', address: '東京都渋谷区' },
    { id: '2', name: 'マンションB', address: '東京都新宿区' },
    { id: '3', name: '商業施設C', address: '東京都港区' }
  ]

  const labels = [
    { id: '1', name: '新規設置', color: '#667eea' },
    { id: '2', name: 'メンテナンス', color: '#f59e0b' },
    { id: '3', name: '緊急対応', color: '#ef4444' },
    { id: '4', name: '定期点検', color: '#10b981' }
  ]

  const workers = [
    { id: '1', name: '佐藤職人', available: 2 },
    { id: '2', name: '田中職人', available: 1 },
    { id: '3', name: '鈴木職人', available: 3 },
    { id: '4', name: '高橋職人', available: 0 }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">新規予定作成</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">タイトル *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="作業内容を入力"
              required
            />
          </div>

          {/* Job Site */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">現場 *</label>
            <select
              value={formData.jobSite}
              onChange={(e) => setFormData({ ...formData, jobSite: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              required
            >
              <option value="">選択してください</option>
              {jobSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} - {site.address}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">日時 *</label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="allDay" className="text-sm">終日</label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
                {!formData.allDay && (
                  <>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                      required
                    />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                      required
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">ラベル *</label>
            <div className="grid grid-cols-2 gap-3">
              {labels.map((label) => (
                <label
                  key={label.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.label === label.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="label"
                    value={label.id}
                    checked={formData.label === label.id}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="sr-only"
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <span className="text-sm">{label.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">担当職人</label>
            <div className="space-y-2">
              {workers.map((worker) => (
                <label
                  key={worker.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.assignees.includes(worker.id)
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  } ${worker.available === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={worker.id}
                      checked={formData.assignees.includes(worker.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, assignees: [...formData.assignees, worker.id] })
                        } else {
                          setFormData({ ...formData, assignees: formData.assignees.filter(id => id !== worker.id) })
                        }
                      }}
                      disabled={worker.available === 0}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{worker.name}</span>
                  </div>
                  <span className={`text-sm ${worker.available === 0 ? 'text-red-500' : 'text-green-500'}`}>
                    空き枠: {worker.available}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">備考</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              rows={3}
              placeholder="特記事項があれば入力"
            />
          </div>
        </form>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            キャンセル
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-primary"
          >
            作成して提案
          </button>
        </div>
      </div>
    </div>
  )
}