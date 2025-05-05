"use client"

import { useRef, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FILTER_COLUMNS } from "./filter-types"
import type { FilterCondition } from "./filter-types"

interface EnumFilterProps {
  filter: FilterCondition
  onToggleValue: (filterId: string, value: string) => void
  onClearAll: (filterId: string) => void
  onSelectAll: (filterId: string) => void
  isActive: boolean
  onToggleDropdown: () => void
}

export function EnumFilter({
  filter,
  onToggleValue,
  onClearAll,
  onSelectAll,
  isActive,
  onToggleDropdown,
}: EnumFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const column = FILTER_COLUMNS.find((col) => col.id === filter.column)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggleDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isActive, onToggleDropdown])

  if (!column || !column.options) return null

  const getEnumOptionLabel = (value: string) => {
    const option = column.options?.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        className="w-full justify-between text-left font-normal"
        onClick={(e) => {
          e.stopPropagation()
          onToggleDropdown()
        }}
        aria-expanded={isActive}
        aria-haspopup="true"
      >
        {filter.values.length > 0 ? (
          <span className="truncate">
            {filter.values.length === 1
              ? getEnumOptionLabel(filter.values[0].value)
              : `${filter.values.length} selected`}
          </span>
        ) : (
          <span className="text-muted-foreground">Select options...</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isActive && (
        <div
          className="absolute z-[99999] w-[220px] mt-1 rounded-md border bg-popover shadow-md"
          style={{ zIndex: 99999 }}
        >
          <div className="p-2 border-b flex justify-between">
            <button
              type="button"
              className="text-xs text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onSelectAll(filter.id)
              }}
            >
              Select All
            </button>
            <button
              type="button"
              className="text-xs text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onClearAll(filter.id)
              }}
            >
              Deselect All
            </button>
          </div>
          <div className="max-h-[200px] overflow-auto p-2">
            {column.options?.map((option) => {
              const isSelected = filter.values.some((v) => v.value === option.value)
              return (
                <div key={option.value} className="flex items-center space-x-2 py-1">
                  <div
                    className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer ${
                      isSelected ? "bg-primary border-primary" : "border-gray-300"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleValue(filter.id, option.value)
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onToggleValue(filter.id, option.value)
                      }
                    }}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <label
                    className="text-sm cursor-pointer flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleValue(filter.id, option.value)
                    }}
                  >
                    {option.label}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
