import { User } from '@/types'

// 拡張職人データ
export interface ExtendedWorker extends User {
  company: string
  color: string
  experience: number // 経験年数
  specialties: string[] // 専門分野
  certifications: string[] // 資格
  workAreas: string[] // 対応エリア
  rating: number
  completedJobs: number
  monthlyTarget: number
  monthlyComplete: number
  skills: {
    name: string
    level: 'beginner' | 'intermediate' | 'expert'
    yearsExperience: number
  }[]
  availability: {
    morning: boolean // 早朝対応
    night: boolean // 夜間対応
    weekend: boolean // 土日対応
    holiday: boolean // 祝日対応
  }
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  insurance: {
    liability: boolean // 賠償責任保険
    accident: boolean // 労災保険
    expiryDate: Date
  }
  bankAccount: {
    bank: string
    branch: string
    accountType: string
    accountNumber: string
  }
  joinDate: Date
  lastWorkDate: Date
  status: 'active' | 'inactive' | 'vacation' | 'sick'
  notes: string
}

// 職人カンパニー
const companies = [
  '山田工務店', '佐藤設備', '田中電気', '高橋建設', '伊藤空調',
  '渡辺工業', '中村建築', '小林設備', '加藤電設', '吉田工務店',
  '山本空調', '松本建設', '井上設備', '木村工業', '林電気'
]

// カラーパレット
const workerColors = [
  '#ff6b6b', '#74c0fc', '#51cf66', '#ffd93d', '#9775fa',
  '#ff8cc3', '#4ecdc4', '#ff9a00', '#868e96', '#15aabf',
  '#fd79a8', '#00b894', '#0984e3', '#6c5ce7', '#fdcb6e'
]

// 専門分野
const specialties = [
  'エアコン設置', 'エアコン修理', '配管工事', '電気工事', 'メンテナンス',
  '業務用エアコン', '家庭用エアコン', 'ダクト工事', '換気設備', '冷凍機器'
]

// 資格リスト
const certifications = [
  '第二種電気工事士', '第一種電気工事士', '冷媒取扱技術者', 
  '高所作業車運転技能', 'ガス溶接技能講習', '玉掛け技能講習',
  '職長・安全衛生責任者', 'フルハーネス特別教育', '酸素欠乏危険作業',
  '有機溶剤作業主任者', '特定化学物質等作業主任者'
]

// 対応エリア
const workAreas = [
  '東京23区', '東京都下', '神奈川県', '埼玉県', '千葉県',
  '茨城県', '栃木県', '群馬県', '山梨県'
]

// スキルリスト  
const skillNames = [
  'エアコン設置', '配管溶接', '電気配線', '冷媒充填', '真空引き',
  '機器診断', 'ダクト施工', '制御盤作業', '高所作業', '顧客対応'
]

// 銀行リスト
const banks = [
  'みずほ銀行', '三井住友銀行', '三菱UFJ銀行', 'りそな銀行',
  '東京都民銀行', '横浜銀行', 'きらぼし銀行', 'ゆうちょ銀行'
]

// 職人名前リスト
const workerNames = [
  '山田太郎', '佐藤花子', '田中一郎', '高橋美咲', '伊藤健太',
  '渡辺さくら', '中村大輔', '小林愛美', '加藤翔太', '吉田由美',
  '山本健志', '松本麻衣', '井上龍也', '木村優子', '林慎一郎'
]

// 緊急連絡先名前
const emergencyNames = [
  '山田花子', '佐藤一郎', '田中美咲', '高橋健太', '伊藤さくら',
  '渡辺大輔', '中村愛', '小林翔', '加藤由美', '吉田健志',
  '山本麻衣', '松本龍也', '井上優子', '木村慎一郎', '林美咲'
]

// 関係性
const relationships = ['配偶者', '父', '母', '兄弟', '姉妹', '子', '友人']

export const generateExtendedWorkers = (): ExtendedWorker[] => {
  const workers: ExtendedWorker[] = []

  for (let i = 0; i < 15; i++) {
    const joinDate = new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000))
    const experience = Math.floor((Date.now() - joinDate.getTime()) / (365 * 24 * 60 * 60 * 1000)) + 1
    const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1))
    const completedJobs = Math.floor(Math.random() * 300) + 50
    const monthlyTarget = Math.floor(Math.random() * 15) + 15
    const monthlyComplete = Math.floor(Math.random() * monthlyTarget)
    
    // ランダムな専門分野（2-4個）
    const workerSpecialties = shuffleArray([...specialties]).slice(0, Math.floor(Math.random() * 3) + 2)
    
    // ランダムな資格（3-7個、経験に応じて）
    const certCount = Math.min(Math.floor(experience / 2) + 2, 7)
    const workerCertifications = shuffleArray([...certifications]).slice(0, certCount)
    
    // ランダムな対応エリア（2-5個）
    const workerAreas = shuffleArray([...workAreas]).slice(0, Math.floor(Math.random() * 4) + 2)
    
    // スキル生成（5-8個）
    const skillCount = Math.floor(Math.random() * 4) + 5
    const workerSkills = shuffleArray([...skillNames]).slice(0, skillCount).map(skill => ({
      name: skill,
      level: getSkillLevel(experience),
      yearsExperience: Math.min(experience, Math.floor(Math.random() * experience) + 1)
    }))

    const worker: ExtendedWorker = {
      id: `worker-${i + 1}`,
      name: workerNames[i],
      email: `${workerNames[i].replace(/\s/g, '').toLowerCase()}@worker.jp`,
      role: i === 0 ? 'master' : 'worker', // 最初の一人を親方に
      tenantId: 'tenant-1',
      phoneNumber: generatePhoneNumber(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${workerNames[i]}`,
      
      // 拡張フィールド
      company: companies[i],
      color: workerColors[i],
      experience,
      specialties: workerSpecialties,
      certifications: workerCertifications,
      workAreas: workerAreas,
      rating,
      completedJobs,
      monthlyTarget,
      monthlyComplete,
      skills: workerSkills,
      availability: {
        morning: Math.random() > 0.3,
        night: Math.random() > 0.6,
        weekend: Math.random() > 0.4,
        holiday: Math.random() > 0.7
      },
      emergencyContact: {
        name: emergencyNames[i],
        phone: generatePhoneNumber(),
        relationship: relationships[Math.floor(Math.random() * relationships.length)]
      },
      insurance: {
        liability: Math.random() > 0.1, // 90%が加入
        accident: Math.random() > 0.05, // 95%が加入
        expiryDate: new Date(Date.now() + Math.floor(Math.random() * 2 * 365 * 24 * 60 * 60 * 1000))
      },
      bankAccount: {
        bank: banks[Math.floor(Math.random() * banks.length)],
        branch: `${['新宿', '渋谷', '池袋', '品川', '上野', '秋葉原'][Math.floor(Math.random() * 6)]}支店`,
        accountType: Math.random() > 0.5 ? '普通' : '当座',
        accountNumber: (Math.floor(Math.random() * 9000000) + 1000000).toString()
      },
      joinDate,
      lastWorkDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      status: getWorkerStatus(),
      notes: generateWorkerNotes()
    }

    workers.push(worker)
  }

  return workers
}

// ヘルパー関数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generatePhoneNumber(): string {
  const area = ['090', '080', '070'][Math.floor(Math.random() * 3)]
  const middle = Math.floor(Math.random() * 9000) + 1000
  const last = Math.floor(Math.random() * 9000) + 1000
  return `${area}-${middle}-${last}`
}

function getSkillLevel(experience: number): 'beginner' | 'intermediate' | 'expert' {
  if (experience >= 8) return Math.random() > 0.3 ? 'expert' : 'intermediate'
  if (experience >= 3) return Math.random() > 0.5 ? 'intermediate' : 'beginner'
  return Math.random() > 0.7 ? 'intermediate' : 'beginner'
}

function getWorkerStatus(): 'active' | 'inactive' | 'vacation' | 'sick' {
  const rand = Math.random()
  if (rand > 0.95) return 'sick'
  if (rand > 0.9) return 'vacation'
  if (rand > 0.85) return 'inactive'
  return 'active'
}

function generateWorkerNotes(): string {
  const notes = [
    '真面目で丁寧な作業をします',
    '顧客対応が非常に良い',
    '技術力が高く信頼できる',
    '時間に正確で責任感が強い',
    '新人の指導も得意',
    '難しい現場も対応可能',
    '顧客からの評価が高い',
    'チームワークを大切にする',
    '安全作業を心がけている',
    '向上心があり勉強熱心',
    ''
  ]
  return notes[Math.floor(Math.random() * notes.length)]
}

// シフト管理データ
export interface ShiftData {
  id: string
  workerId: string
  workerName: string
  date: string
  shift: 'morning' | 'afternoon' | 'night' | 'full' | 'off'
  startTime: string
  endTime: string
  breakTime: number // 分
  workHours: number
  overtime: number
  location: string
  notes: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export const generateShiftData = (workers: ExtendedWorker[]): ShiftData[] => {
  const shifts: ShiftData[] = []
  const today = new Date()
  
  // 過去2週間から未来4週間のシフトを生成
  for (let dayOffset = -14; dayOffset <= 28; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)
    const dateStr = date.toISOString().split('T')[0]
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    
    workers.forEach(worker => {
      // 土日は一部の職人のみ勤務
      if (isWeekend && !worker.availability.weekend && Math.random() > 0.3) {
        shifts.push({
          id: `shift-${worker.id}-${dateStr}`,
          workerId: worker.id,
          workerName: worker.name,
          date: dateStr,
          shift: 'off',
          startTime: '',
          endTime: '',
          breakTime: 0,
          workHours: 0,
          overtime: 0,
          location: '',
          notes: '休日',
          status: dayOffset < 0 ? 'completed' : 'scheduled',
          createdAt: new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        })
        return
      }
      
      // ランダムなシフトタイプ
      const shiftTypes = ['morning', 'afternoon', 'full', 'night']
      const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)] as 'morning' | 'afternoon' | 'night' | 'full'
      
      let startTime, endTime, workHours, breakTime
      
      switch (shiftType) {
        case 'morning':
          startTime = '08:00'
          endTime = '12:00'
          workHours = 4
          breakTime = 0
          break
        case 'afternoon':  
          startTime = '13:00'
          endTime = '18:00'
          workHours = 5
          breakTime = 60
          break
        case 'night':
          startTime = '18:00'
          endTime = '22:00'
          workHours = 4
          breakTime = 0
          break
        case 'full':
        default:
          startTime = '08:00'
          endTime = '18:00'
          workHours = 9
          breakTime = 90 // 昼休み + 小休憩
          break
      }
      
      const overtime = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0
      if (overtime > 0) {
        const endHour = parseInt(endTime.split(':')[0]) + overtime
        endTime = `${endHour.toString().padStart(2, '0')}:00`
        workHours += overtime
      }
      
      shifts.push({
        id: `shift-${worker.id}-${dateStr}`,
        workerId: worker.id,
        workerName: worker.name,
        date: dateStr,
        shift: shiftType,
        startTime,
        endTime,
        breakTime,
        workHours,
        overtime,
        location: getWorkLocation(),
        notes: generateShiftNotes(),
        status: dayOffset < 0 ? 'completed' : dayOffset < 7 ? 'confirmed' : 'scheduled',
        createdAt: new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      })
    })
  }
  
  return shifts
}

function getWorkLocation(): string {
  const locations = [
    '東京都内各所', '神奈川県内', '埼玉県内', '千葉県内',
    '新宿エリア', '渋谷エリア', '品川エリア', '池袋エリア',
    '本社', '倉庫', '研修センター', '客先常駐'
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

function generateShiftNotes(): string {
  const notes = [
    '',
    '新規案件対応',
    '緊急対応待機',
    '研修参加',
    '定期メンテナンス',
    '大型案件',
    '顧客立会い',
    '新人指導',
    '機材搬入',
    '検査対応'
  ]
  return notes[Math.floor(Math.random() * notes.length)]
}