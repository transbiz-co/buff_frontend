import type { CampaignGroup } from "./campaign-group-types"

export const mockCampaignGroups: CampaignGroup[] = [
  {
    id: "1",
    name: "VC5367 - Ranking",
    targetAcos: 80,
    presetGoal: "Balanced",
    campaigns: ["campaign1", "campaign2"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "VC5367 - Profit",
    targetAcos: 60,
    presetGoal: "Balanced",
    campaigns: ["campaign3", "campaign4", "campaign5", "campaign6", "campaign7", "campaign8"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "VC5367 - Discovery",
    targetAcos: 70,
    presetGoal: "Balanced",
    campaigns: Array.from({ length: 16 }, (_, i) => `campaign${i + 9}`),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "VC5367 - Breakeven",
    targetAcos: 60,
    presetGoal: "Balanced",
    campaigns: Array.from({ length: 18 }, (_, i) => `campaign${i + 25}`),
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "VC3865 - Ranking",
    targetAcos: 80,
    presetGoal: "Balanced",
    campaigns: Array.from({ length: 4 }, (_, i) => `campaign${i + 43}`),
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "VC3865 - Discovery",
    targetAcos: 70,
    presetGoal: "Balanced",
    campaigns: Array.from({ length: 13 }, (_, i) => `campaign${i + 47}`),
    createdAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "VC3865 - Breakeven",
    targetAcos: 60,
    presetGoal: "Balanced",
    campaigns: Array.from({ length: 8 }, (_, i) => `campaign${i + 60}`),
    createdAt: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const unassignedCampaignsCount = 88
