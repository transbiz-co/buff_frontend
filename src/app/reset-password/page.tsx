'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import SuccessModal from '@/components/SuccessModal'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [validResetToken, setValidResetToken] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, signOut } = useAuth()

  // 檢查是否有有效會話
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setError('發生會話錯誤，請重新請求密碼重置。');
          return;
        }
        
        // 如果有會話，我們假設用戶已通過有效的重置令牌
        if (data.session) {
          setValidResetToken(true);
          setError(null); // 清除任何先前的錯誤
        } else {
          // 只有在沒有活動會話時才檢查 URL 參數
          setValidResetToken(false);
          setError('無法驗證重置會話，請確保您點擊的是完整的重置鏈接。');
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError('檢查會話時發生錯誤，請重試。');
      }
    };
    
    checkSession();
  }, [searchParams]);

  // 當用戶通過重置鏈接被自動登入時，我們不重定向他們，而是保持在重置密碼頁面
  useEffect(() => {
    // 在此頁面不要自動重定向到儀表板，因為我們需要用戶設置新密碼
    if (!loading && !validResetToken && !user) {
      // 只有在確定沒有有效令牌時才重定向
      router.replace('/sign-in')
    }
  }, [user, loading, router, validResetToken])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

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
  const handleSuccessModalClose = async () => {
    setShowSuccessModal(false)
    
    // 登出用戶，這樣他們必須使用新密碼登入
    if (user) {
      await signOut()
    }
    
    router.replace('/sign-in')
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
              disabled={!validResetToken}
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
              disabled={!validResetToken}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !validResetToken}
            className={`w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md btn-primary ${
              (isLoading || !validResetToken) ? 'opacity-70 cursor-not-allowed' : ''
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
