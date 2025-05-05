"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // 用戶未登入，重定向到登入頁面
      router.push('/sign-in')
    }
  }, [user, isLoading, router])

  // 顯示加載狀態
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  // 如果正在重定向或用戶未登入，不渲染子元素
  if (!user) {
    return null
  }

  // 用戶已登入，渲染子元素
  return <>{children}</>
} 