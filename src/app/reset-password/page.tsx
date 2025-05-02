'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import SuccessModal from '@/components/SuccessModal'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [validToken, setValidToken] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, signOut } = useAuth()

  // 檢查 URL 參數
  useEffect(() => {
    const checkParams = async () => {
      const type = searchParams.get('type')
      const token = searchParams.get('access_token') || searchParams.get('token')
      
      // 如果沒有有效參數，顯示錯誤
      if (!type || type !== 'recovery' || !token) {
        setValidToken(false)
        setError('無效的密碼重置鏈接。請重新請求密碼重置。')
        return
      }
      
      // 如果用戶因令牌自動登入了，我們不需要顯示錯誤
      if (user) {
        setValidToken(true)
        setError(null)
      }
    }
    
    if (!loading) {
      checkParams()
    }
  }, [searchParams, loading, user])

  // 處理 Supabase 自動登入的情況
  // 這個效應不會自動重定向用戶到 dashboard
  useEffect(() => {
    // 我們不再自動重定向用戶，而是讓他們留在重置頁面
    // 如果用戶已經登入（通過令牌），我們不做任何特殊處理
  }, [user, loading, router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 驗證密碼
    if (password !== confirmPassword) {
      setError('密碼不匹配。請確保兩次輸入的密碼相同。')
      return
    }

    if (password.length < 6) {
      setError('密碼必須至少有 6 個字符。')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // 嘗試更新密碼
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      
      if (error) throw error
      
      // 密碼更新成功，顯示成功模態框
      setShowSuccessModal(true)
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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    // 登出用戶以清除當前的臨時會話
    signOut && signOut()
    // 重定向到登入頁面
    router.replace('/sign-in')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="auth-container">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
          <p className="text-gray-600 text-sm">Enter your new password below</p>
        </div>

        {/* 如果用戶已經通過令牌登入，顯示說明訊息 */}
        {user && (
          <div className="p-3 mb-4 rounded-lg bg-blue-50 text-blue-600 text-sm">
            您已通過重置鏈接驗證。請設置新密碼。
          </div>
        )}

        {validToken ? (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className={`w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md btn-primary ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-sm">
              {error || '無效的重置鏈接。請重新請求密碼重置。'}
            </div>
            <Link 
              href="/sign-in" 
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md btn-primary"
            >
              返回登入頁面
            </Link>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Remember your password?</span>{' '}
          <Link href="/sign-in" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>

      {/* 密碼重置成功模態框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="密碼已重置"
        message="您的密碼已成功重置。現在您可以使用新密碼登入您的帳戶。"
        buttonText="返回登入"
        onButtonClick={handleSuccessModalClose}
      />
    </div>
  )
}
