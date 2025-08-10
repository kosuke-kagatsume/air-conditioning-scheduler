'use client'

// カレンダーアイコン
export const CalendarIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="15" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M3 10H21" stroke={color} strokeWidth="2"/>
    <path d="M8 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 3V7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="8" cy="15" r="1" fill={color}/>
    <circle cx="12" cy="15" r="1" fill={color}/>
    <circle cx="16" cy="15" r="1" fill={color}/>
  </svg>
)

// 職人管理アイコン
export const WorkersIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="15" cy="9" r="2.5" stroke={color} strokeWidth="1.5" opacity="0.7"/>
    <path d="M3 19C3 16 5 14 9 14C13 14 15 16 15 19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 19C15 17 16 16 18 16C20 16 21 17 21 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
  </svg>
)

// 現場管理アイコン
export const SitesIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V11C3 16 6 20 12 21C18 20 21 16 21 11V7L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
)

// ダッシュボードアイコン
export const DashboardIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="2"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke={color} strokeWidth="2"/>
  </svg>
)

// 予定変更申請アイコン
export const ScheduleChangeIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M8 10L11 13L16 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// シフト管理アイコン
export const ShiftIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M3 10H21" stroke={color} strokeWidth="2"/>
    <path d="M9 6V10" stroke={color} strokeWidth="2"/>
    <path d="M15 10V18" stroke={color} strokeWidth="2"/>
  </svg>
)

// 在庫管理アイコン
export const InventoryIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8L12 3L21 8V16L12 21L3 16V8Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 21V12" stroke={color} strokeWidth="2"/>
    <path d="M12 12L21 8" stroke={color} strokeWidth="2"/>
    <path d="M12 12L3 8" stroke={color} strokeWidth="2"/>
  </svg>
)

// 作業報告書アイコン
export const ReportIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M9 7H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 11H15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 15H12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// 設定アイコン
export const SettingsIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 2V6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 4.93L7.76 7.76" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 16.24L19.07 19.07" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 12H22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.93 19.07L7.76 16.24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M16.24 7.76L19.07 4.93" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// 通知ベルアイコン
export const NotificationIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C13.5 3 14.5 4 14.5 5.5V6C16.5 7 18 9 18 12V16L20 18V19H4V18L6 16V12C6 9 7.5 7 9.5 6V5.5C9.5 4 10.5 3 12 3Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 20C10 21 11 22 12 22C13 22 14 21 14 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// メニューアイコン
export const MenuIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 18H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// プラスアイコン
export const PlusIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ユーザーアイコン
export const UserIcon = ({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M4 20C4 16 7 13 12 13C17 13 20 16 20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)