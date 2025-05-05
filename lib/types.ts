export interface Strategy {
  id: string
  name: string
  description: string
  pendingTasks: number
  estimatedSavings: number
  lastRun: number
}

export interface TaskMetrics {
  impressions: number
  clicks: number
  ctr: number
  spend: number
  sales: number
  orders: number
  ppc: number
  acos: number
}

export interface Task {
  id: string
  strategyId: string
  campaign: string
  status?: "pending" | "approved" | "ignored"
  metrics: TaskMetrics
  analysis: string
  expectedOutcome: string
}

export interface ExecutionLog {
  id: string
  strategyId: string
  campaign: string
  status: "approved" | "ignored" | "reverted"
  clicks: number
  impressions: number
  spend: number
  sales: number
  acos: number
  date: string
}
