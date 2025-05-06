"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { verifyInvitationCode } from "@/lib/invitationCode"
import SuccessModal from "@/components/SuccessModal"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const router = useRouter()

  function handleCloseSuccessModal() {
    setShowSuccessModal(false)
    router.push("/sign-in")
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const displayName = formData.get("displayName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const invitationCode = formData.get("invitationCode") as string

    if (!verifyInvitationCode(invitationCode)) {
      toast.error("Invalid invitation code.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { displayName },
        },
      })
      if (error) throw error
      setShowSuccessModal(true)
    } catch (error: any) {
      toast.error(error.message || "There was a problem creating your account.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input id="displayName" name="displayName" placeholder="Your display name" required autoComplete="nickname" />
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      {/* Registration Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Registration Successful!"
        message="Thank you for registering! We've sent a verification link to your email. Please check your inbox and click the link to verify your account."
        buttonText="Go to Sign In"
        onButtonClick={handleCloseSuccessModal}
      />
    </>
  )
}
