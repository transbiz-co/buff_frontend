"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { EnhancedPerformanceChartFallback, type MetricConfig } from "@/components/enhanced-performance-chart-fallback"
import { FilterModal } from "@/components/filter-modal"
import type { FilterCondition } from "@/components/filter-components/filter-types"
import { COLUMN_TYPES } from "@/components/filter-components/filter-types"
import { BulkActionDialog } from "@/components/bulk-action-dialog"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Settings, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TransitionAnimation } from "@/components/transition-animation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAmazonConnectionsGuard } from "@/hooks/use-amazon-connections-guard"

// Import our new modular components
import { MetricCardsSection } from "@/components/bid-optimizer/metric-cards-section"
import { CampaignsTable } from "@/components/bid-optimizer/campaigns-table"
import { OptimizeBidsDialog } from "@/components/bid-optimizer/optimize-bids-dialog"
import { FloatingActionButtons } from "@/components/bid-optimizer/floating-action-buttons"
import { CustomDateRangeSelector } from "@/components/bid-optimizer/custom-date-range-selector"

// Import API client and utilities
import { bidOptimizerAPI, type BidOptimizerResponse } from "@/lib/api/bid-optimizer-api"
import { convertFiltersToAPI } from "@/lib/api/utils/filter-converter"

// Import the CustomizeColumnsDialog component
import { CustomizeColumnsDialog, type ColumnDefinition } from "@/components/bid-optimizer/customize-columns-dialog"

export default function BidOptimizerContent() {
  console.log('[BidOptimizerContent] Component rendering')
  const router = useRouter()
  const { activeConnections } = useAmazonConnectionsGuard()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  }>({ key: "campaign", direction: "asc" })
  const [isClient, setIsClient] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([])
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [selectedBulkAction, setSelectedBulkAction] = useState<string>("")
  const [showTransition, setShowTransition] = useState(false)
  
  // Initialize date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29) // -29 to include today = 30 days total
    return {
      from: thirtyDaysAgo,
      to: today,
    }
  })

  // Amazon Ads Connections 相關狀態
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("")
  const [isLoadingData, setIsLoadingData] = useState(false)
  
  // Bid Optimizer API 相關狀態
  const [isLoadingBidData, setIsLoadingBidData] = useState(false)
  const [bidDataError, setBidDataError] = useState<string | null>(null)
  const [bidOptimizerData, setBidOptimizerData] = useState<BidOptimizerResponse | null>(null)

  // Set initial connection when activeConnections are loaded
  useEffect(() => {
    if (activeConnections.length > 0 && !selectedConnectionId) {
      setSelectedConnectionId(activeConnections[0].id)
    }
  }, [activeConnections, selectedConnectionId])

  // Add this state after the other useState declarations
  const [columnsDialogOpen, setColumnsDialogOpen] = useState(false)
  const [tableColumns, setTableColumns] = useState<ColumnDefinition[]>([
    {
      id: "checkbox",
      label: "Select",
      category: "General",
      width: 50,
      minWidth: 40,
      visible: true,
      required: true,
      order: 0,
      frozen: true,
    },
    {
      id: "campaign",
      label: "Campaign",
      category: "General",
      width: 250,
      minWidth: 150,
      visible: true,
      order: 1,
      frozen: true,
    },
    { id: "adType", label: "Campaign Ad Type", category: "General", width: 100, minWidth: 80, visible: true, order: 2 },
    { id: "state", label: "State", category: "Campaign Settings", width: 100, minWidth: 80, visible: true, order: 3 },
    {
      id: "optGroup",
      label: "Campaign Group",
      category: "Campaign Settings",
      width: 150,
      minWidth: 100,
      visible: true,
      order: 4,
    },
    {
      id: "salesTrend",
      label: "Last 30d Sales",
      category: "Ad Performance",
      width: 120,
      minWidth: 100,
      visible: true,
      order: 5,
    },
    {
      id: "spendTrend",
      label: "Last 30d Spend",
      category: "Ad Performance",
      width: 120,
      minWidth: 100,
      visible: true,
      order: 6,
    },
    {
      id: "lastOptimized",
      label: "Last Optimized",
      category: "Campaign Settings",
      width: 180,
      minWidth: 150,
      visible: true,
      order: 7,
    },
    {
      id: "impressions",
      label: "Impressions",
      category: "Ad Performance",
      width: 120,
      minWidth: 80,
      visible: true,
      order: 8,
    },
    { id: "clicks", label: "Clicks", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 9 },
    { id: "orders", label: "Orders", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 10 },
    { id: "units", label: "Units", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 11 },
    { id: "ctr", label: "CTR", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 12 },
    { id: "cvr", label: "CVR", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 13 },
    { id: "cpc", label: "CPC", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 14 },
    { id: "spend", label: "Spend", category: "Ad Performance", width: 120, minWidth: 80, visible: true, order: 15 },
    { id: "sales", label: "Sales", category: "Ad Performance", width: 120, minWidth: 80, visible: true, order: 16 },
    { id: "acos", label: "ACOS", category: "Ad Performance", width: 120, minWidth: 80, visible: true, order: 17 },
    { id: "rpc", label: "RPC", category: "Ad Performance", width: 100, minWidth: 70, visible: true, order: 18 },
    { id: "roas", label: "ROAS", category: "Ad Performance", width: 100, minWidth: 70, visible: false, order: 19 },
    {
      id: "conversionRate",
      label: "Conversion Rate",
      category: "Ad Performance",
      width: 120,
      minWidth: 80,
      visible: false,
      order: 20,
    },
    {
      id: "budget",
      label: "Budget",
      category: "Campaign Settings",
      width: 100,
      minWidth: 70,
      visible: false,
      order: 21,
    },
    {
      id: "bidStrategy",
      label: "Bidding Strategy",
      category: "Campaign Settings",
      width: 150,
      minWidth: 120,
      visible: false,
      order: 22,
    },
    {
      id: "targetAcos",
      label: "Target ACOS",
      category: "Campaign Settings",
      width: 120,
      minWidth: 80,
      visible: false,
      order: 23,
    },
  ])

  // Define metrics configuration with toggle state and chart type
  const [metrics, setMetrics] = useState<MetricConfig[]>([
    { key: "impressions", color: "#8884d8", active: false, label: "Impressions", chartType: "bar" },
    { key: "clicks", color: "#82ca9d", active: false, label: "Clicks", chartType: "bar" },
    { key: "orders", color: "#ffc658", active: false, label: "Orders", chartType: "bar" },
    { key: "spend", color: "#2563EB", active: true, label: "Spend", chartType: "bar" },
    { key: "sales", color: "#10B981", active: true, label: "Sales", chartType: "bar" },
    { key: "acos", color: "#F59E0B", active: true, label: "ACOS", chartType: "line" },
    { key: "ctr", color: "#9333EA", active: false, label: "CTR", chartType: "line" },
    { key: "cvr", color: "#EC4899", active: false, label: "CVR", chartType: "line" },
    { key: "cpc", color: "#EF4444", active: false, label: "CPC", chartType: "line" },
    { key: "roas", color: "#14B8A6", active: false, label: "ROAS", chartType: "line" },
    { key: "rpc", color: "#6366F1", active: false, label: "RPC", chartType: "line" },
  ])

  // 獲取當前選擇的 connection 物件
  const selectedConnection = useMemo(() => {
    return activeConnections.find(c => c.id === selectedConnectionId)
  }, [activeConnections, selectedConnectionId])

  // 獲取 Bid Optimizer 數據
  const fetchBidOptimizerData = useCallback(async (
    connectionId: string,
    range: DateRange | undefined,
    filters: FilterCondition[]
  ) => {
    console.log('[fetchBidOptimizerData] Called with:', {
      connectionId,
      range: range ? `${range.from?.toISOString()} - ${range.to?.toISOString()}` : 'none',
      filtersCount: filters.length
    })
    
    // 1. 取得 profile_id
    const connection = activeConnections.find(c => c.id === connectionId)
    if (!connection) {
      console.log('[fetchBidOptimizerData] No connection found')
      return
    }
    
    // 2. 轉換日期格式
    if (!range?.from || !range?.to) {
      console.log('[fetchBidOptimizerData] No date range')
      return
    }
    const startDate = format(range.from, 'yyyy-MM-dd')
    const endDate = format(range.to, 'yyyy-MM-dd')
    
    // 3. 轉換篩選條件
    const apiFilters = convertFiltersToAPI(filters)
    
    // 4. 取消之前的請求
    if (abortControllerRef.current) {
      console.log('[fetchBidOptimizerData] Aborting previous request')
      abortControllerRef.current.abort()
    }
    
    // 5. 創建新的 AbortController
    abortControllerRef.current = new AbortController()
    
    // 6. 調用 API
    try {
      console.log('[fetchBidOptimizerData] Making API call')
      setIsLoadingBidData(true)
      setBidDataError(null)
      
      const data = await bidOptimizerAPI.getData({
        profileId: connection.profileId,
        startDate,
        endDate,
        filters: apiFilters
      }, abortControllerRef.current.signal)
      
      console.log('[fetchBidOptimizerData] API call successful')
      console.log('[fetchBidOptimizerData] Campaigns returned:', data.campaigns?.length || 0)
      console.log('[fetchBidOptimizerData] First campaign:', data.campaigns?.[0])
      setBidOptimizerData(data)
    } catch (error) {
      // 忽略中止錯誤
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[fetchBidOptimizerData] Request aborted')
        return
      }
      
      console.error('[fetchBidOptimizerData] API call failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      setBidDataError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingBidData(false)
    }
  }, [activeConnections])

  // 處理 connection 選擇變更
  const handleConnectionChange = useCallback((connectionId: string) => {
    setSelectedConnectionId(connectionId)
    // 清空已勾選的 campaigns，避免跨 profile 操作
    setSelectedCampaigns([])
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 使用單一的 useEffect 來管理 API 調用
  useEffect(() => {
    console.log('[BidOptimizer] useEffect triggered', {
      selectedConnectionId,
      dateRange: dateRange ? `${dateRange.from?.toISOString()} - ${dateRange.to?.toISOString()}` : 'none',
      activeFiltersLength: activeFilters.length,
      activeConnectionsLength: activeConnections.length
    })
    
    // 檢查必要條件
    if (!selectedConnectionId || !dateRange?.from || !dateRange?.to || activeConnections.length === 0) {
      console.log('[BidOptimizer] Skipping API call - missing required data')
      return
    }
    
    // 設置防抖定時器 - 增加延遲時間以避免過多的 API 調用
    const timer = setTimeout(() => {
      console.log('[BidOptimizer] Calling fetchBidOptimizerData after debounce')
      fetchBidOptimizerData(selectedConnectionId, dateRange, activeFilters)
    }, 500) // Increased from 300ms to 500ms
    
    // 清理函數
    return () => {
      console.log('[BidOptimizer] Clearing debounce timer')
      clearTimeout(timer)
    }
  }, [
    // 使用穩定的依賴項
    selectedConnectionId,
    dateRange?.from?.toISOString(),
    dateRange?.to?.toISOString(),
    activeFilters.length,
    activeConnections.length,
    fetchBidOptimizerData
  ])
  
  // 清理 abort controller
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const toggleMetric = useCallback((key: string) => {
    setMetrics((prevMetrics) => {
      // Count currently active metrics
      const activeCount = prevMetrics.filter((m) => m.active).length

      // Find the metric we're toggling
      const metric = prevMetrics.find((m) => m.key === key)

      // If we're trying to activate a metric and already have 4 active
      if (!metric?.active && activeCount >= 4) {
        toast.error("You can only display up to 4 metrics at a time. Please deactivate a metric before adding another.")
        return prevMetrics
      }

      // Otherwise toggle the metric
      return prevMetrics.map((metric) => (metric.key === key ? { ...metric, active: !metric.active } : metric))
    })
  }, [])

  const handleSort = useCallback((key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }, [])

  const handleSelectCampaign = useCallback((campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns((prev) => [...prev, campaignId])
    } else {
      setSelectedCampaigns((prev) => prev.filter((id) => id !== campaignId))
    }
  }, [])

  const handleApplyFilters = useCallback((filters: FilterCondition[]) => {
    setActiveFilters(filters)
    if (filters.length > 0) {
      toast.success(`${filters.length} filter${filters.length > 1 ? "s" : ""} applied`)
    }
  }, [])

  // Add a new function to clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters([])
    toast.success("All filters cleared")
  }, [])

  const handleBulkAction = useCallback((action: string) => {
    setSelectedBulkAction(action)
    setBulkActionDialogOpen(true)
  }, [])

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range)
    // Removed toast notification for better UX
  }, [])

  // Add this handler function
  const handleColumnsChange = (updatedColumns: ColumnDefinition[]) => {
    // Preserve the order from the updated columns
    const newColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index,
    }))

    setTableColumns(newColumns)
    toast.success("Column settings updated")
  }

  // Helper function to evaluate a single filter value against a campaign
  const evaluateFilter = useCallback((campaign: any, filter: FilterCondition) => {
    const campaignValue = campaign[filter.column]

    // For enum types, check if any/all values match based on logical operator
    if (filter.columnType === COLUMN_TYPES.ENUM) {
      if (filter.valuesLogicalOperator === "AND") {
        // All selected values must match (not possible with single campaign value)
        // This would be used for multi-value fields
        return filter.values.length === 0 || filter.values.every((v) => v.value === campaignValue)
      } else {
        // Any selected value must match
        return filter.values.length === 0 || filter.values.some((v) => v.value === campaignValue)
      }
    }

    // For text types with multiple values
    if (filter.columnType === COLUMN_TYPES.TEXT && filter.values.length > 0) {
      const textMatches = filter.values.map((v) => {
        switch (filter.operator) {
          case "contains":
            return String(campaignValue).toLowerCase().includes(String(v.value).toLowerCase())
          case "not_contains":
            return !String(campaignValue).toLowerCase().includes(String(v.value).toLowerCase())
          case "equals":
            return campaignValue === v.value
          case "not_equals":
            return campaignValue !== v.value
          case "starts_with":
            return String(campaignValue).toLowerCase().startsWith(String(v.value).toLowerCase())
          case "ends_with":
            return String(campaignValue).toLowerCase().endsWith(String(v.value).toLowerCase())
          default:
            return true
        }
      })

      // Combine results based on logical operator
      return filter.valuesLogicalOperator === "AND" ? textMatches.every(Boolean) : textMatches.some(Boolean)
    }

    // For date types
    if (filter.columnType === COLUMN_TYPES.DATE && filter.values.length > 0) {
      const dateValue = new Date(campaignValue)
      const filterDate = new Date(filter.values[0].value)

      switch (filter.operator) {
        case "before":
          return dateValue < filterDate
        case "after":
          return dateValue > filterDate
        case "equals":
          return dateValue.toDateString() === filterDate.toDateString()
        case "between":
          const endDate = new Date(filter.values[0].endValue)
          return dateValue >= filterDate && dateValue <= endDate
        case "never":
          return !campaignValue || campaignValue === "Never"
        default:
          return true
      }
    }

    // For number/percentage types
    if (
      (filter.columnType === COLUMN_TYPES.NUMBER || filter.columnType === COLUMN_TYPES.PERCENTAGE) &&
      filter.values.length > 0
    ) {
      const numValue = Number(campaignValue)
      const filterValue = Number(filter.values[0].value)

      switch (filter.operator) {
        case "less_than":
          return numValue < filterValue
        case "less_than_equal":
          return numValue <= filterValue
        case "equals":
          return numValue === filterValue
        case "not_equals":
          return numValue !== filterValue
        case "greater_than_equal":
          return numValue >= filterValue
        case "greater_than":
          return numValue > filterValue
        case "between":
          const endValue = Number(filter.values[0].endValue)
          return numValue >= filterValue && numValue <= endValue
        default:
          return true
      }
    }

    // Default case
    return true
  }, [])

  // Get campaigns from API or use empty array
  const dateFilteredCampaigns = useMemo(() => {
    return bidOptimizerData?.campaigns || []
  }, [bidOptimizerData])

  // Apply filters to campaigns - memoized for performance
  const filteredCampaigns = useMemo(() => {
    // Check which filters are sent to the backend
    const backendHandledFilters = ['campaign', 'adType', 'state', 'impressions', 'clicks', 'spend', 'sales', 'acos']
    
    // Filter out the filters that are already handled by the backend
    const clientSideFilters = activeFilters.filter(filter => !backendHandledFilters.includes(filter.column))
    
    console.log('[filteredCampaigns] dateFilteredCampaigns:', dateFilteredCampaigns.length)
    console.log('[filteredCampaigns] activeFilters:', activeFilters)
    console.log('[filteredCampaigns] clientSideFilters:', clientSideFilters)
    
    return dateFilteredCampaigns.filter((campaign) => {
      // If no client-side filters are active, show all campaigns returned by the backend
      if (clientSideFilters.length === 0) return true

      // Each client-side filter is combined with AND logic (all filters must match)
      return clientSideFilters.every((filter) => {
        // If the filter has no values, it's considered a match
        if (filter.values.length === 0) return true

        return evaluateFilter(campaign, filter)
      })
    })
  }, [dateFilteredCampaigns, activeFilters, evaluateFilter])

  // Sort campaigns - memoized for performance
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a]
      const bValue = b[sortConfig.key as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })
  }, [filteredCampaigns, sortConfig])

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedCampaigns(filteredCampaigns.map((camp) => camp.id || camp.campaignId))
      } else {
        setSelectedCampaigns([])
      }
    },
    [filteredCampaigns],
  )

  const handleOptimizeBids = useCallback(() => {
    setOptimizeDialogOpen(true)
  }, [])

  const handlePreviewOptimizations = useCallback(() => {
    setShowTransition(true)
    // The navigation will happen after the transition animation completes
  }, [])

  const handleTransitionComplete = useCallback(() => {
    router.push("/bid-optimizer/preview-optimizations")
  }, [router])

  const handleAssignSuccess = useCallback(() => {
    // Refresh the bid optimizer data after successfully assigning campaigns
    fetchBidOptimizerData(selectedConnectionId, dateRange, activeFilters)
    // Clear selected campaigns after successful assignment
    setSelectedCampaigns([])
  }, [selectedConnectionId, dateRange, activeFilters, fetchBidOptimizerData])

  return (
    <div className="p-6 w-full">
      {/* Header with breadcrumb and Amazon ads connection selector */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Breadcrumb segments={[{ name: "Bid Optimizer" }]} />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-64">
            <Select 
              value={selectedConnectionId} 
              onValueChange={handleConnectionChange} 
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選擇 Amazon 廣告帳戶" />
              </SelectTrigger>
              <SelectContent>
                {activeConnections.map(connection => (
                  <SelectItem key={connection.id} value={connection.id}>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{connection.accountName}</span>
                      <span className="text-xs text-muted-foreground">{connection.profileId}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading state display - show when loading or when no data yet */}
      {(isLoadingBidData || (!bidOptimizerData && !bidDataError)) && (
        <div className="flex justify-center items-center p-4 mt-20">
          <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full mr-2"></div>
          <p>Loading campaigns data...</p>
        </div>
      )}

      {/* Error state display */}
      {bidDataError && !isLoadingBidData && (
        <div className="flex flex-col items-center justify-center p-8 mt-20">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2">Failed to load data</p>
          <p className="text-muted-foreground mb-4">{bidDataError}</p>
          <Button onClick={() => fetchBidOptimizerData(selectedConnectionId, dateRange, activeFilters)} variant="outline">
            Try Again
          </Button>
        </div>
      )}

      {/* Only show content when we have data */}
      {bidOptimizerData && !isLoadingBidData && !bidDataError && (
        <>
          {/* Metric Cards Section */}
          <MetricCardsSection 
            metrics={metrics} 
            onMetricsChange={setMetrics} 
            summary={bidOptimizerData?.summary}
          />

          {/* Performance Chart - Now passing the dateRange prop */}
          <div className="mb-8">
            <EnhancedPerformanceChartFallback 
              activeMetrics={metrics.filter((m) => m.active)} 
              dateRange={dateRange} 
              data={bidOptimizerData?.daily_performance}
            />
          </div>

          {/* Table Actions */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              {activeFilters.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-primary text-white"
                    onClick={() => setFilterModalOpen(true)}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filters ({activeFilters.length})</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={clearAllFilters}
                    title="Clear all filters"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setFilterModalOpen(true)}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  <span>Add Filters</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedCampaigns.length > 0 && (
                <div className="text-primary font-medium mr-3">
                  {selectedCampaigns.length} {selectedCampaigns.length === 1 ? "campaign" : "campaigns"} selected
                </div>
              )}

              <CustomDateRangeSelector 
                onDateRangeChange={handleDateRangeChange} 
                position="left" 
                initialDateRange={dateRange}
              />

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setColumnsDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                <span>Columns</span>
              </Button>
            </div>
          </div>

          {/* Campaigns Table */}
          {sortedCampaigns.length === 0 && bidOptimizerData ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
              <p className="text-lg font-semibold mb-2">No campaigns found</p>
              <p className="text-muted-foreground">
                No campaigns match the selected date range and filters.
              </p>
            </div>
          ) : (
            <CampaignsTable
              campaigns={sortedCampaigns}
              selectedCampaigns={selectedCampaigns}
              onSelectCampaign={handleSelectCampaign}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSort={handleSort}
              columns={tableColumns}
            />
          )}
        </>
      )}

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={handleApplyFilters}
        existingFilters={activeFilters}
      />

      {/* Optimize Bids Dialog */}
      <OptimizeBidsDialog
        open={optimizeDialogOpen}
        onOpenChange={setOptimizeDialogOpen}
        selectedCampaignsCount={selectedCampaigns.length}
        onPreviewOptimizations={handlePreviewOptimizations}
      />

      {/* Bulk Action Dialog */}
      <BulkActionDialog
        open={bulkActionDialogOpen}
        onOpenChange={setBulkActionDialogOpen}
        selectedCount={selectedCampaigns.length}
        actionType={selectedBulkAction}
        selectedCampaignIds={selectedCampaigns}
        profileId={selectedConnection?.profileId}  // 新增此行
        onSuccess={handleAssignSuccess}
      />

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        selectedCampaignsCount={selectedCampaigns.length}
        onOptimizeBids={handleOptimizeBids}
        onBulkAction={handleBulkAction}
      />

      {/* Transition Animation */}
      {showTransition && (
        <TransitionAnimation
          message="Calculating optimizations..."
          onComplete={handleTransitionComplete}
          duration={2500}
        />
      )}

      {/* Columns Customization Dialog */}
      <CustomizeColumnsDialog
        open={columnsDialogOpen}
        onOpenChange={setColumnsDialogOpen}
        columns={tableColumns}
        onColumnsChange={handleColumnsChange}
      />
    </div>
  )
}