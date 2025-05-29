import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getAmazonAdsConnectionStatus, AmazonAdsProfile } from '@/lib/api/connections'

interface UseAmazonConnectionsGuardResult {
  user: any
  hasConnections: boolean
  activeConnections: AmazonAdsProfile[]
  loading: boolean
  error: string | null
}

export const useAmazonConnectionsGuard = (): UseAmazonConnectionsGuardResult => {
  const { user, loading: authLoading } = useAuth()
  const [hasConnections, setHasConnections] = useState(false)
  const [activeConnections, setActiveConnections] = useState<AmazonAdsProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConnections = async () => {
      if (!user || authLoading) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const result = await getAmazonAdsConnectionStatus(user.id)
        const active = result.profiles.filter(profile => profile.isActive)
        
        // Sort by account name A-Z
        active.sort((a, b) => 
          a.accountName.toLowerCase().localeCompare(b.accountName.toLowerCase())
        )
        
        setActiveConnections(active)
        setHasConnections(active.length > 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check connections')
        setHasConnections(false)
        setActiveConnections([])
      } finally {
        setLoading(false)
      }
    }

    checkConnections()
  }, [user, authLoading])

  return {
    user,
    hasConnections,
    activeConnections,
    loading: loading || authLoading,
    error
  }
}