"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    if (!loading) {
      // 常規路由導航
      if (user) {
        console.log('Home: User authenticated, redirecting to bid-optimizer')
        router.replace("/bid-optimizer")
      } else {
        console.log('Home: User not authenticated, redirecting to sign-in')
        router.replace("/sign-in")
      }
    }
  }, [user, loading, router, searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  )
}
