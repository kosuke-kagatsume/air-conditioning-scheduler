'use client'

import { useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import QRCode from 'qrcode'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  data: string
  description?: string
}

export default function QRCodeModal({ isOpen, onClose, title, data, description }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [downloadUrl, setDownloadUrl] = useState<string>('')

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error(error)
        else {
          // Create download URL
          canvasRef.current?.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              setDownloadUrl(url)
            }
          })
        }
      })
    }
  }, [isOpen, data])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = downloadUrl
    link.click()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data)
    // Show copied feedback
    const button = document.getElementById('copy-btn')
    if (button) {
      const originalText = button.textContent
      button.textContent = 'コピーしました！'
      setTimeout(() => {
        button.textContent = originalText
      }, 2000)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
        
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">登録用URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={data}
              readOnly
              className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 py-1"
            />
            <button
              id="copy-btn"
              onClick={handleCopyLink}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              コピー
            </button>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            画像をダウンロード
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  )
}