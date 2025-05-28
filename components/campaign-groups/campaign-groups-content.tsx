"use client"

import { useState } from "react"
import { useCampaignGroups } from "@/hooks/use-campaign-groups"
import { useAuth } from "@/contexts/AuthContext"
import type { CampaignGroup } from "@/lib/campaign-group-types"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CampaignGroupsTable from "./campaign-groups-table"
import CreateCampaignGroupDialog from "./create-campaign-group-dialog"

export default function CampaignGroupsContent() {
  const { user } = useAuth()
  
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

  if (loading) {
    return <div>Loading campaign groups...</div>
  }

  if (error) {
    return <div>Error loading campaign groups: {error}</div>
  }

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
