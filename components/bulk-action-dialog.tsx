"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useCampaignGroups } from "@/hooks/use-campaign-groups"

interface BulkActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  actionType: string
  selectedCampaignIds?: string[]
  profileId?: string  // 新增此行
  onSuccess?: () => void
}

export function BulkActionDialog({ 
  open, 
  onOpenChange, 
  selectedCount, 
  actionType,
  selectedCampaignIds,
  profileId,  // 新增此行
  onSuccess 
}: BulkActionDialogProps) {
  const [budgetAction, setBudgetAction] = useState<string>("set")
  const [budgetValue, setBudgetValue] = useState<string>("100")
  const [selectedState, setSelectedState] = useState<string>("paused")
  const [selectedOptGroup, setSelectedOptGroup] = useState<string>("unassigned")
  const [selectedBiddingStrategy, setSelectedBiddingStrategy] = useState<string>("dynamic-down")
  const [isApplying, setIsApplying] = useState(false)
  
  // 獲取用戶資訊和 campaign groups
  const { user } = useAuth()
  const { 
    campaignGroups, 
    loading: groupsLoading, 
    error: groupsError,
    assignCampaigns,
    removeCampaigns 
  } = useCampaignGroups(user?.id || '', profileId)  // 加入 profileId 參數

  const handleApply = async () => {
    let message = ""

    switch (actionType) {
      case "state":
        message = `Changed state to ${selectedState} for ${selectedCount} campaigns`
        toast.success(message)
        onOpenChange(false)
        break
        
      case "opt-group":
        if (!selectedCampaignIds || selectedCampaignIds.length === 0) {
          toast.error("No campaigns selected")
          return
        }
        
        setIsApplying(true)
        
        try {
          if (selectedOptGroup === "unassigned") {
            // Remove campaigns from their current groups
            let removedCount = 0
            const errors: string[] = []
            
            // For each campaign, we need to find its current group and remove it
            // This is a limitation - we'd need backend support to get current group assignments
            // For now, we'll use a generic approach
            
            // Get all groups and try to remove the campaigns from each
            for (const group of campaignGroups) {
              try {
                // Check if any of our selected campaigns are in this group
                const campaignsInGroup = selectedCampaignIds.filter(id => 
                  group.campaigns.includes(id)
                )
                
                if (campaignsInGroup.length > 0) {
                  const success = await removeCampaigns(group.id, campaignsInGroup)
                  if (success) {
                    removedCount += campaignsInGroup.length
                  }
                }
              } catch (err) {
                console.error(`Failed to remove campaigns from group ${group.name}:`, err)
              }
            }
            
            if (removedCount > 0) {
              message = `Removed ${removedCount} campaign${removedCount > 1 ? 's' : ''} from their groups`
            } else {
              message = `No campaigns were assigned to any groups`
            }
          } else {
            // 分配到群組
            const success = await assignCampaigns(selectedOptGroup, selectedCampaignIds)
            if (success) {
              const groupName = campaignGroups.find(g => g.id === selectedOptGroup)?.name || selectedOptGroup
              message = `Assigned ${selectedCount} campaign${selectedCount > 1 ? 's' : ''} to ${groupName}`
            } else {
              throw new Error("Failed to assign campaigns")
            }
          }
          
          toast.success(message)
          onOpenChange(false)
          onSuccess?.()
        } catch (error) {
          console.error("Failed to assign campaigns:", error)
          toast.error(`Failed to assign campaigns: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
          setIsApplying(false)
        }
        break
        
      case "bidding-strategy":
        message = `Changed bidding strategy to ${selectedBiddingStrategy} for ${selectedCount} campaigns`
        toast.success(message)
        onOpenChange(false)
        break
        
      case "budget":
        message = `${budgetAction === "set" ? "Set" : budgetAction} budget ${budgetAction !== "set" ? "by" : "to"} ${budgetValue}${budgetAction.includes("percentage") ? "%" : "$"} for ${selectedCount} campaigns`
        toast.success(message)
        onOpenChange(false)
        break
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {actionType === "state" && "Change Campaign State"}
            {actionType === "opt-group" && "Assign to Campaign Group"}
            {actionType === "bidding-strategy" && "Change Bidding Strategy"}
            {actionType === "budget" && "Change Campaign Budget"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {actionType === "state" && (
            <div className="space-y-4">
              <RadioGroup value={selectedState} onValueChange={setSelectedState}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="enabled" id="enabled" />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paused" id="paused" />
                  <Label htmlFor="paused">Paused</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="archived" id="archived" />
                  <Label htmlFor="archived">Archived</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {actionType === "opt-group" && (
            <div className="space-y-4">
              <Select value={selectedOptGroup} onValueChange={setSelectedOptGroup}>
                <SelectTrigger>
                  <SelectValue placeholder={groupsLoading ? "Loading groups..." : "Select optimization group"} />
                </SelectTrigger>
                <SelectContent>
                  {groupsLoading ? (
                    <SelectItem value="loading" disabled>Loading groups...</SelectItem>
                  ) : groupsError ? (
                    <>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="discovery">Discovery</SelectItem>
                      <SelectItem value="breakeven">Breakeven</SelectItem>
                      <SelectItem value="profit">Profit</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {campaignGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {actionType === "bidding-strategy" && (
            <div className="space-y-4">
              <Select value={selectedBiddingStrategy} onValueChange={setSelectedBiddingStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bidding strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dynamic-down">Dynamic bidding - down only</SelectItem>
                  <SelectItem value="dynamic-updown">Dynamic bidding - up and down</SelectItem>
                  <SelectItem value="fixed">Fixed bids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {actionType === "budget" && (
            <div className="space-y-4">
              <RadioGroup value={budgetAction} onValueChange={setBudgetAction}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="set" id="set" />
                  <Label htmlFor="set">Set budget to specific amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="increase-amount" id="increase-amount" />
                  <Label htmlFor="increase-amount">Increase budget by amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decrease-amount" id="decrease-amount" />
                  <Label htmlFor="decrease-amount">Decrease budget by amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="increase-percentage" id="increase-percentage" />
                  <Label htmlFor="increase-percentage">Increase budget by percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decrease-percentage" id="decrease-percentage" />
                  <Label htmlFor="decrease-percentage">Decrease budget by percentage</Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-2 pt-2">
                <Input
                  type="number"
                  value={budgetValue}
                  onChange={(e) => setBudgetValue(e.target.value)}
                  className="w-24"
                />
                <span>{budgetAction.includes("percentage") ? "%" : "$"}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isApplying}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isApplying}>
            {isApplying ? "Applying..." : `Apply to ${selectedCount} ${selectedCount === 1 ? "campaign" : "campaigns"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
