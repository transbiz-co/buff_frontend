import ResetPasswordForm from "@/components/ResetPasswordForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password - Buff",
  description: "Reset your Buff account password",
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
} 