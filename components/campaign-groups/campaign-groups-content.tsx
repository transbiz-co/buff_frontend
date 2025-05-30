"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCampaignGroups } from "@/hooks/use-campaign-groups"
import { useAuth } from "@/contexts/AuthContext"
import { getAmazonAdsConnectionStatus } from "@/lib/api/connections"
import type { CampaignGroup } from "@/lib/campaign-group-types"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { PlusCircle, ExternalLink } from "lucide-react"
import CampaignGroupsTable from "./campaign-groups-table"
import CreateCampaignGroupDialog from "./create-campaign-group-dialog"

export default function CampaignGroupsContent() {
  const { user } = useAuth()
  const router = useRouter()
  
  // 添加 Amazon connections 狀態
  const [hasAmazonConnections, setHasAmazonConnections] = useState<boolean | null>(null)
  const [checkingConnections, setCheckingConnections] = useState(true)
  
  const { 
    campaignGroups, 
    unassignedCampaignsCount,
    loading, 
    error, 
    createGroup, 
    updateGroup, 
    deleteGroup
  } = useCampaignGroups(user?.id || '')
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // 檢查 Amazon connections
  useEffect(() => {
    const checkAmazonConnections = async () => {
      if (!user) {
        setHasAmazonConnections(false)
        setCheckingConnections(false)
        return
      }

      try {
        const result = await getAmazonAdsConnectionStatus(user.id)
        const hasActiveConnections = result.isConnected && 
          result.profiles.some(profile => profile.isActive)
        setHasAmazonConnections(hasActiveConnections)
      } catch (error) {
        console.error('Failed to check Amazon connections:', error)
        setHasAmazonConnections(false)
      } finally {
        setCheckingConnections(false)
      }
    }

    checkAmazonConnections()
  }, [user])

  const handleCreateCampaignGroup = async (newGroup: CampaignGroup) => {
    try {
      await createGroup({
        name: newGroup.name,
        description: newGroup.description,
        targetAcos: newGroup.targetAcos,
        presetGoal: newGroup.presetGoal,
        bidCeiling: newGroup.bidCeiling,
        bidFloor: newGroup.bidFloor
      })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create campaign group:', error)
    }
  }

  // 載入狀態
  if (checkingConnections || loading) {
    return <div>Loading campaign groups...</div>
  }

  // 錯誤狀態
  if (error) {
    return <div>Error loading campaign groups: {error}</div>
  }

  // 無 Amazon connections 狀態
  if (!hasAmazonConnections) {
    return (
      <EmptyState
        icon={ExternalLink}
        title="No Amazon Connections Found"
        description="Connect your Amazon Advertising account to create and manage campaign groups for better organization of your advertising campaigns."
        action={{
          label: "Connect Amazon Account",
          onClick: () => router.push('/connections')
        }}
      />
    )
  }

  // 原有的正常內容
  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create a New Campaign Group
        </Button>
      </div>

      <CampaignGroupsTable 
        campaignGroups={campaignGroups} 
        unassignedCount={unassignedCampaignsCount}
        onUpdateGroup={updateGroup}
        onDeleteGroup={deleteGroup}
      />

      <CreateCampaignGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateGroup={handleCreateCampaignGroup}
      />
    </div>
  )
}
