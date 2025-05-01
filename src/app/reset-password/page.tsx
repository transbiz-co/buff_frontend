'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import SuccessModal from '@/components/SuccessModal'

// 創建一個包含 useSearchParams 的組件
function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  // 在 Next.js 15 中, useSearchParams 需要被包裝在 Suspense 邊界內
  // 所以我們在這個組件中使用它
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  )

  // 檢查是否有正確的參數 (從 Supabase 重置郵件中)
  useEffect(() => {
    // Supabase 會將 type=recovery 和 token 作為 URL 參數
    const type = searchParams.get('type')
    const token = searchParams.get('token')

    if (!type || type !== 'recovery' || !token) {
      // 如果沒有正確的參數，設置錯誤訊息
      setError('無效的密碼重置鏈接。請重新請求密碼重置。')
    }
  }, [searchParams])

  // 如果用戶已登入，重定向到儀表板
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // 處理密碼重置
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
      // 使用 Supabase 的更新密碼 API
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      
      if (error) throw error
      
      // 顯示成功模態框
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

  // 處理成功模態框關閉
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
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
              disabled={!!error && !error.includes('密碼')}
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
              disabled={!!error && !error.includes('密碼')}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (!!error && !error.includes('密碼'))}
            className={`w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md btn-primary ${
              (isLoading || (!!error && !error.includes('密碼'))) ? 'opacity-70 cursor-not-allowed' : ''
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

// 主頁面組件，使用 Suspense 包裹 ResetPasswordForm
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
