'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { verifyInvitationCode } from '@/lib/invitationCode'
import SuccessModal from '@/components/SuccessModal'

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // 驗證邀請碼
      if (!isCodeVerified && !verifyInvitationCode(invitationCode)) {
        setError('Invalid invitation code. Please check and try again.')
        setIsLoading(false)
        return
      }
      
      // 如果邀請碼有效，繼續註冊流程
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            invitation_code: invitationCode
          }
        }
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
        setError('發生未知錯誤')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 當邀請碼輸入框值改變時的處理函數
  const handleInvitationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value
    setInvitationCode(newCode)
    
    // 重設驗證狀態
    if (isCodeVerified) {
      setIsCodeVerified(false)
    }
  }

  // 當邀請碼輸入框失去焦點時進行驗證
  const handleInvitationCodeBlur = () => {
    if (invitationCode.trim() !== '') {
      const isValid = verifyInvitationCode(invitationCode)
      setIsCodeVerified(isValid)
      
      if (!isValid) {
        setError('無效的邀請碼。請檢查後重試。')
      } else {
        setError(null)
      }
    }
  }

  // 關閉模態框並重定向到登入頁面
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    router.replace('/sign-in')
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="auth-container">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Create an Account</h1>
          <p className="text-gray-600 text-sm">Fill in your details to get started</p>
        </div>

        <form className="space-y-5" onSubmit={handleSignUp}>
          <div className="space-y-1">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700">
              Invitation Code
            </label>
            <div className="relative">
              <input
                id="invitationCode"
                name="invitationCode"
                type="text"
                required
                placeholder="Enter your invitation code"
                value={invitationCode}
                onChange={handleInvitationCodeChange}
                onBlur={handleInvitationCodeBlur}
                className={`pr-10 ${isCodeVerified ? 'border-green-500' : ''}`}
              />
              {isCodeVerified && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Required for private beta access. Contact your consultant if you don&apos;t have a code.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-white rounded-md btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{' '}
          <Link href="/sign-in" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>

      {/* 註冊成功模態框 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Registration Successful!"
        message="Thank you for registering! We've sent a verification link to your email. Please check your inbox and click the link to verify your account."
        buttonText="Go to Sign In"
        onButtonClick={handleCloseSuccessModal}
      />
    </div>
  )
}
