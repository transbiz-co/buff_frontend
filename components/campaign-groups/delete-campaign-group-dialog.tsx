"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CampaignGroup } from "@/lib/campaign-group-types"

interface DeleteCampaignGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignGroup: CampaignGroup | null
  onDeleteGroup: (groupId: string) => void
}

export default function DeleteCampaignGroupDialog({
  open,
  onOpenChange,
  campaignGroup,
  onDeleteGroup,
}: DeleteCampaignGroupDialogProps) {
  if (!campaignGroup) return null

  const handleDelete = () => {
    onDeleteGroup(campaignGroup.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Campaign Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Campaign Group &quot;{campaignGroup.name}&quot;? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
