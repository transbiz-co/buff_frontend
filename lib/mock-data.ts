import type { Strategy, Task, ExecutionLog } from "./types"

export const mockStrategies: Strategy[] = [
  {
    id: "pause-campaigns",
    name: "Pause Campaigns with Declining Performance",
    description: "Identify and pause campaigns showing significant performance deterioration",
    pendingTasks: 2,
    estimatedSavings: 320.45,
    lastRun: 2,
  },
  {
    id: "pause-ads",
    name: "Pause Ads with High Spend / No Conversions",
    description: "Identifies keywords and targeting with significant spend but no resulting sales",
    pendingTasks: 2,
    estimatedSavings: 139.55,
    lastRun: 5,
  },
  {
    id: "negate-search-terms",
    name: "Identify and Negate Irrelevant Search Terms",
    description: "Find and negate search terms with high spend and poor performance metrics",
    pendingTasks: 0, // Example with no pending tasks
    estimatedSavings: 79.08,
    lastRun: 1,
  },
  {
    id: "lower-bids",
    name: "Lower Bids on Poor-Performing Keywords",
    description: "Reduce bids on keywords with low CTR, poor CVR, and high ACoS",
    pendingTasks: 2,
    estimatedSavings: 95.2,
    lastRun: 3,
  },
]

export const mockTasks: Task[] = [
  {
    id: "task-1",
    strategyId: "pause-campaigns",
    campaign: "PCW - SPK - HC Converting KWs - Phrase - pill organizer - USA",
    status: "pending",
    metrics: {
      impressions: 506716,
      clicks: 1098,
      ctr: 0.22,
      spend: 880.23,
      sales: 911.68,
      orders: 32,
      ppc: 0.8,
      acos: 96.55,
    },
    analysis:
      "This campaign has seen a significant decline in performance over the past 7 days. The conversion rate has dropped by 35% compared to the 30-day average, while the ACOS has increased from 65% to 96.55%, which is well above your target ACOS of 35%.",
    expectedOutcome:
      "Pausing this campaign will save approximately $880.23 per month while only reducing sales by $911.68, which can be reallocated to better-performing campaigns.",
  },
  {
    id: "task-2",
    strategyId: "pause-campaigns",
    campaign: "PCW - SPK - HC Converting KWs - Phrase - pill box - USA",
    status: "pending",
    metrics: {
      impressions: 158289,
      clicks: 824,
      ctr: 0.52,
      spend: 743.79,
      sales: 812.71,
      orders: 28,
      ppc: 0.9,
      acos: 91.52,
    },
    analysis:
      "This campaign's performance has deteriorated over the past week. The ACOS has increased from 62% to 91.52%, which is significantly above your target ACOS of 35%. The conversion rate has also decreased by 32% compared to the 30-day average.",
    expectedOutcome:
      "Pausing this campaign will save approximately $743.79 per month while only reducing sales by $812.71, which can be reallocated to better-performing campaigns.",
  },
  {
    id: "task-3",
    strategyId: "pause-campaigns",
    campaign: "PCW-GRGD - SPA - Close Match - Auto 2, Suggested Bid - USA",
    status: "pending",
    metrics: {
      impressions: 261298,
      clicks: 767,
      ctr: 0.29,
      spend: 626.87,
      sales: 700.26,
      orders: 24,
      ppc: 0.82,
      acos: 89.52,
    },
    analysis:
      "This campaign has shown a significant decline in performance. The ACOS has increased from 58% to 89.52%, which is well above your target ACOS of 35%. The conversion rate has decreased by 38% compared to the 30-day average.",
    expectedOutcome:
      "Pausing this campaign will save approximately $626.87 per month while only reducing sales by $700.26, which can be reallocated to better-performing campaigns.",
  },
  {
    id: "task-4",
    strategyId: "pause-campaigns",
    campaign: "PCW-GRGD - SPA - Substitutes - Auto 2, Suggested Bid - USA",
    status: "pending",
    metrics: {
      impressions: 78410,
      clicks: 648,
      ctr: 0.83,
      spend: 340.44,
      sales: 337.37,
      orders: 12,
      ppc: 0.53,
      acos: 100.91,
    },
    analysis:
      "This campaign is currently operating at a loss with an ACOS of 100.91%, which means you're spending more on advertising than you're making in sales. The conversion rate has decreased by 45% compared to the 30-day average.",
    expectedOutcome:
      "Pausing this campaign will save approximately $340.44 per month while only reducing sales by $337.37, resulting in an immediate improvement to your bottom line.",
  },
]

export const mockExecutionLogs: ExecutionLog[] = [
  {
    id: "log-1",
    strategyId: "pause-campaigns",
    campaign: "PCW - SPK - HC Converting KWs - Phrase - pill organizer - USA",
    status: "approved",
    clicks: 1098,
    impressions: 506716,
    spend: 880.23,
    sales: 911.68,
    acos: 96.55,
    date: "3/19, 11:30 PM",
  },
  {
    id: "log-2",
    strategyId: "pause-campaigns",
    campaign: "PCW - SPK - HC Converting KWs - Phrase - pill box - USA",
    status: "ignored",
    clicks: 824,
    impressions: 158289,
    spend: 743.79,
    sales: 812.72,
    acos: 91.52,
    date: "3/19, 10:45 PM",
  },
  {
    id: "log-3",
    strategyId: "pause-campaigns",
    campaign: "PCW - SPK - HC Converting KWs - Phrase - pill box - USA",
    status: "reverted",
    clicks: 824,
    impressions: 158289,
    spend: 743.79,
    sales: 812.72,
    acos: 91.52,
    date: "3/20, 12:15 AM",
  },
  {
    id: "log-4",
    strategyId: "pause-campaigns",
    campaign: "PCW-GRGD - SPA - Close Match - Auto 2, Suggested Bid - USA",
    status: "approved",
    clicks: 767,
    impressions: 261298,
    spend: 626.87,
    sales: 700.26,
    acos: 89.52,
    date: "3/20, 5:10 PM",
  },
  {
    id: "log-5",
    strategyId: "pause-campaigns",
    campaign: "PCW-GRGD - SPA - Substitutes - Auto 2, Suggested Bid - USA",
    status: "approved",
    clicks: 648,
    impressions: 78410,
    spend: 340.44,
    sales: 337.38,
    acos: 100.91,
    date: "3/20, 5:15 PM",
  },
]
