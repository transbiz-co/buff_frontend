export interface CampaignGroup {
  id: string
  name: string
  targetAcos: number
  presetGoal: "Balanced" | "Reduce ACoS" | "Increase Sales"
  bidCeiling?: number
  bidFloor?: number
  campaigns: string[]
  createdAt: string
  updatedAt: string
}

export interface CampaignGroupFormData {
  name: string
  targetAcos: number
  presetGoal: "Balanced" | "Reduce ACoS" | "Increase Sales"
  bidCeiling?: number
  bidFloor?: number
}
