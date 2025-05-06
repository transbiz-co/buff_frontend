"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "sonner"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import AuthGuard from "@/components/AuthGuard"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/reset-password"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {isAuthPage ? (
              <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">{children}</div>
            ) : (
              <AuthGuard>
                <div className="flex h-screen">
                  <Sidebar />
                  <div className="flex-1 overflow-auto bg-[#f8f9fa]">
                    <main className="min-h-screen w-full">{children}</main>
                  </div>
                </div>
              </AuthGuard>
            )}
          </AuthProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
