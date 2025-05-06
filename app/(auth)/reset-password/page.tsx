"use client"

import ResetPasswordForm from "@/components/ResetPasswordForm"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ResetPasswordPage() {
  const { user, loading, isPasswordRecovery } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localRecovery, setLocalRecovery] = useState(false)
  
  useEffect(() => {
    if (!loading) {
      // 檢查是否為密碼重設流程
      const type = searchParams.get('type')
      const accessToken = searchParams.get('access_token')
      
      // 標記為密碼重置流程，避免自動重定向
      if (type === 'recovery' || accessToken) {
        console.log('Password recovery flow confirmed on reset-password page')
        setLocalRecovery(true)
      } else if (!user && !isPasswordRecovery) {
        // 如果不是密碼重置流程，且用戶未登入，重定向到登入頁面
        console.log('Not a password recovery flow and user not logged in, redirecting to sign-in')
        router.replace('/sign-in')
      }
    }
  }, [user, loading, router, searchParams, isPasswordRecovery])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 bg-white/95 dark:bg-gray-800/95 p-8 rounded-xl shadow-md backdrop-blur-sm">
        <ResetPasswordForm />
      </div>
    </main>
  )
} 