import Link from "next/link"
import { SignUpForm } from "@/components/sign-up-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up - Buff",
  description: "Create a new Buff account",
}

export default function SignUpPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold">Create an Account</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in your details to get started</p>
      </div>
      <SignUpForm />
      <div className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      </div>
    </div>
  )
}
