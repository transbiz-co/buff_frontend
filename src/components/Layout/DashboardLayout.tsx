'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onExpandChange={setIsSidebarExpanded} />
      <main className={`flex-1 transition-all duration-300 ease-in-out w-full ${
        isSidebarExpanded ? 'mt-[320px]' : 'mt-16'
      } md:mt-0 overflow-x-hidden`}>
        <div className="p-3 sm:p-4 md:p-6 max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
