'use client'

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page min-h-screen flex flex-col justify-center items-center">
      {children}
    </div>
  )
}
