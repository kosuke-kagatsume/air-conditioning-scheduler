// 職人向けの個人予定データ
export interface WorkerSchedule {
  id: string
  workerId: string
  title: string
  date: string
  startTime: string
  endTime: string
  type: 'work' | 'training' | 'meeting' | 'maintenance' | 'inspection' | 'emergency'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  location: string
  client: string
  description: string
  equipment: string[]
  materials: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedHours: number
  actualHours?: number
  notes: string
  attachments: string[]
  teamMembers: string[]
  createdAt: string
  updatedAt: string
}

// 職人ID別の予定生成
const workerIds = [
  'worker-1', 'worker-2', 'worker-3', 'worker-4', 'worker-5',
  'worker-6', 'worker-7', 'worker-8', 'worker-9', 'worker-10',
  'worker-11', 'worker-12', 'worker-13', 'worker-14', 'worker-15'
]

// 作業タイプ
const workTypes = [
  { type: 'work', weight: 70 },
  { type: 'training', weight: 10 },
  { type: 'meeting', weight: 8 },
  { type: 'maintenance', weight: 7 },
  { type: 'inspection', weight: 3 },
  { type: 'emergency', weight: 2 }
]

// 作業タイトル
const workTitles: Record<string, string[]> = {
  work: [
    'エアコン新設工事', 'エアコン交換工事', '定期メンテナンス', '緊急修理対応',
    '配管延長工事', 'ダクト清掃', '冷媒ガス補充', '室外機移設',
    'フィルター交換', '電気系統点検', '配管漏れ修理', 'コンプレッサー交換'
  ],
  training: [
    '新製品研修', '安全講習', 'スキルアップ研修', '資格更新講習',
    'OJT指導', '技術勉強会', 'メーカー研修', 'ISO講習'
  ],
  meeting: [
    '朝礼', '週次ミーティング', '安全会議', 'プロジェクト打ち合わせ',
    '顧客打ち合わせ', '協力会社との会議', '月次報告会', '改善提案会議'
  ],
  maintenance: [
    '工具メンテナンス', '車両点検', '機材整備', '倉庫整理',
    '作業車清掃', '機器校正', '工具在庫確認', '安全装備点検'
  ],
  inspection: [
    '完成検査', '中間検査', '品質監査', '安全パトロール',
    'ISO監査', '設備点検', '法定点検', '自主検査'
  ],
  emergency: [
    '緊急出動', '故障対応', '漏水対応', '停電対応',
    '緊急修理', '事故対応', '災害復旧', 'クレーム対応'
  ]
}

// 場所
const locations = [
  '渋谷区神南1-2-3', '新宿区西新宿2-4-5', '港区六本木3-1-8', '品川区大崎1-5-2',
  '目黒区中目黒2-3-4', '世田谷区三軒茶屋1-6-7', '杉並区荻窪3-2-1', '練馬区練馬4-5-8',
  '板橋区板橋2-1-9', '豊島区池袋1-3-6', '北区王子2-4-7', '足立区千住3-5-2',
  '葛飾区金町1-8-4', '江戸川区船堀2-7-3', '墨田区錦糸町4-2-5', '台東区上野3-6-1',
  '文京区本郷2-5-8', '千代田区丸の内1-4-7', '中央区銀座3-2-9', '江東区豊洲2-1-6'
]

// 顧客名
const clients = [
  'ABCマンション管理組合', 'XYZ商事株式会社', '田中建設', '山田工務店',
  'グリーンビル', 'サンシャイン不動産', 'オーシャンタワー', 'パークサイドレジデンス',
  '東京メディカルセンター', 'テクノロジー株式会社', '未来設計事務所', 'イノベーション商事',
  '鈴木様邸', '佐藤様邸', '高橋様邸', '伊藤様邸', '渡辺様邸', '中村様邸'
]

// 機材・材料
const equipment = [
  'エアコン室内機6畳用', 'エアコン室外機', '冷媒配管2分3分', 'ドレンホース',
  '化粧カバー', '配管テープ', '冷媒R32', 'フレアリングツール',
  'トルクレンチ', '真空ポンプ', 'マニホールドゲージ', 'パイプカッター'
]

const materials = [
  '配管保温材', '防振ゴム', 'サドルバンド', 'ビス・ネジ類',
  '電線管', 'VVFケーブル', 'ブレーカー', 'コンセント',
  'パテ材', 'コーキング材', 'クリーニング材', '潤滑油'
]

export const generateWorkerSchedules = (): WorkerSchedule[] => {
  const schedules: WorkerSchedule[] = []
  const today = new Date()
  
  // 各職人に対して過去1ヶ月、今月、来月、再来月の予定を生成
  workerIds.forEach(workerId => {
    // 各月約12-15個の予定を生成
    for (let monthOffset = -1; monthOffset <= 2; monthOffset++) {
      const scheduleCount = Math.floor(Math.random() * 4) + 12 // 12-15個
      
      for (let i = 0; i < scheduleCount; i++) {
        const scheduleDate = generateRandomDateInMonth(today, monthOffset)
        const workType = selectWeightedWorkType()
        const title = workTitles[workType][Math.floor(Math.random() * workTitles[workType].length)]
        const location = locations[Math.floor(Math.random() * locations.length)]
        const client = clients[Math.floor(Math.random() * clients.length)]
        
        // 時間設定
        const { startTime, endTime, estimatedHours } = generateWorkTime(workType)
        
        // ステータス設定（過去の予定は完了またはキャンセル、未来の予定は予定中）
        let status: WorkerSchedule['status']
        if (scheduleDate < today) {
          status = Math.random() > 0.9 ? 'cancelled' : 'completed'
        } else if (scheduleDate.toDateString() === today.toDateString()) {
          status = 'in_progress'
        } else {
          status = Math.random() > 0.95 ? 'postponed' : 'scheduled'
        }
        
        const schedule: WorkerSchedule = {
          id: `schedule-${workerId}-${scheduleDate.toISOString().split('T')[0]}-${i}`,
          workerId,
          title,
          date: scheduleDate.toISOString().split('T')[0],
          startTime,
          endTime,
          type: workType as WorkerSchedule['type'],
          status,
          location,
          client,
          description: generateDescription(workType, title),
          equipment: selectRandomItems(equipment, 2, 5),
          materials: selectRandomItems(materials, 1, 4),
          priority: generatePriority(workType),
          estimatedHours,
          actualHours: status === 'completed' ? estimatedHours + (Math.random() - 0.5) * 2 : undefined,
          notes: generateNotes(),
          attachments: generateAttachments(),
          teamMembers: generateTeamMembers(workType),
          createdAt: new Date(scheduleDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        schedules.push(schedule)
      }
    }
  })
  
  // 日付順でソート
  return schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// ヘルパー関数
function generateRandomDateInMonth(baseDate: Date, monthOffset: number): Date {
  const targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1)
  const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate()
  
  // 平日重視（土日は30%の確率）
  let randomDay: number
  do {
    randomDay = Math.floor(Math.random() * daysInMonth) + 1
    const testDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), randomDay)
    const isWeekend = testDate.getDay() === 0 || testDate.getDay() === 6
    
    if (!isWeekend || Math.random() < 0.3) break
  } while (true)
  
  return new Date(targetDate.getFullYear(), targetDate.getMonth(), randomDay)
}

function selectWeightedWorkType(): string {
  const random = Math.random() * 100
  let cumulative = 0
  
  for (const { type, weight } of workTypes) {
    cumulative += weight
    if (random <= cumulative) return type
  }
  
  return 'work'
}

function generateWorkTime(workType: string): { startTime: string; endTime: string; estimatedHours: number } {
  const timeSlots: Record<string, { start: string; end: string; hours: number }[]> = {
    work: [
      { start: '08:00', end: '17:00', hours: 8 },
      { start: '09:00', end: '18:00', hours: 8 },
      { start: '09:00', end: '12:00', hours: 3 },
      { start: '13:00', end: '17:00', hours: 4 },
      { start: '08:00', end: '12:00', hours: 4 }
    ],
    training: [
      { start: '09:00', end: '17:00', hours: 7 },
      { start: '13:00', end: '17:00', hours: 4 }
    ],
    meeting: [
      { start: '08:00', end: '09:00', hours: 1 },
      { start: '09:00', end: '11:00', hours: 2 },
      { start: '14:00', end: '16:00', hours: 2 }
    ],
    maintenance: [
      { start: '08:00', end: '10:00', hours: 2 },
      { start: '16:00', end: '18:00', hours: 2 }
    ],
    inspection: [
      { start: '10:00', end: '12:00', hours: 2 },
      { start: '14:00', end: '16:00', hours: 2 }
    ],
    emergency: [
      { start: '08:00', end: '20:00', hours: 10 },
      { start: '20:00', end: '22:00', hours: 2 }
    ]
  }
  
  const slots = timeSlots[workType] || timeSlots.work
  const selected = slots[Math.floor(Math.random() * slots.length)]
  
  return {
    startTime: selected.start,
    endTime: selected.end,
    estimatedHours: selected.hours
  }
}

function generateDescription(workType: string, title: string): string {
  const descriptions: Record<string, string> = {
    work: `${title}の作業を行います。安全に注意して丁寧に作業してください。`,
    training: `${title}に参加します。新しい技術や知識を習得してください。`,
    meeting: `${title}を行います。積極的に意見交換をしてください。`,
    maintenance: `${title}を実施します。機器の状態を詳細にチェックしてください。`,
    inspection: `${title}を行います。基準に従って正確に検査してください。`,
    emergency: `${title}です。迅速かつ安全に対応してください。`
  }
  
  return descriptions[workType] || descriptions.work
}

function selectRandomItems<T>(items: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...items].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generatePriority(workType: string): WorkerSchedule['priority'] {
  const priorities: Record<string, string[]> = {
    emergency: ['urgent', 'high'],
    work: ['medium', 'medium', 'high', 'low'],
    training: ['low', 'medium'],
    meeting: ['medium', 'low'],
    maintenance: ['low', 'medium'],
    inspection: ['medium', 'high']
  }
  
  const options = priorities[workType] || ['medium']
  return options[Math.floor(Math.random() * options.length)] as WorkerSchedule['priority']
}

function generateNotes(): string {
  const notes = [
    '',
    '事前に顧客へ連絡済み',
    '材料は現地調達',
    '駐車場確保済み',
    '電源確認要',
    '騒音に注意',
    '近隣への配慮をお願いします',
    '作業後の清掃をお願いします',
    '写真撮影を忘れずに',
    '完了報告書の提出をお願いします'
  ]
  
  return notes[Math.floor(Math.random() * notes.length)]
}

function generateAttachments(): string[] {
  const hasAttachments = Math.random() > 0.7
  if (!hasAttachments) return []
  
  const attachments = [
    '図面_v1.pdf',
    '仕様書.pdf',
    '現場写真.jpg',
    '見積書.pdf',
    '承認書.pdf'
  ]
  
  return selectRandomItems(attachments, 1, 3)
}

function generateTeamMembers(workType: string): string[] {
  if (workType === 'meeting' || workType === 'training') {
    return [] // 個人作業
  }
  
  const hasTeam = Math.random() > 0.6
  if (!hasTeam) return []
  
  const teamSize = Math.floor(Math.random() * 2) + 1 // 1-2人
  const workers = ['田中', '佐藤', '山田', '高橋', '鈴木']
  return selectRandomItems(workers, teamSize, teamSize)
}