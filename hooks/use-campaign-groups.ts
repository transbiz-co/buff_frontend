import { useState, useEffect, useCallback } from 'react'
import { campaignGroupsApi } from '@/lib/api/campaign-groups'
import { 
  CampaignGroup, 
  CampaignGroupFormData, 
  CampaignGroupListResponse 
} from '@/lib/campaign-group-types'
import { toast } from 'sonner'

interface UseCampaignGroupsResult {
  // Data
  campaignGroups: CampaignGroup[]
  unassignedCampaignsCount: number
  loading: boolean
  error: string | null
  
  // Actions
  createGroup: (data: CampaignGroupFormData) => Promise<CampaignGroup | null>
  updateGroup: (id: string, data: Partial<CampaignGroupFormData>) => Promise<CampaignGroup | null>
  deleteGroup: (id: string) => Promise<boolean>
  assignCampaigns: (groupId: string, campaignIds: string[]) => Promise<boolean>
  removeCampaigns: (groupId: string, campaignIds: string[]) => Promise<boolean>
  refreshGroups: () => Promise<void>
}

export const useCampaignGroups = (userId: string): UseCampaignGroupsResult => {
  const [campaignGroups, setCampaignGroups] = useState<CampaignGroup[]>([])
  const [unassignedCampaignsCount, setUnassignedCampaignsCount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch campaign groups
  const fetchGroups = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await campaignGroupsApi.getGroups(userId)
      setCampaignGroups(response.groups)
      setUnassignedCampaignsCount(response.unassigned_campaigns_count)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaign groups'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Create a new campaign group
  const createGroup = useCallback(async (data: CampaignGroupFormData): Promise<CampaignGroup | null> => {
    try {
      setLoading(true)
      const newGroup = await campaignGroupsApi.createGroup(data, userId)
      
      // Update local state
      setCampaignGroups(prev => [...prev, newGroup])
      
      toast.success('Campaign group created successfully')
      return newGroup
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign group'
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Update an existing campaign group
  const updateGroup = useCallback(async (
    id: string, 
    data: Partial<CampaignGroupFormData>
  ): Promise<CampaignGroup | null> => {
    try {
      setLoading(true)
      const updatedGroup = await campaignGroupsApi.updateGroup(id, data, userId)
      
      // Update local state
      setCampaignGroups(prev => 
        prev.map(group => group.id === id ? updatedGroup : group)
      )
      
      toast.success('Campaign group updated successfully')
      return updatedGroup
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign group'
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Delete a campaign group
  const deleteGroup = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      await campaignGroupsApi.deleteGroup(id, userId)
      
      // Update local state
      setCampaignGroups(prev => prev.filter(group => group.id !== id))
      
      // Refresh to update unassigned campaigns count
      await fetchGroups()
      
      toast.success('Campaign group deleted successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign group'
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [userId, fetchGroups])

  // Assign campaigns to a group
  const assignCampaigns = useCallback(async (
    groupId: string, 
    campaignIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true)
      await campaignGroupsApi.assignCampaigns(groupId, campaignIds, userId)
      
      // Refresh groups to get updated campaign assignments
      await fetchGroups()
      
      toast.success(`${campaignIds.length} campaigns assigned successfully`)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign campaigns'
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [userId, fetchGroups])

  // Remove campaigns from a group
  const removeCampaigns = useCallback(async (
    groupId: string, 
    campaignIds: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true)
      await campaignGroupsApi.removeCampaigns(groupId, campaignIds, userId)
      
      // Refresh groups to get updated campaign assignments
      await fetchGroups()
      
      toast.success(`${campaignIds.length} campaigns removed successfully`)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove campaigns'
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [userId, fetchGroups])

  // Initial fetch
  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  return {
    // Data
    campaignGroups,
    unassignedCampaignsCount,
    loading,
    error,
    
    // Actions
    createGroup,
    updateGroup,
    deleteGroup,
    assignCampaigns,
    removeCampaigns,
    refreshGroups: fetchGroups
  }
}