"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface BulkActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  actionType: string
}

export function BulkActionDialog({ open, onOpenChange, selectedCount, actionType }: BulkActionDialogProps) {
  const [budgetAction, setBudgetAction] = useState<string>("set")
  const [budgetValue, setBudgetValue] = useState<string>("100")
  const [selectedState, setSelectedState] = useState<string>("paused")
  const [selectedOptGroup, setSelectedOptGroup] = useState<string>("discovery")
  const [selectedBiddingStrategy, setSelectedBiddingStrategy] = useState<string>("dynamic-down")

  const handleApply = () => {
    let message = ""

    switch (actionType) {
      case "state":
        message = `Changed state to ${selectedState} for ${selectedCount} campaigns`
        break
      case "opt-group":
        message = `Assigned ${selectedCount} campaigns to ${selectedOptGroup} optimization group`
        break
      case "bidding-strategy":
        message = `Changed bidding strategy to ${selectedBiddingStrategy} for ${selectedCount} campaigns`
        break
      case "budget":
        message = `${budgetAction === "set" ? "Set" : budgetAction} budget ${budgetAction !== "set" ? "by" : "to"} ${budgetValue}${budgetAction.includes("percentage") ? "%" : "$"} for ${selectedCount} campaigns`
        break
    }

    toast.success(message)
    onOpenChange(false)
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
                  <SelectValue placeholder="Select optimization group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="breakeven">Breakeven</SelectItem>
                  <SelectItem value="profit">Profit</SelectItem>
                  <SelectItem value="not-set">Not Set</SelectItem>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply to {selectedCount} {selectedCount === 1 ? "campaign" : "campaigns"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
