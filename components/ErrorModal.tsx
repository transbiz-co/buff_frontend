"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  buttonText: string
  onButtonClick: () => void
}

export default function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick,
}: ErrorModalProps) {
  const [showIcon, setShowIcon] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowIcon(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowIcon(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent>
        <DialogTitle className="text-center">{title}</DialogTitle>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-red-100 transition-all duration-500 ${showIcon ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-10 w-10 text-red-500 transition-all duration-500 ${showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{ transitionDelay: '0.2s', transformOrigin: 'center' }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="mb-6 text-gray-600 transition-opacity duration-300 delay-200" style={{ opacity: showIcon ? 1 : 0 }}>{message}</p>
          <button
            onClick={onButtonClick}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-300 hover:shadow-md"
            style={{
              opacity: showIcon ? 1 : 0.7,
              transform: showIcon ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              transitionDelay: '0.3s'
            }}
          >
            {buttonText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 