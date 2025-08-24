'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const getStyles = () => {
    const baseStyle = {
      position: 'fixed' as const,
      bottom: '16px',
      right: '16px',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      animation: 'slideUp 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    }

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }
      case 'error':
        return { ...baseStyle, backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fffbeb', borderColor: '#fed7aa', color: '#92400e' }
      default:
        return { ...baseStyle, backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      default: return '#3b82f6'
    }
  }

  const icons = {
    success: <CheckCircle size={20} style={{ color: getIconColor() }} />,
    error: <XCircle size={20} style={{ color: getIconColor() }} />,
    warning: <AlertCircle size={20} style={{ color: getIconColor() }} />,
    info: <Info size={20} style={{ color: getIconColor() }} />
  }

  return (
    <div style={getStyles()}>
      {icons[type]}
      <p style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        style={{
          marginLeft: '16px',
          padding: '4px',
          background: 'none',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
          color: '#6b7280'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <X size={16} />
      </button>
    </div>
  )
}

// Toast Container for managing multiple toasts
interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[], onRemove: (id: string) => void }) {
  const getToastStyles = (type: ToastType) => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      animation: 'slideUp 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px',
      marginBottom: '8px'
    }

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }
      case 'error':
        return { ...baseStyle, backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fffbeb', borderColor: '#fed7aa', color: '#92400e' }
      default:
        return { ...baseStyle, backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' }
    }
  }

  const getIconColor = (type: ToastType) => {
    switch (type) {
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      default: return '#3b82f6'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column-reverse'
    }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={getToastStyles(toast.type)}>
          {toast.type === 'success' && <CheckCircle size={20} style={{ color: getIconColor(toast.type) }} />}
          {toast.type === 'error' && <XCircle size={20} style={{ color: getIconColor(toast.type) }} />}
          {toast.type === 'warning' && <AlertCircle size={20} style={{ color: getIconColor(toast.type) }} />}
          {toast.type === 'info' && <Info size={20} style={{ color: getIconColor(toast.type) }} />}
          <p style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            style={{
              marginLeft: '16px',
              padding: '4px',
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}