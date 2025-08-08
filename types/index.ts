// ユーザー権限タイプ
export type UserRole = 'admin' | 'manager1' | 'manager2' | 'staff' | 'master' | 'worker' | 'support'

// ユーザータイプ
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId: string
  tenants?: Tenant[] // 職人の場合、複数のテナントに所属可能
  parentId?: string // 子方の場合、親方のID
  avatar?: string
  phoneNumber?: string
  notificationSettings?: NotificationSettings
}

// テナント（元請会社）
export interface Tenant {
  id: string
  name: string
  logo?: string
  settings: TenantSettings
}

// テナント設定
export interface TenantSettings {
  customFields: CustomField[]
  constructionTypes: string[]
  troubleTypes: string[]
  timeSlotType: 'two' | 'three' | 'four' | 'custom'
  timeSlots?: TimeSlot[]
  archivePeriod: number // months
  defaultView: 'month' | 'week' | 'day'
}

// カスタムフィールド
export interface CustomField {
  id: string
  name: string
  type: 'text' | 'number' | 'url' | 'date' | 'select'
  options?: string[] // selectタイプの場合
  required: boolean
  order: number
}

// 時間枠
export interface TimeSlot {
  id: string
  name: string
  startTime: string
  endTime: string
}

// 予定ステータス
export type EventStatus = 'proposed' | 'accepted' | 'pending' | 'rejected' | 'cancelled' | 'completed' | 'onHold'

// 予定
export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime?: string
  status: EventStatus
  address: string
  city: string // 市区町村
  constructionType: string
  description?: string
  clientName: string // 施主名
  constructorName: string // 工務店名
  salesPersons: SalesPerson[] // 営業担当者（複数）
  workerId: string
  workerName: string
  createdBy: string
  tenantId: string
  customFieldValues?: Record<string, any>
  trouble?: Trouble
  negotiation?: Negotiation
  timeSlotIds?: string[] // 使用する時間枠
  createdAt: string
  updatedAt: string
}

// 営業担当者
export interface SalesPerson {
  id: string
  name: string
  role: 'main' | 'sub' | 'support'
}

// トラブル情報
export interface Trouble {
  id: string
  type: string
  description: string
  status: 'open' | 'resolved'
  reportedAt: string
  resolvedAt?: string
}

// 交渉情報
export interface Negotiation {
  id: string
  type: 'conflict' | 'cancel' | 'change'
  message: string
  response?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  respondedAt?: string
}

// 職人の枠数設定
export interface WorkerCapacity {
  workerId: string
  baseCapacity: number // 基本枠数
  weekdayCapacities?: Record<number, number> // 曜日別（0=日曜）
  specificDates?: Record<string, number> // 特定日
  timeSlotCapacities?: Record<string, number> // 時間帯別
}

// 通知
export interface Notification {
  id: string
  userId: string
  type: 'event_created' | 'event_updated' | 'event_cancelled' | 'response_required' | 'reminder'
  priority: 'high' | 'normal' | 'low'
  title: string
  message: string
  relatedEventId?: string
  read: boolean
  createdAt: string
}

// 通知設定
export interface NotificationSettings {
  email: boolean
  push: boolean
  line?: boolean
  reminderTime: number // minutes before event
}

// ダッシュボードデータ
export interface DashboardData {
  totalEvents: number
  completedEvents: number
  troubleCount: number
  troubleTarget: number
  installCount: number
  installTarget: number
  eventsByType: Record<string, number>
  eventsByWorker: Record<string, number>
  monthlyTrend: { month: string; count: number }[]
}

// 現場情報
export interface Site {
  id: string
  address: string
  city: string
  zipCode: string
  clientName: string
  constructorName: string
  salesPersons: SalesPerson[]
  notes?: string
  dandoriWorkId?: string // ダンドリワーク連携ID
  history: Event[]
}