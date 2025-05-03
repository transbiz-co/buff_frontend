'use client'

import { ReactNode } from 'react'
import DashboardLayout from '@/components/Layout'
import './styles.css'

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
} 