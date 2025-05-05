"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CampaignGroup, CampaignGroupFormData } from "@/lib/campaign-group-types"

interface CreateCampaignGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateGroup: (group: CampaignGroup) => void
}

export default function CreateCampaignGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
}: CreateCampaignGroupDialogProps) {
  const [formData, setFormData] = useState<CampaignGroupFormData>({
    name: "",
    targetAcos: 50,
    presetGoal: "Balanced",
    bidCeiling: undefined,
    bidFloor: undefined,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CampaignGroupFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CampaignGroupFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (formData.targetAcos < 0 || formData.targetAcos > 100) {
      newErrors.targetAcos = "Target ACoS must be between 0 and 100"
    }

    if (formData.bidCeiling !== undefined && formData.bidCeiling <= 0) {
      newErrors.bidCeiling = "Bid ceiling must be greater than 0"
    }

    if (formData.bidFloor !== undefined && formData.bidFloor <= 0) {
      newErrors.bidFloor = "Bid floor must be greater than 0"
    }

    if (
      formData.bidCeiling !== undefined &&
      formData.bidFloor !== undefined &&
      formData.bidCeiling <= formData.bidFloor
    ) {
      newErrors.bidCeiling = "Bid ceiling must be greater than bid floor"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const newGroup: CampaignGroup = {
      id: Date.now().toString(),
      ...formData,
      campaigns: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onCreateGroup(newGroup)

    // Reset form
    setFormData({
      name: "",
      targetAcos: 50,
      presetGoal: "Balanced",
      bidCeiling: undefined,
      bidFloor: undefined,
    })
    setErrors({})
  }

  const handleChange = (field: keyof CampaignGroupFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Campaign Group</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-medium text-gray-700">
              Group Name*
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetAcos" className="text-right font-medium text-gray-700">
              Target ACoS (%)*
            </Label>
            <div className="col-span-3">
              <Input
                id="targetAcos"
                type="number"
                min="0"
                max="100"
                value={formData.targetAcos}
                onChange={(e) => handleChange("targetAcos", Number.parseFloat(e.target.value))}
                className={errors.targetAcos ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.targetAcos && <p className="text-red-500 text-xs mt-1">{errors.targetAcos}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="presetGoal" className="text-right font-medium text-gray-700">
              Preset Goal*
            </Label>
            <div className="col-span-3">
              <Select value={formData.presetGoal} onValueChange={(value) => handleChange("presetGoal", value)}>
                <SelectTrigger className="focus-visible:ring-red-200">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Reduce ACoS">Reduce ACoS</SelectItem>
                  <SelectItem value="Increase Sales">Increase Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bidCeiling" className="text-right font-medium text-gray-700">
              Bid Ceiling ($)
            </Label>
            <div className="col-span-3">
              <Input
                id="bidCeiling"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional"
                value={formData.bidCeiling ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                  handleChange("bidCeiling", value)
                }}
                className={errors.bidCeiling ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.bidCeiling && <p className="text-red-500 text-xs mt-1">{errors.bidCeiling}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bidFloor" className="text-right font-medium text-gray-700">
              Bid Floor ($)
            </Label>
            <div className="col-span-3">
              <Input
                id="bidFloor"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional"
                value={formData.bidFloor ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                  handleChange("bidFloor", value)
                }}
                className={errors.bidFloor ? "border-red-500 focus-visible:ring-red-200" : ""}
              />
              {errors.bidFloor && <p className="text-red-500 text-xs mt-1">{errors.bidFloor}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSubmit}>
            Create Campaign Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
