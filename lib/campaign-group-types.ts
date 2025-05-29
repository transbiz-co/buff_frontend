export interface CampaignGroup {
  id: string
  name: string
  profile_id?: number
  description?: string
  targetAcos?: number
  presetGoal?: "Balanced" | "Reduce ACoS" | "Increase Sales"
  bidCeiling?: number
  bidFloor?: number
  campaigns: string[]
  user_id: string
  created_at: string
  updated_at: string
}

export interface CampaignGroupFormData {
  name: string
  profile_id?: number
  description?: string
  targetAcos?: number
  presetGoal?: "Balanced" | "Reduce ACoS" | "Increase Sales"
  bidCeiling?: number
  bidFloor?: number
}

export interface CampaignGroupListResponse {
  groups: CampaignGroup[]
  total: number
  unassigned_campaigns_count: number
}

export interface CampaignAssignment {
  campaign_ids: string[]
}
