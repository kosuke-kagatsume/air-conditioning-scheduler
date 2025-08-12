import { Event, EventStatus, SalesPerson } from '@/types'

// 現在の日付を基準に設定
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDate = today.getDate()

// 月ごとの日付配列を生成
const generateMonthDates = (monthOffset: number) => {
  const dates: string[] = []
  const targetMonth = currentMonth + monthOffset
  const targetYear = currentYear + Math.floor(targetMonth / 12)
  const month = targetMonth % 12
  
  const daysInMonth = new Date(targetYear, month + 1, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(targetYear, month, day)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// ステータスの分布
const statusDistribution: EventStatus[] = [
  'pending', 'pending', 'pending', // 30% 提案中
  'accepted', 'accepted', 'accepted', 'accepted', // 40% 承認済み
  'completed', 'completed', // 20% 完了
  'onHold', // 10% 保留
  'rejected', // 少数の却下
  'cancelled' // 少数のキャンセル
]

// 工事種別
const constructionTypes = [
  'エアコン新設', 'エアコン新設', 'エアコン新設', // 多め
  'エアコン交換', 'エアコン交換',
  '点検・メンテナンス', '点検・メンテナンス',
  '修理', '修理',
  '配管工事',
  '撤去'
]

// 地域
const areas = [
  { city: '渋谷区', addresses: ['神南', '道玄坂', '宇田川町', '桜丘町', '南平台町'] },
  { city: '新宿区', addresses: ['西新宿', '歌舞伎町', '新宿', '高田馬場', '四谷'] },
  { city: '港区', addresses: ['六本木', '赤坂', '青山', '麻布', '白金'] },
  { city: '千代田区', addresses: ['丸の内', '大手町', '神田', '秋葉原', '九段'] },
  { city: '中央区', addresses: ['銀座', '日本橋', '築地', '月島', '八重洲'] },
  { city: '品川区', addresses: ['大崎', '五反田', '大井町', '戸越', '旗の台'] },
  { city: '目黒区', addresses: ['中目黒', '自由が丘', '学芸大学', '都立大学', '祐天寺'] },
  { city: '世田谷区', addresses: ['三軒茶屋', '下北沢', '成城', '二子玉川', '用賀'] }
]

// 顧客名リスト
const clientNames = [
  'ABCマンション', 'XYZビル', '山田様', '佐藤様', '鈴木様', '田中様', '高橋様',
  '伊藤様', '渡辺様', '中村様', '小林様', '加藤様', '吉田様', '山本様', '森様',
  '東京タワーマンション', 'グリーンヒルズ', 'サンシャインビル', 'オーシャンビュー',
  'パークサイドレジデンス', 'リバーサイドコート', 'ガーデンプレイス', 'スカイビュー'
]

// 業者名リスト  
const constructorNames = [
  '東京建設', '関東工務店', '首都圏建築', 'スーパーゼネコン', 'ABCホーム',
  'XYZ建設', 'グリーン建築', 'エコ建設', 'スマート工務店', 'モダン建築',
  '令和建設', '未来工務店', 'テクノ建設', 'デジタル建築', 'イノベーション工務店'
]

// 営業担当者リスト
const salesPersonsList = [
  '山田太郎', '佐藤花子', '鈴木一郎', '田中美香', '高橋健太',
  '伊藤さくら', '渡辺大輔', '中村愛', '小林翔', '加藤由美'
]

// 職人リスト
const workers = [
  { id: 'worker-master1', name: '田中親方' },
  { id: 'worker-1', name: '高橋次郎' },
  { id: 'worker-2', name: '伊藤三郎' },
  { id: 'worker-3', name: '山田四郎' },
  { id: 'worker-4', name: '佐藤五郎' }
]

// 時間帯
const timeSlots = [
  { start: '08:00', end: '12:00', slotId: 'ts1' },
  { start: '09:00', end: '12:00', slotId: 'ts1' },
  { start: '13:00', end: '17:00', slotId: 'ts2' },
  { start: '14:00', end: '17:00', slotId: 'ts2' },
  { start: '18:00', end: '21:00', slotId: 'ts3' }
]

// イベント生成関数
const generateEvent = (id: string, date: string, index: number): Event => {
  const status = statusDistribution[Math.floor(Math.random() * statusDistribution.length)]
  const constructionType = constructionTypes[Math.floor(Math.random() * constructionTypes.length)]
  const area = areas[Math.floor(Math.random() * areas.length)]
  const address = area.addresses[Math.floor(Math.random() * area.addresses.length)]
  const clientName = clientNames[Math.floor(Math.random() * clientNames.length)]
  const constructorName = constructorNames[Math.floor(Math.random() * constructorNames.length)]
  const worker = workers[Math.floor(Math.random() * workers.length)]
  const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)]
  const salesPerson = salesPersonsList[Math.floor(Math.random() * salesPersonsList.length)]
  
  const event: Event = {
    id,
    title: `${constructionType} - ${clientName}`,
    date,
    startTime: timeSlot.start,
    endTime: timeSlot.end,
    status,
    address: `東京都${area.city}${address}${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 20) + 1}-${Math.floor(Math.random() * 10) + 1}`,
    city: area.city,
    constructionType,
    description: generateDescription(constructionType, status),
    clientName,
    constructorName,
    salesPersons: [
      { 
        id: `sp-${index}`, 
        name: salesPerson, 
        role: 'main' as SalesPerson['role'] 
      }
    ],
    workerId: worker.id,
    workerName: worker.name,
    createdBy: 'user-staff1',
    tenantId: 'tenant-1',
    customFieldValues: {
      cf1: Math.floor(Math.random() * 5) + 1, // 設置台数
      cf2: Math.random() > 0.5 ? `https://dandori.example.com/work/${id}` : undefined,
      cf3: generateDeliveryNote(constructionType),
      cf4: ['東京DC', '埼玉DC', '千葉DC'][Math.floor(Math.random() * 3)],
      cf5: generateSpecialNote(status)
    },
    timeSlotIds: [timeSlot.slotId],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
  }
  
  // ランダムでトラブルや交渉を追加
  if (Math.random() > 0.85) {
    event.trouble = {
      id: `trouble-${id}`,
      type: ['施工遅延', '部材不足', '顧客クレーム', '品質問題', '安全問題'][Math.floor(Math.random() * 5)],
      description: generateTroubleDescription(),
      status: Math.random() > 0.5 ? 'open' : 'resolved',
      reportedAt: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
      resolvedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined
    }
  }
  
  if (status === 'onHold' || Math.random() > 0.9) {
    event.negotiation = {
      id: `nego-${id}`,
      type: ['conflict', 'cancel', 'change'][Math.floor(Math.random() * 3)] as 'conflict' | 'cancel' | 'change',
      message: generateNegotiationMessage(),
      status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'accepted' | 'rejected',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
    }
  }
  
  return event
}

// 説明文生成
const generateDescription = (constructionType: string, status: EventStatus): string => {
  const descriptions: Record<string, string[]> = {
    'エアコン新設': [
      '新規エアコン設置工事（配管工事含む）',
      '2階建て住宅への新規エアコン設置',
      'オフィスビルへの業務用エアコン設置',
      'マンション全室エアコン新設工事'
    ],
    'エアコン交換': [
      '老朽化したエアコンの交換作業',
      '省エネタイプへの交換工事',
      '故障エアコンの緊急交換',
      '全館エアコンリニューアル工事'
    ],
    '点検・メンテナンス': [
      '定期点検およびフィルター清掃',
      '年次メンテナンス作業',
      'ガス漏れチェックおよび補充',
      '総合点検および性能測定'
    ],
    '修理': [
      '冷房が効かない症状の修理',
      '異音発生の原因調査と修理',
      '水漏れ修理および配管チェック',
      'コンプレッサー交換修理'
    ],
    '配管工事': [
      '配管延長工事',
      '配管ルート変更工事',
      '配管カバー取り付け',
      'ドレン配管の新設'
    ],
    '撤去': [
      '不要エアコンの撤去作業',
      '建物解体前のエアコン撤去',
      '全館エアコン撤去工事',
      'リフォーム前の既存エアコン撤去'
    ]
  }
  
  const desc = descriptions[constructionType] || ['標準作業']
  const base = desc[Math.floor(Math.random() * desc.length)]
  
  if (status === 'completed') {
    return `${base}（作業完了）`
  } else if (status === 'cancelled') {
    return `${base}（キャンセル済み）`
  } else if (status === 'onHold') {
    return `${base}（調整中）`
  }
  
  return base
}

// 納品先メモ生成
const generateDeliveryNote = (constructionType: string): string => {
  if (constructionType === 'エアコン新設' || constructionType === 'エアコン交換') {
    const notes = [
      '1階エントランスで受取',
      '管理人室経由',
      '裏口から搬入',
      '事前連絡必須',
      'エレベーター使用可',
      '階段のみ',
      '土日のみ搬入可'
    ]
    return notes[Math.floor(Math.random() * notes.length)]
  }
  return ''
}

// 特記事項生成
const generateSpecialNote = (status: EventStatus): string => {
  const notes: Record<string, string[]> = {
    'pending': ['顧客確認待ち', '見積もり提出済み', '日程調整中', ''],
    'accepted': ['作業確定', '部材手配済み', '顧客了承済み', ''],
    'completed': ['作業完了確認済み', '請求書発行済み', 'アフターフォロー済み', ''],
    'onHold': ['日程再調整中', '部材待ち', '顧客都合により保留', '他業者調整待ち'],
    'rejected': ['顧客都合によりキャンセル', '見積もり不承認', '日程合わず', ''],
    'cancelled': ['天候不良により中止', '顧客都合', '部材調達不可', '']
  }
  
  const noteList = notes[status] || ['']
  return noteList[Math.floor(Math.random() * noteList.length)]
}

// トラブル説明生成
const generateTroubleDescription = (): string => {
  const descriptions = [
    '部材の在庫切れにより作業遅延',
    '既存配管の老朽化により追加工事必要',
    '騒音に関する近隣からのクレーム',
    '設置場所の変更要望',
    '追加料金に関する相談',
    '作業時間超過',
    '駐車場確保困難',
    '天候不良による作業中断'
  ]
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

// 交渉メッセージ生成
const generateNegotiationMessage = (): string => {
  const messages = [
    '別の日程への変更をお願いしたいです',
    '午前中の作業を午後に変更できますか？',
    '他の現場と時間が重なってしまいました',
    '部材の到着が遅れているため延期をお願いします',
    '顧客の都合により日程変更の依頼がありました',
    '作業人員の調整がつかないため保留させてください'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

// メインのイベント生成
export const generateExtendedMockEvents = (): Event[] => {
  const events: Event[] = []
  let eventId = 1
  
  // 今月のイベント（20件）
  const currentMonthDates = generateMonthDates(0)
  const currentMonthTargetDates = currentMonthDates.slice(currentDate - 1, currentDate + 19)
  for (let i = 0; i < 20; i++) {
    const date = currentMonthTargetDates[i % currentMonthTargetDates.length]
    events.push(generateEvent(`event-current-${eventId++}`, date, eventId))
  }
  
  // 来月のイベント（20件）
  const nextMonthDates = generateMonthDates(1)
  const nextMonthTargetDates = nextMonthDates.slice(0, 20)
  for (let i = 0; i < 20; i++) {
    const date = nextMonthTargetDates[i % nextMonthTargetDates.length]
    events.push(generateEvent(`event-next-${eventId++}`, date, eventId))
  }
  
  // 再来月のイベント（20件）
  const afterNextMonthDates = generateMonthDates(2)
  const afterNextMonthTargetDates = afterNextMonthDates.slice(0, 20)
  for (let i = 0; i < 20; i++) {
    const date = afterNextMonthTargetDates[i % afterNextMonthTargetDates.length]
    events.push(generateEvent(`event-after-${eventId++}`, date, eventId))
  }
  
  return events
}

// 作業報告書データ
export interface WorkReport {
  id: string
  eventId: string
  workerId: string
  workerName: string
  date: string
  startTime: string
  endTime: string
  actualStartTime: string
  actualEndTime: string
  workContent: string
  issues: string[]
  photos: string[]
  customerSignature: boolean
  customerName: string
  customerFeedback: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
  submittedAt?: string
  approvedAt?: string
}

export const generateMockReports = (): WorkReport[] => {
  const reports: WorkReport[] = []
  const workers = [
    { id: 'worker-1', name: '高橋次郎' },
    { id: 'worker-2', name: '伊藤三郎' },
    { id: 'worker-master1', name: '田中親方' }
  ]
  
  for (let i = 1; i <= 30; i++) {
    const worker = workers[Math.floor(Math.random() * workers.length)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
    const status = ['draft', 'submitted', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as WorkReport['status']
    
    reports.push({
      id: `report-${i}`,
      eventId: `event-${Math.floor(Math.random() * 20) + 1}`,
      workerId: worker.id,
      workerName: worker.name,
      date: date.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      actualStartTime: '09:15',
      actualEndTime: '17:30',
      workContent: generateWorkContent(),
      issues: Math.random() > 0.7 ? [generateIssue()] : [],
      photos: [`/photos/work-${i}-1.jpg`, `/photos/work-${i}-2.jpg`],
      customerSignature: status === 'approved',
      customerName: clientNames[Math.floor(Math.random() * clientNames.length)],
      customerFeedback: generateCustomerFeedback(),
      status,
      createdAt: date.toISOString(),
      submittedAt: status !== 'draft' ? new Date(date.getTime() + 60 * 60 * 1000).toISOString() : undefined,
      approvedAt: status === 'approved' ? new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString() : undefined
    })
  }
  
  return reports
}

const generateWorkContent = (): string => {
  const contents = [
    'エアコン本体の設置および配管接続作業を完了しました。試運転を実施し、正常動作を確認済みです。',
    '既存エアコンの撤去および新型エアコンの設置を行いました。配管の洗浄も実施済みです。',
    '定期メンテナンスとしてフィルター清掃、ガス圧チェック、ドレン配管の点検を実施しました。',
    '室外機の異音調査を行い、ファンモーターの交換を実施しました。動作確認済みです。',
    '冷媒ガスの補充および配管の気密試験を実施。漏れ箇所を特定し修理完了しました。'
  ]
  return contents[Math.floor(Math.random() * contents.length)]
}

const generateIssue = (): string => {
  const issues = [
    '配管の老朽化が進んでおり、次回メンテナンス時に交換を推奨',
    '室外機の設置場所が狭く、メンテナンススペースの確保が必要',
    '電源容量が不足気味のため、将来的に電気工事が必要な可能性あり',
    'ドレン配管に詰まりの兆候があるため、定期清掃を推奨'
  ]
  return issues[Math.floor(Math.random() * issues.length)]
}

const generateCustomerFeedback = (): string => {
  const feedbacks = [
    '丁寧な作業ありがとうございました。',
    '説明が分かりやすく安心しました。',
    '時間通りに来ていただき助かりました。',
    '清掃まできれいにしていただき感謝です。',
    '次回もお願いしたいと思います。'
  ]
  return feedbacks[Math.floor(Math.random() * feedbacks.length)]
}

// 予定変更申請データ
export interface ScheduleChangeRequest {
  id: string
  eventId: string
  requesterId: string
  requesterName: string
  requesterRole: 'worker' | 'client' | 'admin'
  originalDate: string
  originalTime: string
  requestedDate: string
  requestedTime: string
  reason: string
  urgency: 'low' | 'medium' | 'high'
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  adminComment?: string
  createdAt: string
  processedAt?: string
  processedBy?: string
}

export const generateMockScheduleChangeRequests = (): ScheduleChangeRequest[] => {
  const requests: ScheduleChangeRequest[] = []
  const requesters = [
    { id: 'worker-1', name: '高橋次郎', role: 'worker' as const },
    { id: 'worker-2', name: '伊藤三郎', role: 'worker' as const },
    { id: 'client-1', name: '山田様', role: 'client' as const }
  ]
  
  for (let i = 1; i <= 25; i++) {
    const requester = requesters[Math.floor(Math.random() * requesters.length)]
    const originalDate = new Date(Date.now() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000))
    const requestedDate = new Date(originalDate.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
    const status = ['pending', 'approved', 'rejected', 'cancelled'][Math.floor(Math.random() * 4)] as ScheduleChangeRequest['status']
    
    requests.push({
      id: `change-request-${i}`,
      eventId: `event-${Math.floor(Math.random() * 30) + 1}`,
      requesterId: requester.id,
      requesterName: requester.name,
      requesterRole: requester.role,
      originalDate: originalDate.toISOString().split('T')[0],
      originalTime: '09:00-17:00',
      requestedDate: requestedDate.toISOString().split('T')[0],
      requestedTime: '13:00-17:00',
      reason: generateChangeReason(),
      urgency: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      status,
      adminComment: status !== 'pending' ? generateAdminComment(status) : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      processedAt: status !== 'pending' ? new Date().toISOString() : undefined,
      processedBy: status !== 'pending' ? 'user-admin' : undefined
    })
  }
  
  return requests
}

const generateChangeReason = (): string => {
  const reasons = [
    '別の緊急案件が入ったため',
    '体調不良のため',
    '部材の到着が遅れているため',
    '顧客の都合により',
    '天候不良が予想されるため',
    '他の現場の作業が長引いているため',
    '車両トラブルのため',
    '研修と重なってしまったため'
  ]
  return reasons[Math.floor(Math.random() * reasons.length)]
}

const generateAdminComment = (status: string): string => {
  const comments: Record<string, string[]> = {
    'approved': [
      '変更を承認しました。顧客に連絡済みです。',
      'スケジュール調整完了しました。',
      '了解しました。無理のないようにしてください。'
    ],
    'rejected': [
      '他の予定との兼ね合いで変更できません。',
      '顧客の都合により変更不可です。',
      '期限が迫っているため変更できません。'
    ],
    'cancelled': [
      '申請者により取り下げられました。',
      '別の解決策で対応することになりました。'
    ]
  }
  
  const commentList = comments[status] || ['処理済み']
  return commentList[Math.floor(Math.random() * commentList.length)]
}

// 在庫管理データ
export interface InventoryItem {
  id: string
  name: string
  category: 'equipment' | 'parts' | 'consumables' | 'tools'
  quantity: number
  minQuantity: number
  unit: string
  location: string
  lastUpdated: string
  status: 'sufficient' | 'low' | 'out_of_stock' | 'ordered'
  price: number
  supplier: string
  note?: string
}

export const generateMockInventory = (): InventoryItem[] => {
  const items: InventoryItem[] = [
    {
      id: 'inv-1',
      name: 'エアコン本体 6畳用',
      category: 'equipment',
      quantity: 8,
      minQuantity: 5,
      unit: '台',
      location: '東京DC A-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 45000,
      supplier: 'ダイキン工業'
    },
    {
      id: 'inv-2',
      name: 'エアコン本体 14畳用',
      category: 'equipment',
      quantity: 3,
      minQuantity: 5,
      unit: '台',
      location: '東京DC A-2',
      lastUpdated: new Date().toISOString(),
      status: 'low',
      price: 85000,
      supplier: 'パナソニック',
      note: '発注準備中'
    },
    {
      id: 'inv-3',
      name: '冷媒配管 2分3分 20m',
      category: 'parts',
      quantity: 15,
      minQuantity: 10,
      unit: '巻',
      location: '東京DC B-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 8000,
      supplier: '配管資材商事'
    },
    {
      id: 'inv-4',
      name: '冷媒配管 2分4分 20m',
      category: 'parts',
      quantity: 2,
      minQuantity: 10,
      unit: '巻',
      location: '東京DC B-2',
      lastUpdated: new Date().toISOString(),
      status: 'low',
      price: 10000,
      supplier: '配管資材商事',
      note: '至急発注要'
    },
    {
      id: 'inv-5',
      name: 'ドレンホース',
      category: 'parts',
      quantity: 50,
      minQuantity: 30,
      unit: 'm',
      location: '東京DC B-3',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 200,
      supplier: '配管資材商事'
    },
    {
      id: 'inv-6',
      name: '配管テープ',
      category: 'consumables',
      quantity: 25,
      minQuantity: 20,
      unit: '巻',
      location: '東京DC C-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 500,
      supplier: '工具商会'
    },
    {
      id: 'inv-7',
      name: 'R32冷媒ガス',
      category: 'consumables',
      quantity: 0,
      minQuantity: 5,
      unit: 'kg',
      location: '東京DC C-2',
      lastUpdated: new Date().toISOString(),
      status: 'out_of_stock',
      price: 5000,
      supplier: 'ガス供給センター',
      note: '発注済み、明日入荷予定'
    },
    {
      id: 'inv-8',
      name: 'フレアリングツール',
      category: 'tools',
      quantity: 8,
      minQuantity: 5,
      unit: '個',
      location: '東京DC D-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 15000,
      supplier: '工具商会'
    },
    {
      id: 'inv-9',
      name: '真空ポンプ',
      category: 'tools',
      quantity: 4,
      minQuantity: 3,
      unit: '台',
      location: '東京DC D-2',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 35000,
      supplier: '工具商会'
    },
    {
      id: 'inv-10',
      name: 'マニホールドゲージ',
      category: 'tools',
      quantity: 6,
      minQuantity: 4,
      unit: 'セット',
      location: '東京DC D-3',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 25000,
      supplier: '工具商会'
    },
    {
      id: 'inv-11',
      name: '室外機架台',
      category: 'parts',
      quantity: 12,
      minQuantity: 10,
      unit: '台',
      location: '埼玉DC A-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 3000,
      supplier: '金属加工所'
    },
    {
      id: 'inv-12',
      name: '防振ゴム',
      category: 'parts',
      quantity: 100,
      minQuantity: 50,
      unit: '個',
      location: '埼玉DC A-2',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 200,
      supplier: 'ゴム資材店'
    },
    {
      id: 'inv-13',
      name: 'リモコンホルダー',
      category: 'parts',
      quantity: 30,
      minQuantity: 20,
      unit: '個',
      location: '埼玉DC B-1',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 800,
      supplier: 'プラスチック工房'
    },
    {
      id: 'inv-14',
      name: '化粧カバー 直線',
      category: 'parts',
      quantity: 8,
      minQuantity: 15,
      unit: '本',
      location: '千葉DC A-1',
      lastUpdated: new Date().toISOString(),
      status: 'low',
      price: 1500,
      supplier: '化粧カバー専門店'
    },
    {
      id: 'inv-15',
      name: '化粧カバー コーナー',
      category: 'parts',
      quantity: 20,
      minQuantity: 15,
      unit: '個',
      location: '千葉DC A-2',
      lastUpdated: new Date().toISOString(),
      status: 'sufficient',
      price: 800,
      supplier: '化粧カバー専門店'
    }
  ]
  
  // 在庫数をランダムに調整
  items.forEach(item => {
    if (Math.random() > 0.7) {
      item.quantity = Math.floor(Math.random() * item.minQuantity)
      item.status = item.quantity === 0 ? 'out_of_stock' : 'low'
      if (item.status === 'out_of_stock' && Math.random() > 0.5) {
        item.status = 'ordered'
        item.note = `発注済み、${Math.floor(Math.random() * 3) + 1}日後入荷予定`
      }
    }
  })
  
  return items
}

// 通知データの拡充
export interface ExtendedNotification {
  id: string
  userId: string
  userRole: 'admin' | 'worker'
  type: 'schedule_new' | 'schedule_change' | 'schedule_cancel' | 'report_submitted' | 'report_approved' | 'inventory_low' | 'trouble_reported' | 'message'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: string
}

export const generateMockNotifications = (): ExtendedNotification[] => {
  const notifications: ExtendedNotification[] = []
  
  // 管理者向け通知
  for (let i = 1; i <= 15; i++) {
    notifications.push({
      id: `notif-admin-${i}`,
      userId: 'user-admin',
      userRole: 'admin',
      type: ['report_submitted', 'inventory_low', 'trouble_reported', 'schedule_change'][Math.floor(Math.random() * 4)] as any,
      priority: ['low', 'normal', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
      title: generateNotificationTitle('admin'),
      message: generateNotificationMessage('admin'),
      link: `/events/event-${Math.floor(Math.random() * 20) + 1}`,
      read: Math.random() > 0.6,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
    })
  }
  
  // 職人向け通知
  for (let i = 1; i <= 10; i++) {
    notifications.push({
      id: `notif-worker-${i}`,
      userId: 'worker-1',
      userRole: 'worker',
      type: ['schedule_new', 'schedule_change', 'schedule_cancel', 'report_approved', 'message'][Math.floor(Math.random() * 5)] as any,
      priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)] as any,
      title: generateNotificationTitle('worker'),
      message: generateNotificationMessage('worker'),
      link: `/events/event-${Math.floor(Math.random() * 20) + 1}`,
      read: Math.random() > 0.4,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
    })
  }
  
  return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const generateNotificationTitle = (role: 'admin' | 'worker'): string => {
  const titles = {
    admin: [
      '作業報告書が提出されました',
      '在庫が少なくなっています',
      'トラブルが報告されました',
      '予定変更申請があります',
      '緊急対応が必要です',
      '顧客からクレームがあります'
    ],
    worker: [
      '新しい予定が追加されました',
      '予定が変更されました',
      '予定がキャンセルされました',
      '報告書が承認されました',
      '管理者からメッセージ',
      '明日の予定確認'
    ]
  }
  
  return titles[role][Math.floor(Math.random() * titles[role].length)]
}

const generateNotificationMessage = (role: 'admin' | 'worker'): string => {
  const messages = {
    admin: [
      '高橋次郎から本日の作業報告書が提出されました。確認をお願いします。',
      'エアコン本体14畳用の在庫が残り3台です。発注を検討してください。',
      '渋谷区の現場で配管トラブルが発生しました。対応を検討してください。',
      '伊藤三郎から来週の予定変更申請が届いています。',
      '新宿区の顧客から緊急修理の依頼があります。',
      '品川区の現場から騒音クレームが入りました。'
    ],
    worker: [
      '1月15日 9:00-17:00 渋谷区でエアコン新設工事が追加されました。',
      '1月18日の予定が午後に変更されました。確認してください。',
      '1月20日の港区の予定がキャンセルになりました。',
      '昨日提出した報告書が承認されました。',
      '部材の受け取り場所が変更になりました。詳細を確認してください。',
      '明日の現場は8:30集合です。遅れないようにしてください。'
    ]
  }
  
  return messages[role][Math.floor(Math.random() * messages[role].length)]
}