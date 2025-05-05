"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import type { FilterCondition } from "./filter-types"

interface NumberFilterProps {
  filter: FilterCondition
  onValueChange: (filterId: string, value: any, endValue?: any) => void
  showPercentage?: boolean
}

export function NumberFilter({ filter, onValueChange, showPercentage = false }: NumberFilterProps) {
  const [minValue, setMinValue] = useState<string>(filter.values[0]?.value || "")
  const [maxValue, setMaxValue] = useState<string>(filter.values[0]?.endValue || "")

  // Update local state when filter values change externally
  useEffect(() => {
    setMinValue(filter.values[0]?.value || "")
    setMaxValue(filter.values[0]?.endValue || "")
  }, [filter.values])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinValue(value)

    // Only update the filter if we have a valid number
    if (value && !isNaN(Number(value))) {
      if (filter.operator === "between" && maxValue && !isNaN(Number(maxValue))) {
        onValueChange(filter.id, value, maxValue)
      } else {
        onValueChange(filter.id, value)
      }
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxValue(value)

    // Only update the filter if we have valid numbers for both min and max
    if (value && !isNaN(Number(value)) && minValue && !isNaN(Number(minValue))) {
      onValueChange(filter.id, minValue, value)
    }
  }

  if (filter.operator === "between") {
    return (
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="number"
            placeholder={`Min${showPercentage ? " %" : ""}`}
            className={showPercentage ? "pr-8" : ""}
            value={minValue}
            onChange={handleMinChange}
            aria-label={`Minimum ${showPercentage ? "percentage" : "value"}`}
          />
          {showPercentage && <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">%</div>}
        </div>
        <div className="flex-1 relative">
          <Input
            type="number"
            placeholder={`Max${showPercentage ? " %" : ""}`}
            className={showPercentage ? "pr-8" : ""}
            value={maxValue}
            onChange={handleMaxChange}
            aria-label={`Maximum ${showPercentage ? "percentage" : "value"}`}
          />
          {showPercentage && <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">%</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative">
      <Input
        type="number"
        placeholder={showPercentage ? "Enter percentage" : "Enter value"}
        className={showPercentage ? "pr-8" : ""}
        value={minValue}
        onChange={handleMinChange}
        aria-label={showPercentage ? "Percentage value" : "Numeric value"}
      />
      {showPercentage && <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">%</div>}
    </div>
  )
}
