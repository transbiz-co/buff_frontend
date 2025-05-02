'use client'

import { ReactNode } from 'react'
import DashboardLayout from '@/components/Layout'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
