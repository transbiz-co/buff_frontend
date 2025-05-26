interface BidOptimizerParams {
  profileId: string
  startDate: string  // format: YYYY-MM-DD
  endDate: string    // format: YYYY-MM-DD
  filters?: Record<string, any>
}

interface MetricSummary {
  impressions: number
  clicks: number
  orders: number
  units: number
  spend: string
  sales: string
  acos: string | null
  ctr: string | null
  cvr: string | null
  cpc: string | null
  roas: string | null
  rpc: string | null
}

interface DailyPerformance {
  date: string
  impressions: number
  clicks: number
  orders: number
  units: number
  spend: string
  sales: string
  acos: string | null
  ctr: string | null
  cvr: string | null
  cpc: string | null
  roas: string | null
  rpc: string | null
}

interface CampaignData {
  campaignId: string
  campaignName: string
  adType: 'SP' | 'SB' | 'SD'
  campaignStatus: string
  startDate: string | null
  endDate: string | null
  optGroup: string | null
  lastOptimized: string | null
  impressions: number
  clicks: number
  orders: number
  units: number
  ctr: string | null
  cvr: string | null
  cpc: string | null
  spend: string
  sales: string
  acos: string | null
  rpc: string | null
  roas: string | null
  salesTrend: string | null
  spendTrend: string | null
}

interface BidOptimizerResponse {
  summary: {
    current: MetricSummary
    previous: MetricSummary
    changes: Record<string, string>
  }
  daily_performance: DailyPerformance[]
  campaigns: CampaignData[]
}

class BidOptimizerAPI {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async getData(params: BidOptimizerParams, signal?: AbortSignal): Promise<BidOptimizerResponse> {
    const queryParams = new URLSearchParams({
      profile_id: params.profileId,
      start_date: params.startDate,
      end_date: params.endDate,
      ...(params.filters && { filters: JSON.stringify(params.filters) })
    })

    const response = await fetch(`${this.baseURL}/api/v1/bid-optimizer?${queryParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

export const bidOptimizerAPI = new BidOptimizerAPI(
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'
)

export type {
  BidOptimizerParams,
  MetricSummary,
  DailyPerformance,
  CampaignData,
  BidOptimizerResponse
}