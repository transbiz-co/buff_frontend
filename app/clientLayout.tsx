"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "sonner"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up"

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {isAuthPage ? (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">{children}</div>
          ) : (
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-auto bg-[#f8f9fa]">
                <main className="min-h-screen w-full">{children}</main>
              </div>
            </div>
          )}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
