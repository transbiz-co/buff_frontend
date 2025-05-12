"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false
}: ConfirmModalProps) {
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

  const handleCancel = () => {
    onClose()
    onCancel()
  }

  const handleConfirm = () => {
    onClose()
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleCancel() }}>
      <DialogContent>
        <DialogTitle className="text-center">{title}</DialogTitle>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${destructive ? 'bg-red-100' : 'bg-amber-100'} transition-all duration-500 ${showIcon ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
              <AlertTriangle
                className={`h-10 w-10 ${destructive ? 'text-red-500' : 'text-amber-500'} transition-all duration-500 ${showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{ transitionDelay: '0.2s', transformOrigin: 'center' }}
              />
            </div>
          </div>
          <p className="mb-6 text-gray-600 transition-opacity duration-300 delay-200" style={{ opacity: showIcon ? 1 : 0 }}>{message}</p>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-all duration-300 hover:shadow-md"
              style={{
                opacity: showIcon ? 1 : 0.7,
                transform: showIcon ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                transitionDelay: '0.3s'
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2 ${destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'} text-white rounded-md transition-all duration-300 hover:shadow-md`}
              style={{
                opacity: showIcon ? 1 : 0.7,
                transform: showIcon ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                transitionDelay: '0.3s'
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 