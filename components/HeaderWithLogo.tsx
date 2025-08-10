'use client'

import DandoriLogo from './DandoriLogo'
import Link from 'next/link'

interface HeaderWithLogoProps {
  pageTitle?: string
  rightContent?: React.ReactNode
}

export default function HeaderWithLogo({ pageTitle, rightContent }: HeaderWithLogoProps) {
  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e1e4e8',
      padding: '12px 20px',
      height: '60px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '240px', // Sidebarと同じ幅に固定
          paddingLeft: '20px'
        }}>
          <Link href="/demo">
            <DandoriLogo size={36} />
          </Link>
          {pageTitle && (
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              color: '#1f2937',
              whiteSpace: 'nowrap'
            }}>
              {pageTitle}
            </h1>
          )}
        </div>
        {rightContent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {rightContent}
          </div>
        )}
      </div>
    </header>
  )
}