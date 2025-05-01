'use client'

import Modal from './Modal'
import { useState, useEffect } from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText: string
  cancelText?: string
  onConfirm: (email?: string) => void
  requireEmail?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  cancelText = '取消',
  onConfirm,
  requireEmail = false,
}: ConfirmationModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // 延遲啟動內容動畫
      const timer = setTimeout(() => {
        setAnimateIn(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimateIn(false)
      // 當模態框關閉時重置狀態
      setEmail('')
      setError('')
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (requireEmail && !email.trim()) {
      setError('請輸入您的電子郵件地址')
      return
    }

    if (requireEmail && !/\S+@\S+\.\S+/.test(email)) {
      setError('請輸入有效的電子郵件地址')
      return
    }

    onConfirm(requireEmail ? email : undefined)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <p className={`mb-4 text-gray-600 transition-all duration-300 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {message}
        </p>

        {requireEmail && (
          <div className={`mb-4 transition-all duration-300 ${
            animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`} style={{ transitionDelay: '0.1s' }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              className="w-full transition-all duration-200 border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              placeholder="請輸入您的電子郵件地址"
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 transition-all duration-300" 
                style={{ animation: error ? 'shake 0.5s ease-in-out' : 'none' }}>
                {error}
              </p>
            )}
          </div>
        )}

        <div className={`flex justify-end space-x-2 mt-6 transition-all duration-300 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '0.2s' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 btn-primary transition-all duration-200 hover:shadow-md"
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* 添加動畫關鍵幀 */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </Modal>
  )
}
