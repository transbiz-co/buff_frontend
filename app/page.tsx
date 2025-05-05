"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // 已登入，重定向到 bid-optimizer 頁面
        router.push("/bid-optimizer")
      } else {
        // 未登入，重定向到登入頁面
        router.push("/sign-in")
      }
    }
  }, [user, isLoading, router])

  // 顯示加載狀態或者直接返回空內容
  return null
}
