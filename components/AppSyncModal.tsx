'use client'

import { useState } from 'react'
import Modal from './Modal'
import { Smartphone, Wifi, CheckCircle, AlertCircle, Users, Clock, TrendingUp } from 'lucide-react'

interface AppSyncModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppSyncModal({ isOpen, onClose }: AppSyncModalProps) {
  const [syncMode, setSyncMode] = useState<'auto' | 'manual'>('auto')
  const [syncInterval, setSyncInterval] = useState('5')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enablePhotoSync, setEnablePhotoSync] = useState(true)
  
  const appStats = {
    activeUsers: 12,
    todayLogins: 8,
    version: 'v2.1.3',
    avgUsageTime: '4.2時間/日',
    lastSync: '2分前',
    pendingSync: 3
  }

  const handleSave = () => {
    // Here would be the actual save logic
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="モバイルアプリ同期設定" size="lg">
      <div className="space-y-6">
        {/* 同期ステータス */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wifi className="text-blue-600" size={20} />
              <span className="font-semibold text-gray-800">同期ステータス</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">接続中</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">最終同期:</span>
              <span className="ml-2 font-medium">{appStats.lastSync}</span>
            </div>
            <div>
              <span className="text-gray-600">保留中:</span>
              <span className="ml-2 font-medium">{appStats.pendingSync}件</span>
            </div>
          </div>
        </div>

        {/* アプリ利用状況 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users size={18} />
            アプリ利用状況
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">アクティブユーザー:</span>
              <span className="font-medium">{appStats.activeUsers}名</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">今日のログイン:</span>
              <span className="font-medium">{appStats.todayLogins}名</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">最新バージョン:</span>
              <span className="font-medium">{appStats.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平均利用時間:</span>
              <span className="font-medium">{appStats.avgUsageTime}</span>
            </div>
          </div>
        </div>

        {/* 同期設定 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">同期設定</h3>
          
          {/* 同期モード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">同期モード</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSyncMode('auto')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  syncMode === 'auto' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} className={syncMode === 'auto' ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-medium">自動同期</span>
                </div>
                <p className="text-xs text-gray-600">変更を自動的にアプリに反映</p>
              </button>
              
              <button
                onClick={() => setSyncMode('manual')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  syncMode === 'manual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className={syncMode === 'manual' ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-medium">手動確認</span>
                </div>
                <p className="text-xs text-gray-600">管理者確認後に反映</p>
              </button>
            </div>
          </div>

          {/* 同期間隔 */}
          {syncMode === 'auto' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自動同期間隔
              </label>
              <select
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1分ごと</option>
                <option value="5">5分ごと</option>
                <option value="10">10分ごと</option>
                <option value="30">30分ごと</option>
                <option value="60">1時間ごと</option>
              </select>
            </div>
          )}

          {/* 通知設定 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">通知設定</label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                新しいスケジュールを自動通知
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enablePhotoSync}
                onChange={(e) => setEnablePhotoSync(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                写真の自動同期を有効化
              </span>
            </label>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <button
            onClick={() => {
              // Trigger manual sync
              console.log('Manual sync triggered')
            }}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Wifi size={16} />
            今すぐ同期
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}