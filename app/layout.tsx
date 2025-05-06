import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"
import './globals.css'

export const metadata: Metadata = {
  title: "Buff - Amazon FBA Optimization",
  description: "AI-powered optimization for Amazon FBA sellers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}