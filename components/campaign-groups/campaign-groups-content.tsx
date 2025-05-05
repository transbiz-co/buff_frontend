"use client"

import { useState } from "react"
import { mockCampaignGroups, unassignedCampaignsCount } from "@/lib/mock-campaign-groups"
import type { CampaignGroup } from "@/lib/campaign-group-types"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import CampaignGroupsTable from "./campaign-groups-table"
import CreateCampaignGroupDialog from "./create-campaign-group-dialog"

export default function CampaignGroupsContent() {
  const [campaignGroups, setCampaignGroups] = useState<CampaignGroup[]>(mockCampaignGroups)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateCampaignGroup = (newGroup: CampaignGroup) => {
    setCampaignGroups([newGroup, ...campaignGroups])
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create a New Campaign Group
        </Button>
      </div>

      <CampaignGroupsTable campaignGroups={campaignGroups} unassignedCount={unassignedCampaignsCount} />

      <CreateCampaignGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateGroup={handleCreateCampaignGroup}
      />
    </div>
  )
}
