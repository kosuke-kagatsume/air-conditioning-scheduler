// Settings page constants
// 設定ページで使用する定数を集約

// カラーテーマ
export const COLORS = {
  INSTALLATION: '#3B82F6',
  MAINTENANCE: '#10B981',
  REPAIR: '#F59E0B',
  EMERGENCY: '#EF4444',
} as const

// デフォルトスキル
export const DEFAULT_SKILLS = [
  'エアコン設置',
  'エアコン修理',
  '電気工事',
  '配管工事',
  '冷媒取扱',
  '高所作業',
  'クレーン操作',
  '溶接作業',
  '断熱工事',
  'ダクト工事'
]

// デフォルト資格
export const DEFAULT_CERTIFICATIONS = [
  '第一種電気工事士',
  '第二種電気工事士',
  '冷媒取扱技術者',
  '高所作業車運転',
  'ガス溶接',
  'アーク溶接',
  '管工事施工管理技士',
  '冷凍機械責任者'
]

// シフトパターン
export const SHIFT_PATTERNS = {
  FIXED: '固定',
  ROTATING: 'ローテーション',
  FLEXIBLE: 'フレキシブル',
} as const

// 承認ステップロール
export const APPROVAL_ROLES = {
  MANAGER: 'マネージャー',
  SUPERVISOR: 'スーパーバイザー',
  DIRECTOR: 'ディレクター',
} as const

// レポートタイプ
export const REPORT_TYPES = {
  DAILY: '日次',
  WEEKLY: '週次',
  MONTHLY: '月次',
  CUSTOM: 'カスタム',
} as const

// レポートフォーマット
export const REPORT_FORMATS = {
  PDF: 'PDF',
  EXCEL: 'Excel',
  EMAIL: 'メール',
} as const

// ユーザーロール
export const USER_ROLES = {
  ADMIN: '管理者',
  MANAGER: 'マネージャー',
  SUPERVISOR: 'スーパーバイザー',
  WORKER: '作業員',
  VIEWER: '閲覧者',
} as const

// タブ設定
export const TAB_LABELS = {
  calendar: 'カレンダー表示',
  workers: '作業員管理',
  shifts: 'シフトテンプレート',
  notifications: '通知設定',
  approvals: '承認フロー',
  reports: 'レポート設定',
  permissions: 'ユーザー権限',
  'business-hours': '営業日設定',
} as const

// 通知タイミング（分）
export const NOTIFICATION_TIMINGS = [
  { value: 15, label: '15分前' },
  { value: 30, label: '30分前' },
  { value: 60, label: '1時間前' },
  { value: 120, label: '2時間前' },
  { value: 1440, label: '1日前' },
] as const

// 営業時間デフォルト値
export const DEFAULT_BUSINESS_HOURS = {
  WEEKDAY_START: '09:00',
  WEEKDAY_END: '18:00',
  LUNCH_START: '12:00',
  LUNCH_END: '13:00',
} as const

// 休日タイプ
export const HOLIDAY_TYPES = {
  NATIONAL: '祝日',
  COMPANY: '会社休日',
  REGIONAL: '地域休日',
} as const