"use client"

import type React from "react"

import { useCallback, useRef, useMemo, useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Check } from "lucide-react"
import { TinyAreaChart } from "@/components/tiny-area-chart"
import { useResizableColumns } from "@/hooks/use-resizable-columns"
import { cn } from "@/lib/utils"
import type { ColumnDefinition } from "@/components/bid-optimizer/customize-columns-dialog"

// Simple custom checkbox component that doesn't rely on Radix UI
function SimpleCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div
      className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer ${checked ? "bg-primary border-primary" : "border-gray-300"}`}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onChange(!checked)
        }
      }}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </div>
  )
}

interface Campaign {
  id?: string
  campaignId?: string
  campaignName?: string
  adType: string
  campaign?: string
  campaignStatus?: string
  state?: string
  optGroup: string | null
  lastOptimized: string | null
  impressions: number
  clicks: number
  orders: number
  units: number
  ctr: string | number | null
  cvr: string | number | null
  cpc: string | number | null
  spend: string | number
  sales: string | number
  acos: string | number | null
  rpc: string | number | null
  roas?: string | null
  salesTrend?: string | null
  spendTrend?: string | null
  acosTrend?: number
  trend?: {
    sales: number[]
    spend: number[]
  }
}

interface CampaignsTableProps {
  campaigns: Campaign[]
  selectedCampaigns: string[]
  onSelectCampaign: (campaignId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  sortConfig: {
    key: string
    direction: "asc" | "desc"
  }
  onSort: (key: string) => void
  columns: ColumnDefinition[]
}

// Update the CampaignsTable component to handle frozen columns
export function CampaignsTable({
  campaigns,
  selectedCampaigns,
  onSelectCampaign,
  onSelectAll,
  sortConfig,
  onSort,
  columns,
}: CampaignsTableProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [localResizingColumnId, setLocalResizingColumnId] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [scrollLeft, setScrollLeft] = useState(0)
  
  // Helper function to get campaign ID (supports both mock data and API data)
  const getCampaignId = (campaign: Campaign): string => {
    return campaign.id || campaign.campaignId || ''
  }
  
  // Helper function to get campaign name (supports both mock data and API data)
  const getCampaignName = (campaign: Campaign): string => {
    return campaign.campaign || campaign.campaignName || ''
  }
  
  // Helper function to safely convert to number
  const toNumber = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined) return 0
    return typeof value === 'number' ? value : parseFloat(value) || 0
  }
  
  // Helper function to format currency
  const formatCurrency = (value: string | number | null | undefined): string => {
    const num = toNumber(value)
    return `$${num.toFixed(2)}`
  }
  
  // Helper function to format percentage
  const formatPercentage = (value: string | number | null | undefined, decimals: number = 1): string => {
    const num = toNumber(value)
    return `${num.toFixed(decimals)}%`
  }

  // Get visible columns in the correct order, separating frozen and non-frozen
  const { frozenColumns, scrollableColumns } = useMemo(() => {
    // Make sure checkbox and campaign columns are always frozen
    const allColumns = columns.map((col) => {
      if (col.id === "checkbox" || col.id === "campaign") {
        return { ...col, frozen: true }
      }
      return col
    })

    const frozen = allColumns
      .filter((col) => col.visible !== false && col.frozen === true)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const scrollable = allColumns
      .filter((col) => col.visible !== false && col.frozen !== true)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    return { frozenColumns: frozen, scrollableColumns: scrollable }
  }, [columns])

  // Calculate total width of frozen columns
  const frozenColumnsWidth = useMemo(() => {
    return frozenColumns.reduce((total, col) => total + (col.width || 100), 0)
  }, [frozenColumns])

  // Convert columns to the format expected by useResizableColumns
  const initialColumnsConfig = useMemo(() => {
    return [...frozenColumns, ...scrollableColumns].map((col) => ({
      id: col.id,
      width: col.width || 100,
      minWidth: col.minWidth || 50,
    }))
  }, [frozenColumns, scrollableColumns])

  const {
    columns: resizableColumns,
    startResize,
    resizingColumnId,
    tableWidth,
  } = useResizableColumns(initialColumnsConfig)

  // Sync the resizing state from the hook to local state for immediate feedback
  useEffect(() => {
    setLocalResizingColumnId(resizingColumnId)
    setIsResizing(!!resizingColumnId)
  }, [resizingColumnId])

  // Apply column widths to the table on mount and when columns change
  useEffect(() => {
    if (tableRef.current) {
      const thElements = tableRef.current.querySelectorAll("th")

      // Apply individual column widths
      resizableColumns.forEach((column) => {
        const thElement = Array.from(thElements).find((th) => th.getAttribute("data-column-id") === column.id)
        if (thElement) {
          thElement.style.width = `${column.width}px`
        }
      })

      // Set the table width to ensure it can expand beyond its container
      tableRef.current.style.minWidth = `${tableWidth}px`
    }
  }, [resizableColumns, tableWidth])

  // Handle scroll events to update frozen columns position
  const handleScroll = useCallback(() => {
    if (tableContainerRef.current) {
      setScrollLeft(tableContainerRef.current.scrollLeft)
    }
  }, [])

  // Add scroll event listener
  useEffect(() => {
    const container = tableContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [handleScroll])

  const handleSort = useCallback(
    (key: string) => {
      onSort(key)
    },
    [onSort],
  )

  // Get column width by id
  const getColumnWidth = useCallback(
    (id: string) => {
      const column = resizableColumns.find((col) => col.id === id)
      return column ? column.width : undefined
    },
    [resizableColumns],
  )

  // Redesigned resize handle with thinner border and fixed height
  const ResizeHandle = ({ columnId }: { columnId: string }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Start the resize operation
      startResize(columnId, e.clientX, tableRef.current)
      setLocalResizingColumnId(columnId)
      setIsResizing(true)
    }

    const isActive = localResizingColumnId === columnId

    return (
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-4 cursor-col-resize z-10 flex items-center justify-center",
          isActive ? "column-resize-handle-active" : "column-resize-handle",
        )}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        aria-hidden="true"
        title="Drag to resize column"
      >
        <div
          className={cn(
            "h-[20px] w-[1px] bg-slate-300 hover:bg-slate-400 hover:w-[2px] transition-all",
            isActive ? "w-[2px] bg-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.5)]" : "",
          )}
        />
      </div>
    )
  }

  // Render a table header based on column ID
  const renderTableHeader = useCallback(
    (columnId: string, isFrozen: boolean, index: number) => {
      const width = getColumnWidth(columnId)

      // Define the background color for headers
      const headerBgColor = "#f5f5f5" // Light gray color for all headers

      const headerProps = {
        className: cn(
          "font-medium relative group",
          localResizingColumnId === columnId ? "bg-blue-50 border-blue-200" : "",
          columnId === "checkbox" ? "w-12" : "",
          isFrozen ? "sticky z-20" : "",
        ),
        style: {
          width: width ? `${width}px` : undefined,
          left: isFrozen
            ? `${frozenColumns.slice(0, index).reduce((total, col) => total + (getColumnWidth(col.id) || 100), 0)}px`
            : undefined,
          boxShadow: isFrozen && index === frozenColumns.length - 1 ? "4px 0 4px -2px rgba(0, 0, 0, 0.15)" : undefined,
          // Use a solid background color for all headers and ensure proper z-index
          backgroundColor: headerBgColor,
          zIndex: isFrozen ? 40 : 10, // Explicitly set z-index in inline style for maximum specificity
        },
        "data-column-id": columnId,
        "data-resizing": localResizingColumnId === columnId ? "true" : "false",
        "data-frozen": isFrozen ? "true" : "false",
      }

      // Content based on column type
      const renderHeaderContent = () => {
        switch (columnId) {
          case "checkbox":
            return (
              <SimpleCheckbox
                checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                onChange={onSelectAll}
              />
            )
          case "campaign":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground truncate">
                Campaign
                {sortConfig.key === "campaign" && <ArrowUpDown className="ml-1 h-4 w-4 flex-shrink-0" />}
              </div>
            )
          case "adType":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Ad Type
                {sortConfig.key === "adType" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "state":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                State
                {sortConfig.key === "state" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "optGroup":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Campaign Group
                {sortConfig.key === "optGroup" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "salesTrend":
            return (
              <div>
                Last 30d
                <br />
                Sales
              </div>
            )
          case "spendTrend":
            return (
              <div>
                Last 30d
                <br />
                Spend
              </div>
            )
          case "lastOptimized":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Last Optimized
                {sortConfig.key === "lastOptimized" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "impressions":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Impressions
                {sortConfig.key === "impressions" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "clicks":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Clicks
                {sortConfig.key === "clicks" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "orders":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Orders
                {sortConfig.key === "orders" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "units":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Units
                {sortConfig.key === "units" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "ctr":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                CTR
                {sortConfig.key === "ctr" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "cvr":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                CVR
                {sortConfig.key === "cvr" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "cpc":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                CPC
                {sortConfig.key === "cpc" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "spend":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Spend
                {sortConfig.key === "spend" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "sales":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Sales
                {sortConfig.key === "sales" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "acos":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                ACOS
                {sortConfig.key === "acos" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "rpc":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                RPC
                {sortConfig.key === "rpc" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "roas":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                ROAS
                {sortConfig.key === "roas" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "conversionRate":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Conversion Rate
                {sortConfig.key === "conversionRate" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "budget":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Budget
                {sortConfig.key === "budget" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "bidStrategy":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Bidding Strategy
                {sortConfig.key === "bidStrategy" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          case "targetAcos":
            return (
              <div className="flex items-center cursor-pointer hover:text-foreground">
                Target ACOS
                {sortConfig.key === "targetAcos" && <ArrowUpDown className="ml-1 h-4 w-4" />}
              </div>
            )
          default:
            return null
        }
      }

      // Add click handler for sortable columns
      const clickHandler = ["checkbox", "salesTrend", "spendTrend"].includes(columnId)
        ? {}
        : { onClick: () => handleSort(columnId) }

      return (
        <TableHead key={columnId} {...headerProps} {...clickHandler}>
          {/* Wrap content in a container with padding to make room for the resize handle */}
          <div className="pr-6">{renderHeaderContent()}</div>
          <ResizeHandle columnId={columnId} />
        </TableHead>
      )
    },
    [
      getColumnWidth,
      handleSort,
      onSelectAll,
      selectedCampaigns.length,
      campaigns.length,
      sortConfig.key,
      localResizingColumnId,
      startResize,
      frozenColumns,
    ],
  )

  // Render a table cell based on column ID
  const renderTableCell = useCallback(
    (campaign: Campaign, columnId: string, isFrozen: boolean, index: number) => {
      const cellProps = {
        className: cn(isFrozen ? "sticky z-10" : "", columnId === "campaign" ? "font-medium" : ""),
        style: {
          left: isFrozen
            ? `${frozenColumns.slice(0, index).reduce((total, col) => total + (getColumnWidth(col.id) || 100), 0)}px`
            : undefined,
          boxShadow: isFrozen && index === frozenColumns.length - 1 ? "4px 0 4px -2px rgba(0, 0, 0, 0.15)" : undefined,
          // Use a solid white background for all cells and ensure proper z-index
          backgroundColor: "#ffffff",
          zIndex: isFrozen ? 30 : 1, // Explicitly set z-index in inline style for maximum specificity
        },
        "data-frozen": isFrozen ? "true" : "false",
      }

      switch (columnId) {
        case "checkbox":
          return (
            <TableCell key={`${getCampaignId(campaign)}-checkbox`} className="w-12" {...cellProps}>
              <SimpleCheckbox
                checked={selectedCampaigns.includes(getCampaignId(campaign))}
                onChange={(checked) => onSelectCampaign(getCampaignId(campaign), checked)}
              />
            </TableCell>
          )
        case "campaign":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-campaign`}
              className={cn("whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]", cellProps.className)}
              style={cellProps.style}
            >
              {getCampaignName(campaign)}
            </TableCell>
          )
        case "adType":
          return (
            <TableCell key={`${getCampaignId(campaign)}-adType`} {...cellProps}>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {campaign.adType}
              </Badge>
            </TableCell>
          )
        case "state":
          return (
            <TableCell key={`${getCampaignId(campaign)}-state`} {...cellProps}>
              <div className="flex items-center whitespace-nowrap">
                {(campaign.state === 'ENABLED' || campaign.campaignStatus === 'ENABLED') ? (
                  <>
                    <Check className="h-4 w-4 text-green-500 mr-1" />
                    <span>Active</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {campaign.state || campaign.campaignStatus || 'Unknown'}
                  </span>
                )}
              </div>
            </TableCell>
          )
        case "optGroup":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-optGroup`}
              className={cn("whitespace-nowrap overflow-hidden text-ellipsis", cellProps.className)}
              style={cellProps.style}
            >
              {campaign.optGroup || '-'}
            </TableCell>
          )
        case "salesTrend":
          return (
            <TableCell key={`${getCampaignId(campaign)}-salesTrend`} {...cellProps}>
              <div className="whitespace-nowrap">
                {formatCurrency(campaign.sales)}
              </div>
            </TableCell>
          )
        case "spendTrend":
          return (
            <TableCell key={`${getCampaignId(campaign)}-spendTrend`} {...cellProps}>
              <div className="whitespace-nowrap">
                {formatCurrency(campaign.spend)}
              </div>
            </TableCell>
          )
        case "lastOptimized":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-lastOptimized`}
              className={cn("whitespace-nowrap overflow-hidden text-ellipsis", cellProps.className)}
              style={cellProps.style}
            >
              {campaign.lastOptimized || 'Never'}
            </TableCell>
          )
        case "impressions":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-impressions`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {toNumber(campaign.impressions).toLocaleString()}
            </TableCell>
          )
        case "clicks":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-clicks`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {toNumber(campaign.clicks).toLocaleString()}
            </TableCell>
          )
        case "orders":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-orders`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {toNumber(campaign.orders).toLocaleString()}
            </TableCell>
          )
        case "units":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-units`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {toNumber(campaign.units).toLocaleString()}
            </TableCell>
          )
        case "ctr":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-ctr`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {campaign.ctr ? formatPercentage(campaign.ctr) : '-'}
            </TableCell>
          )
        case "cvr":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-cvr`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {campaign.cvr ? formatPercentage(campaign.cvr) : '-'}
            </TableCell>
          )
        case "cpc":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-cpc`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              {campaign.cpc ? formatCurrency(campaign.cpc) : '-'}
            </TableCell>
          )
        case "spend":
          return (
            <TableCell key={`${getCampaignId(campaign)}-spend`} {...cellProps}>
              <div className="flex flex-col whitespace-nowrap">
                <span>{formatCurrency(campaign.spend)}</span>
                {campaign.spendTrend !== null && campaign.spendTrend !== undefined && (
                  <span className={`text-xs ${toNumber(campaign.spendTrend) > 0 ? "text-red-500" : "text-green-500"}`}>
                    {toNumber(campaign.spendTrend) > 0 ? "+" : ""}
                    {toNumber(campaign.spendTrend)}%
                  </span>
                )}
              </div>
            </TableCell>
          )
        case "sales":
          return (
            <TableCell key={`${getCampaignId(campaign)}-sales`} {...cellProps}>
              <div className="flex flex-col whitespace-nowrap">
                <span>{formatCurrency(campaign.sales)}</span>
                {campaign.salesTrend !== null && campaign.salesTrend !== undefined && (
                  <span className={`text-xs ${toNumber(campaign.salesTrend) > 0 ? "text-green-500" : "text-red-500"}`}>
                    {toNumber(campaign.salesTrend) > 0 ? "+" : ""}
                    {toNumber(campaign.salesTrend)}%
                  </span>
                )}
              </div>
            </TableCell>
          )
        case "acos":
          return (
            <TableCell key={`${getCampaignId(campaign)}-acos`} {...cellProps}>
              <div className="flex flex-col whitespace-nowrap">
                <span>{campaign.acos ? formatPercentage(campaign.acos) : '-'}</span>
                {campaign.acosTrend !== null && campaign.acosTrend !== undefined && (
                  <span className={`text-xs ${toNumber(campaign.acosTrend) > 0 ? "text-red-500" : "text-green-500"}`}>
                    {toNumber(campaign.acosTrend) > 0 ? "+" : ""}
                    {toNumber(campaign.acosTrend)}%
                  </span>
                )}
              </div>
            </TableCell>
          )
        case "rpc":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-rpc`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>{campaign.rpc ? formatCurrency(campaign.rpc) : '-'}</span>
            </TableCell>
          )
        case "roas":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-roas`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>{campaign.roas ? `${toNumber(campaign.roas).toFixed(1)}x` : '-'}</span>
            </TableCell>
          )
        case "conversionRate":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-conversionRate`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>{campaign.clicks > 0 ? formatPercentage((toNumber(campaign.orders) / toNumber(campaign.clicks)) * 100) : '-'}</span>
            </TableCell>
          )
        case "budget":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-budget`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>{formatCurrency(toNumber(campaign.spend) * 1.5)}</span>
            </TableCell>
          )
        case "bidStrategy":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-bidStrategy`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>Dynamic down</span>
            </TableCell>
          )
        case "targetAcos":
          return (
            <TableCell
              key={`${getCampaignId(campaign)}-targetAcos`}
              className={cn("whitespace-nowrap", cellProps.className)}
              style={cellProps.style}
            >
              <span>{campaign.acos ? formatPercentage(toNumber(campaign.acos) * 0.8) : '-'}</span>
            </TableCell>
          )
        default:
          return null
      }
    },
    [onSelectCampaign, selectedCampaigns, frozenColumns, getColumnWidth, getCampaignId, getCampaignName, toNumber, formatCurrency, formatPercentage],
  )

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto" ref={tableContainerRef} style={{ position: "relative" }} onScroll={handleScroll}>
        <Table ref={tableRef} className="expandable-table">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {/* Render frozen headers first */}
              {frozenColumns.map((column, index) => renderTableHeader(column.id, true, index))}

              {/* Render scrollable headers */}
              {scrollableColumns.map((column) => renderTableHeader(column.id, false, 0))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={getCampaignId(campaign)} className="group">
                {/* Render frozen cells first */}
                {frozenColumns.map((column, index) => renderTableCell(campaign, column.id, true, index))}

                {/* Render scrollable cells */}
                {scrollableColumns.map((column) => renderTableCell(campaign, column.id, false, 0))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
