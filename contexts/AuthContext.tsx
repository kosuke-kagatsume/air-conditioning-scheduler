'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Tenant } from '@/types'
import { mockUsers, mockTenants } from '@/lib/mockData'

interface AuthContextType {
  user: User | null
  currentTenant: Tenant | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchTenant: (tenantId: string) => void
  isAdmin: boolean
  isManager: boolean
  isStaff: boolean
  isMaster: boolean
  isWorker: boolean
  canCreateEvent: boolean
  canEditAllEvents: boolean
  canViewAllEvents: boolean
  canManageSettings: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)

  // ローカルストレージから認証情報を復元
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    const savedTenantId = localStorage.getItem('currentTenantId')
    
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // テナント情報を設定
      const tenant = mockTenants.find(t => t.id === (savedTenantId || userData.tenantId))
      if (tenant) {
        setCurrentTenant(tenant)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // モックではパスワードチェックはせず、メールアドレスでユーザーを特定
    const foundUser = mockUsers.find(u => u.email === email)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('currentUser', JSON.stringify(foundUser))
      
      // デフォルトテナントを設定
      const tenant = mockTenants.find(t => t.id === foundUser.tenantId)
      if (tenant) {
        setCurrentTenant(tenant)
        localStorage.setItem('currentTenantId', tenant.id)
      }
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    setCurrentTenant(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentTenantId')
  }

  const switchTenant = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId)
    if (tenant && user?.tenants?.some(t => t.id === tenantId)) {
      setCurrentTenant(tenant)
      localStorage.setItem('currentTenantId', tenantId)
    }
  }

  // 権限チェック
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager1' || user?.role === 'manager2'
  const isStaff = user?.role === 'staff'
  const isMaster = user?.role === 'master'
  const isWorker = user?.role === 'worker'

  // 機能権限
  const canCreateEvent = isAdmin || isManager || isStaff
  const canEditAllEvents = isAdmin || isManager
  const canViewAllEvents = isAdmin || isManager || isStaff
  const canManageSettings = isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        currentTenant,
        login,
        logout,
        switchTenant,
        isAdmin,
        isManager,
        isStaff,
        isMaster,
        isWorker,
        canCreateEvent,
        canEditAllEvents,
        canViewAllEvents,
        canManageSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}