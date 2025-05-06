"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const router = useRouter()
  const { user, loading, isPasswordRecovery } = useAuth()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (!loading) {
      // 檢查是否為密碼重置流程
      const type = searchParams.get('type')
      const accessToken = searchParams.get('access_token')
      const isRecoveryFlow = type === 'recovery' || accessToken || isPasswordRecovery
      
      if (isRecoveryFlow) {
        console.log('Home: Password recovery flow detected, redirecting to reset-password')
        router.replace("/reset-password")
      } else if (user) {
        // 常規路由導航 - 已登入
        console.log('Home: User authenticated, redirecting to bid-optimizer')
        router.replace("/bid-optimizer")
      } else {
        // 常規路由導航 - 未登入
        console.log('Home: User not authenticated, redirecting to sign-in')
        router.replace("/sign-in")
      }
    }
  }, [user, loading, router, searchParams, isPasswordRecovery])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  )
}
