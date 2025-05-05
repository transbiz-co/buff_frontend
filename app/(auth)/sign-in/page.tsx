import Link from "next/link"
import { SignInForm } from "@/components/sign-in-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Buff",
  description: "Sign in to your Buff account",
}

export default function SignInPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Sign In</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>
      <SignInForm />
      <div className="mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:text-primary/90">
          Sign up
        </Link>
      </div>
    </div>
  )
}
