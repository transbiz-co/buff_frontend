"use client"

import { Button } from "@/components/ui/button"
import { Filter, Settings } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { CustomDateRangeSelector } from "./custom-date-range-selector"

interface TableActionsProps {
  activeFiltersCount: number
  onOpenFilterModal: () => void
  selectedCampaignsCount: number
  onBulkAction: (action: string) => void
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function TableActions({
  activeFiltersCount,
  onOpenFilterModal,
  selectedCampaignsCount,
  onBulkAction,
  onDateRangeChange,
}: TableActionsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant={activeFiltersCount > 0 ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={onOpenFilterModal}
        >
          <Filter className="h-4 w-4 mr-1" />
          <span>{activeFiltersCount > 0 ? `Filters (${activeFiltersCount})` : "Add Filters"}</span>
        </Button>

        {/* Custom Date Range Selector */}
        <CustomDateRangeSelector onDateRangeChange={onDateRangeChange} />
      </div>

      <div className="flex items-center gap-2">
        {selectedCampaignsCount > 0 && (
          <div className="flex items-center mr-2">
            <div className="text-primary font-medium">
              {selectedCampaignsCount} {selectedCampaignsCount === 1 ? "campaign" : "campaigns"} selected
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4 mr-1" />
          <span>Columns</span>
        </Button>
      </div>
    </div>
  )
}
