'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ConfirmationModal from '@/components/ConfirmationModal'
import SuccessModal from '@/components/SuccessModal'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/bid-optimizer')
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setIsLoading(false)
        setError(null)
        router.replace('/bid-optimizer')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 處理忘記密碼流程
  const handleForgotPassword = async (emailToReset?: string) => {
    // 如果通過模態框提供了電子郵件，使用它，否則使用表單中的電子郵件
    const emailAddress = emailToReset || email
    
    if (!emailAddress) {
      setError('請提供您的電子郵件地址')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // 修改方案：使用自定義選項
      const { error } = await supabase.auth.resetPasswordForEmail(emailAddress, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      
      // 顯示成功模態框
      setShowResetSuccessModal(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('發生未知錯誤')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="auth-container">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Sign In</h1>
          <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs text-red-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md btn-primary"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <Link href="/sign-up" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>

      {/* 忘記密碼確認模態框 */}
      <ConfirmationModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        title="重置密碼"
        message="請輸入您的電子郵件地址，我們將發送重置密碼的鏈接給您。"
        confirmText="發送重置連結"
        onConfirm={handleForgotPassword}
        requireEmail={true}
      />

      {/* 密碼重置成功模態框 */}
      <SuccessModal
        isOpen={showResetSuccessModal}
        onClose={() => setShowResetSuccessModal(false)}
        title="重置連結已發送"
        message="我們已向您的電子郵件地址發送了密碼重置鏈接。請檢查您的收件箱，並按照電子郵件中的說明進行操作。"
        buttonText="了解"
        onButtonClick={() => setShowResetSuccessModal(false)}
      />
    </div>
  )
}
