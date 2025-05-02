'use client'

import { useEffect, useRef, ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  // 處理組件掛載
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // 處理動畫
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // 小延遲確保 DOM 更新後再顯示動畫
      const timer = setTimeout(() => {
        setShow(true)
      }, 10)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShow(false)
      }, 10)
      document.body.style.overflow = 'auto'
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // 處理 Esc 鍵關閉模態框
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 處理點擊模態框外部關閉
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  // 為了避免 SSR 問題，使用 createPortal 在客戶端渲染
  if (!mounted || !isOpen) return null

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        show ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
      style={{ 
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease'
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md px-6 py-5 mx-4 bg-white rounded-lg shadow-xl transition-all duration-300 ${
          show 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
        style={{ 
          transformOrigin: 'center',
          transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
        }}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* 標題 */}
        <div className="mb-3 sm:mb-4 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
        </div>

        {/* 內容 */}
        <div className="mt-1 sm:mt-2">{children}</div>
      </div>
    </div>,
    document.body
  )
}
