'use client'

import Link from 'next/link'
import DandoriLogo from './DandoriLogo'

interface LogoHeaderProps {
  href?: string
  size?: number
  showText?: boolean
  fontSize?: string
  fontWeight?: string
}

export default function LogoHeader({ 
  href = '/demo',
  size = 36,
  showText = true,
  fontSize = '18px',
  fontWeight = '600'
}: LogoHeaderProps) {
  const content = (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      height: `${size}px`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`
      }}>
        <DandoriLogo size={size} />
      </div>
      {showText && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <h1 style={{
            fontSize: fontSize,
            fontWeight: fontWeight,
            margin: 0,
            lineHeight: 1,
            color: '#2c3e50'
          }}>Dandori Scheduler</h1>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ 
        textDecoration: 'none',
        display: 'inline-block'
      }}>
        {content}
      </Link>
    )
  }

  return content
}