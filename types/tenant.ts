export type TenantPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type TenantStatus = 'active' | 'suspended' | 'trial' | 'cancelled'

export interface Tenant {
  id: string
  name: string
  companyName: string
  address?: string
  phone?: string
  email: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  plan: TenantPlan
  status: TenantStatus
  userCount: number
  userLimit: number
  monthlyFee: number
  lastLoginAt?: Date
  trialEndsAt?: Date
  createdAt: Date
  updatedAt: Date
  settings?: {
    allowFileUpload?: boolean
    maxStorageGB?: number
    customFields?: Array<{
      name: string
      type: 'text' | 'number' | 'date' | 'select'
      options?: string[]
    }>
  }
}

export interface TenantUser {
  id: string
  tenantId: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
}

export interface TenantStats {
  totalTenants: number
  activeTenants: number
  trialTenants: number
  totalRevenue: number
  averageUsersPerTenant: number
  growthRate: number
}

export interface TenantActivity {
  id: string
  tenantId: string
  userId?: string
  type: 'login' | 'create' | 'update' | 'delete' | 'export'
  description: string
  timestamp: Date
}