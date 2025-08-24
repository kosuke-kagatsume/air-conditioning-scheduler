'use client'

import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastMessage {
  id: string
  message: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    const newToast: ToastMessage = { id, message, type }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string) => {
    showToast(message, 'success')
  }, [showToast])

  const error = useCallback((message: string) => {
    showToast(message, 'error')
  }, [showToast])

  const warning = useCallback((message: string) => {
    showToast(message, 'warning')
  }, [showToast])

  const info = useCallback((message: string) => {
    showToast(message, 'info')
  }, [showToast])

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}