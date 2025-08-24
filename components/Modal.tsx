'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return 'min(400px, 95vw)'
      case 'md': return 'min(500px, 95vw)'
      case 'lg': return 'min(700px, 95vw)'
      case 'xl': return 'min(900px, 95vw)'
      default: return 'min(500px, 95vw)'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.3s'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div style={{
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: getMaxWidth(),
        maxHeight: '90vh',
        overflow: 'auto',
        transform: 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {title && (
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} style={{ color: '#6b7280' }} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div style={{ padding: '12px 16px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Confirm Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  type = 'info'
}: ConfirmDialogProps) {
  const getConfirmButtonStyle = () => {
    const baseStyle = {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    }
    
    switch (type) {
      case 'danger':
        return { ...baseStyle, backgroundColor: '#dc2626', color: 'white' }
      case 'warning':
        return { ...baseStyle, backgroundColor: '#f59e0b', color: 'white' }
      default:
        return { ...baseStyle, backgroundColor: '#3b82f6', color: 'white' }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#6b7280', lineHeight: '1.5' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            style={getConfirmButtonStyle()}
            onMouseEnter={(e) => {
              const currentBg = e.currentTarget.style.backgroundColor
              if (currentBg === 'rgb(220, 38, 38)') e.currentTarget.style.backgroundColor = '#b91c1c'
              else if (currentBg === 'rgb(245, 158, 11)') e.currentTarget.style.backgroundColor = '#d97706'
              else e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              if (type === 'danger') e.currentTarget.style.backgroundColor = '#dc2626'
              else if (type === 'warning') e.currentTarget.style.backgroundColor = '#f59e0b'
              else e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}