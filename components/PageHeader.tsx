'use client'

import Link from 'next/link'
import LogoHeader from './LogoHeader'

interface PageHeaderProps {
  showLogo?: boolean
}

export default function PageHeader({ showLogo = true }: PageHeaderProps) {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e1e4e8',
      padding: '12px 20px',
      height: '60px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center'
      }}>
        {showLogo && (
          <div style={{
            width: '180px', // 固定幅でロゴエリアを確保
            flexShrink: 0   // 縮小を防ぐ
          }}>
            <LogoHeader href="/demo" size={36} />
          </div>
        )}
      </div>
    </header>
  )
}