'use client'

import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full min-h-screen">
      {/* 這裡可以添加導航欄、側邊欄等 */}
      <main className="w-full">{children}</main>
      {/* 這裡可以添加頁腳 */}
    </div>
  )
}
