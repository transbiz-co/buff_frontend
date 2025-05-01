'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  buttonText: string
  onButtonClick: () => void
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick,
}: SuccessModalProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)

  // 為成功圖標添加延遲動畫效果
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowCheckmark(true)
      }, 300) // 稍微延遲，讓模態框先顯示
      return () => clearTimeout(timer)
    } else {
      setShowCheckmark(false)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        {/* 成功圖標 */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-green-100 transition-all duration-500 ${
            showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-10 w-10 text-green-500 transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ 
                transitionDelay: '0.2s',
                transformOrigin: 'center'
              }}
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* 訊息 */}
        <p className="mb-6 text-gray-600 transition-opacity duration-300 delay-200" style={{ 
          opacity: showCheckmark ? 1 : 0 
        }}>{message}</p>

        {/* 按鈕 */}
        <button
          onClick={onButtonClick}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md btn-primary transition-all duration-300 hover:shadow-md"
          style={{ 
            opacity: showCheckmark ? 1 : 0.7,
            transform: showCheckmark ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, box-shadow 0.2s ease',
            transitionDelay: '0.3s'
          }}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  )
}
