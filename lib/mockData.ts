import { User, Event, Notification, WorkerCapacity, Tenant, DashboardData } from '@/types'

// テナント（元請会社）データ
export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: '東京空調システム株式会社',
    logo: '/logo1.png',
    settings: {
      customFields: [
        { id: 'cf1', name: '設置台数', type: 'number', required: true, order: 1 },
        { id: 'cf2', name: 'ダンドリワークURL', type: 'url', required: false, order: 2 },
        { id: 'cf3', name: '納品先', type: 'text', required: false, order: 3 },
        { id: 'cf4', name: '物流センター', type: 'select', options: ['東京DC', '埼玉DC', '千葉DC'], required: false, order: 4 },
        { id: 'cf5', name: '特記事項', type: 'text', required: false, order: 5 }
      ],
      constructionTypes: ['エアコン新設', 'エアコン交換', '点検・メンテナンス', '修理', '配管工事', '撤去'],
      troubleTypes: ['施工遅延', '部材不足', '顧客クレーム', '品質問題', '安全問題'],
      timeSlotType: 'three',
      timeSlots: [
        { id: 'ts1', name: '午前', startTime: '08:00', endTime: '12:00' },
        { id: 'ts2', name: '午後', startTime: '13:00', endTime: '17:00' },
        { id: 'ts3', name: '夜間', startTime: '18:00', endTime: '21:00' }
      ],
      archivePeriod: 12,
      defaultView: 'month'
    }
  },
  {
    id: 'tenant-2',
    name: '関西エアテック株式会社',
    logo: '/logo2.png',
    settings: {
      customFields: [
        { id: 'cf1', name: '機器型番', type: 'text', required: true, order: 1 },
        { id: 'cf2', name: '保証期間', type: 'date', required: false, order: 2 }
      ],
      constructionTypes: ['エアコン設置', '定期点検', '緊急修理'],
      troubleTypes: ['遅延', 'クレーム', '事故'],
      timeSlotType: 'two',
      timeSlots: [
        { id: 'ts1', name: 'AM', startTime: '09:00', endTime: '12:00' },
        { id: 'ts2', name: 'PM', startTime: '13:00', endTime: '18:00' }
      ],
      archivePeriod: 24,
      defaultView: 'week'
    }
  }
]

// ユーザー（管理者・職人）データ
export const mockUsers: User[] = [
  // 管理者側
  {
    id: 'user-admin',
    name: '山田太郎',
    email: 'admin@hvac.jp',
    role: 'admin',
    tenantId: 'tenant-1',
    phoneNumber: '090-1234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: 'user-manager1',
    name: '佐藤花子',
    email: 'sato@hvac.jp',
    role: 'manager1',
    tenantId: 'tenant-1',
    phoneNumber: '090-2345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sato'
  },
  {
    id: 'user-staff1',
    name: '鈴木一郎',
    email: 'suzuki@hvac.jp',
    role: 'staff',
    tenantId: 'tenant-1',
    phoneNumber: '090-3456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki'
  },
  // 職人側
  {
    id: 'worker-master1',
    name: '田中親方',
    email: 'tanaka@worker.jp',
    role: 'master',
    tenantId: 'tenant-1',
    tenants: [mockTenants[0], mockTenants[1]],
    phoneNumber: '090-4567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka'
  },
  {
    id: 'worker-1',
    name: '高橋次郎',
    email: 'takahashi@worker.jp',
    role: 'worker',
    tenantId: 'tenant-1',
    parentId: 'worker-master1',
    phoneNumber: '090-5678-9012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=takahashi'
  },
  {
    id: 'worker-2',
    name: '伊藤三郎',
    email: 'ito@worker.jp',
    role: 'worker',
    tenantId: 'tenant-1',
    parentId: 'worker-master1',
    phoneNumber: '090-6789-0123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ito'
  }
]

// 現在の日付を基準に予定を生成
const today = new Date()
const getDateStr = (daysOffset: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

// 予定データ
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'エアコン新設工事',
    date: getDateStr(0),
    startTime: '09:00',
    endTime: '12:00',
    status: 'accepted',
    address: '東京都渋谷区渋谷1-1-1',
    city: '渋谷区',
    constructionType: 'エアコン新設',
    description: '2階建て住宅、3台設置',
    clientName: '山田様',
    constructorName: 'ABCホーム',
    salesPersons: [
      { id: 'sp1', name: '営業田中', role: 'main' },
      { id: 'sp2', name: '営業佐藤', role: 'sub' }
    ],
    workerId: 'worker-1',
    workerName: '高橋次郎',
    createdBy: 'user-staff1',
    tenantId: 'tenant-1',
    customFieldValues: {
      cf1: 3,
      cf2: 'https://dandori-work.com/project/123',
      cf3: '現地直送',
      cf4: '東京DC'
    },
    timeSlotIds: ['ts1'],
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z'
  },
  {
    id: 'event-2',
    title: '定期メンテナンス',
    date: getDateStr(1),
    startTime: '13:00',
    endTime: '15:00',
    status: 'proposed',
    address: '東京都新宿区西新宿2-2-2',
    city: '新宿区',
    constructionType: '点検・メンテナンス',
    clientName: '佐藤様',
    constructorName: 'XYZ建設',
    salesPersons: [
      { id: 'sp1', name: '営業田中', role: 'main' }
    ],
    workerId: 'worker-2',
    workerName: '伊藤三郎',
    createdBy: 'user-staff1',
    tenantId: 'tenant-1',
    timeSlotIds: ['ts2'],
    createdAt: '2025-01-02T09:00:00Z',
    updatedAt: '2025-01-02T09:00:00Z'
  },
  {
    id: 'event-3',
    title: '緊急修理対応',
    date: getDateStr(0),
    startTime: '14:00',
    endTime: '16:00',
    status: 'accepted',
    address: '東京都港区六本木3-3-3',
    city: '港区',
    constructionType: '修理',
    clientName: '鈴木様',
    constructorName: 'DEF工務店',
    salesPersons: [
      { id: 'sp3', name: '営業高橋', role: 'main' }
    ],
    workerId: 'worker-master1',
    workerName: '田中親方',
    createdBy: 'user-manager1',
    tenantId: 'tenant-1',
    trouble: {
      id: 'trouble-1',
      type: '顧客クレーム',
      description: 'エアコンから異音',
      status: 'open',
      reportedAt: '2025-01-07T10:00:00Z'
    },
    timeSlotIds: ['ts2'],
    createdAt: '2025-01-07T10:30:00Z',
    updatedAt: '2025-01-07T10:30:00Z'
  },
  {
    id: 'event-4',
    title: 'エアコン交換工事',
    date: getDateStr(2),
    startTime: '09:00',
    endTime: '17:00',
    status: 'pending',
    address: '東京都豊島区池袋4-4-4',
    city: '豊島区',
    constructionType: 'エアコン交換',
    description: '古いエアコン3台を最新機種に交換',
    clientName: '田中様',
    constructorName: 'GHI建築',
    salesPersons: [
      { id: 'sp1', name: '営業田中', role: 'main' },
      { id: 'sp4', name: '営業渡辺', role: 'support' }
    ],
    workerId: 'worker-1',
    workerName: '高橋次郎',
    createdBy: 'user-staff1',
    tenantId: 'tenant-1',
    customFieldValues: {
      cf1: 3,
      cf3: '事前に連絡必要'
    },
    negotiation: {
      id: 'nego-1',
      type: 'conflict',
      message: 'この日は別の予定が入っていますが、調整可能でしょうか？',
      status: 'pending',
      createdAt: '2025-01-06T15:00:00Z'
    },
    timeSlotIds: ['ts1', 'ts2'],
    createdAt: '2025-01-06T14:00:00Z',
    updatedAt: '2025-01-06T15:00:00Z'
  },
  {
    id: 'event-5',
    title: '配管工事',
    date: getDateStr(7),
    startTime: '10:00',
    endTime: '14:00',
    status: 'accepted',
    address: '東京都江東区豊洲5-5-5',
    city: '江東区',
    constructionType: '配管工事',
    clientName: '高橋様',
    constructorName: 'JKL工業',
    salesPersons: [
      { id: 'sp2', name: '営業佐藤', role: 'main' }
    ],
    workerId: 'worker-2',
    workerName: '伊藤三郎',
    createdBy: 'user-staff1',
    tenantId: 'tenant-1',
    timeSlotIds: ['ts1', 'ts2'],
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T09:00:00Z'
  }
]

// 職人枠数設定
export const mockWorkerCapacities: WorkerCapacity[] = [
  {
    workerId: 'worker-master1',
    baseCapacity: 3,
    weekdayCapacities: {
      0: 0, // 日曜日は休み
      6: 2  // 土曜日は2件まで
    },
    specificDates: {
      '2025-01-01': 0, // 元旦は休み
      '2025-12-31': 0  // 大晦日は休み
    },
    timeSlotCapacities: {
      'ts1': 2,
      'ts2': 2,
      'ts3': 1
    }
  },
  {
    workerId: 'worker-1',
    baseCapacity: 2,
    weekdayCapacities: {
      0: 0,
      6: 1
    },
    timeSlotCapacities: {
      'ts1': 1,
      'ts2': 1,
      'ts3': 0
    }
  },
  {
    workerId: 'worker-2',
    baseCapacity: 2,
    timeSlotCapacities: {
      'ts1': 1,
      'ts2': 1,
      'ts3': 1
    }
  }
]

// 通知データ
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'worker-1',
    type: 'event_created',
    priority: 'normal',
    title: '新しい予定の提案',
    message: '1月9日(木) 9:00-17:00 エアコン交換工事の予定が提案されました',
    relatedEventId: 'event-4',
    read: false,
    createdAt: '2025-01-06T15:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-staff1',
    type: 'response_required',
    priority: 'high',
    title: '保留中の予定があります',
    message: '田中親方から保留の回答があります。3日以内に対応が必要です。',
    relatedEventId: 'event-4',
    read: false,
    createdAt: '2025-01-06T16:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'worker-master1',
    type: 'reminder',
    priority: 'normal',
    title: '明日の予定',
    message: '明日14:00から緊急修理対応があります',
    relatedEventId: 'event-3',
    read: true,
    createdAt: '2025-01-06T18:00:00Z'
  }
]

// ダッシュボードデータ
export const mockDashboardData: DashboardData = {
  totalEvents: 156,
  completedEvents: 142,
  troubleCount: 3,
  troubleTarget: 10,
  installCount: 89,
  installTarget: 1000,
  eventsByType: {
    'エアコン新設': 45,
    'エアコン交換': 28,
    '点検・メンテナンス': 38,
    '修理': 25,
    '配管工事': 15,
    '撤去': 5
  },
  eventsByWorker: {
    '田中親方': 52,
    '高橋次郎': 48,
    '伊藤三郎': 42,
    '山田四郎': 14
  },
  monthlyTrend: [
    { month: '10月', count: 23 },
    { month: '11月', count: 28 },
    { month: '12月', count: 31 },
    { month: '1月', count: 5 }
  ]
}