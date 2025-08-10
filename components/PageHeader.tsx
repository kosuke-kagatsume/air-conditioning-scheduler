'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DandoriLogo from './DandoriLogo'
import { MenuIcon } from './Icons'

interface PageHeaderProps {
  showLogo?: boolean
  onMenuClick?: () => void
}

export default function PageHeader({ showLogo = true, onMenuClick }: PageHeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
          <>
            {isMobile ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={onMenuClick}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <MenuIcon size={24} color="#ff6b6b" />
                </button>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Dandori Scheduler
                </span>
              </div>
            ) : (
              <div style={{
                width: '40px',
                height: '40px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Link href="/demo" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <DandoriLogo size={36} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}