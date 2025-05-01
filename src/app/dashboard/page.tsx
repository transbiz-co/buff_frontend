'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

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
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={signOut}
            className="btn-primary px-4 py-2 text-sm font-medium"
          >
            登出
          </button>
        </div>
        <div className="card">
          <p className="text-gray-600">歡迎來到 Buff 儀表板</p>
        </div>
      </div>
    </div>
  )
}
