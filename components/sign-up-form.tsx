"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { signUpWithEmail } from "@/lib/supabase"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const displayName = formData.get("displayName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const invitationCode = formData.get("invitationCode") as string

    try {
      // 檢查邀請碼
      const validInvitationCode = process.env.NEXT_PUBLIC_INVITATION_CODE
      if (!validInvitationCode) {
        throw new Error("System error: Invitation code not configured")
      }
      
      if (invitationCode !== validInvitationCode) {
        throw new Error("Invalid invitation code")
      }

      // 使用 Supabase 註冊
      await signUpWithEmail(email, password, displayName)

      toast.success("Account created! Please check your email to confirm your account.")

      // 重定向到登入頁面
      router.push("/sign-in")
    } catch (err) {
      console.error('Registration error:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : "There was a problem creating your account. Please try again."
      )
      
      toast.error("Registration failed. Please check your information and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input id="displayName" name="displayName" placeholder="Transbiz" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="name@example.com" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="invitationCode">Invitation Code</Label>
        <Input id="invitationCode" name="invitationCode" placeholder="Enter your invitation code" required />
        <p className="text-xs text-gray-500">
          Required for private beta access. Contact your consultant if you don't have a code.
        </p>
      </div>
      
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
