// Settings page type definitions
// UIに影響を与えない型定義の追加

// Calendar display settings
export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day'
  includeWeekends: boolean
  hideCompleted: boolean
  colorRules: {
    installation: string
    maintenance: string
    repair: string
    emergency: string
  }
}

// Notification settings
export interface NotificationSettings {
  newSchedule: boolean
  scheduleChange: boolean
  reminderBefore: boolean
  reminderTiming: number // minutes before
  emergency: boolean
  completion: boolean
  weeklyReport: boolean
  monthlyReport: boolean
}

// Worker management
export interface Skill {
  id: string
  name: string
  category: string
  level?: number
}

export interface Certification {
  id: string
  name: string
  required: boolean
  expiryTracking: boolean
}

export interface Worker {
  id: string
  name: string
  skills: string[]
  certifications: string[]
  availability: string
  status: 'active' | 'inactive'
  phone?: string
  email?: string
}

// Shift template
export interface ShiftTemplate {
  id: string
  name: string
  pattern: string
  days: string[]
  startTime: string
  endTime: string
  breakTime: number
  active: boolean
}

// Approval template
export interface ApprovalTemplate {
  id: string
  name: string
  steps: ApprovalStep[]
  autoEscalate: boolean
  escalateAfter: number // hours
  active: boolean
}

export interface ApprovalStep {
  level: number
  approver: string
  role: string
  canDelegate: boolean
}

// Report template
export interface ReportTemplate {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  format: 'pdf' | 'excel' | 'email'
  recipients: string[]
  schedule: string
  active: boolean
}

// User permissions
export interface UserRole {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'supervisor' | 'worker' | 'viewer'
  permissions: string[]
  status: 'active' | 'pending' | 'inactive'
  lastLogin?: Date
}

// Business hours
export interface BusinessHours {
  weekdayStart: string
  weekdayEnd: string
  lunchStart: string
  lunchEnd: string
  saturdayEnabled: boolean
  saturdayStart?: string
  saturdayEnd?: string
  sundayEnabled: boolean
  sundayStart?: string
  sundayEnd?: string
  holidayEnabled: boolean
}

// Holiday settings
export interface Holiday {
  id: string
  date: string
  name: string
  type: 'national' | 'company' | 'regional'
  recurring: boolean
}

// Toast notification
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

// Modal states
export interface ModalStates {
  editModalOpen: boolean
  deleteModalOpen: boolean
  qrModalOpen: boolean
  appSyncModalOpen: boolean
  reportModalOpen: boolean
  workerModalOpen: boolean
  autoAssignmentModalOpen: boolean
}

// Tab configuration
export type TabType =
  | 'calendar'
  | 'workers'
  | 'shifts'
  | 'notifications'
  | 'approvals'
  | 'reports'
  | 'permissions'
  | 'business-hours'

export interface TabConfig {
  id: TabType
  label: string
  icon?: string
  description?: string
}