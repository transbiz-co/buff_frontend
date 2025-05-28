"use client"

import { useRouter } from "next/navigation"
import { EmptyState } from "@/components/ui/empty-state"
import { ExternalLink } from "lucide-react"
import { useAmazonConnectionsGuard } from "@/hooks/use-amazon-connections-guard"

interface AmazonConnectionsGuardProps {
  children: React.ReactNode
  pageName: string
  description?: string
}

export function AmazonConnectionsGuard({ 
  children, 
  pageName, 
  description 
}: AmazonConnectionsGuardProps) {
  const router = useRouter()
  const { user, hasConnections, loading, error } = useAmazonConnectionsGuard()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in to continue</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!hasConnections) {
    return (
      <EmptyState
        icon={ExternalLink}
        title="No Amazon Connections Found"
        description={description || `Connect your Amazon Advertising account to access ${pageName} and manage your advertising campaigns.`}
        action={{
          label: "Connect Amazon Account",
          onClick: () => router.push('/connections')
        }}
      />
    )
  }

  return <>{children}</>
}