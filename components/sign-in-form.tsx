"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { signInWithEmail } from "@/lib/supabase"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // 使用 Supabase 進行身份驗證
      await signInWithEmail(email, password)

      toast.success("登入成功！您已成功登入系統。")

      // 重新整理頁面以確保導航後能獲取到最新的身份驗證狀態
      router.refresh()
      
      // 導航到 bid-optimizer 頁面，而非 dashboard
      router.push("/bid-optimizer")
    } catch (err) {
      console.error('登入錯誤:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : "登入失敗，請檢查您的電子郵件和密碼，然後重試。"
      )
      
      toast.error("無效的電子郵件或密碼，請重試。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">電子郵件</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">密碼</Label>
          <a href="#" className="text-xs text-primary hover:text-primary/90">
            忘記密碼？
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
      
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? "登入中..." : "登入"}
      </Button>
    </form>
  )
}
