"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"
import { COLUMN_TYPES, OPERATORS, FILTER_COLUMNS } from "./filter-components/filter-types"
import type { FilterCondition } from "./filter-components/filter-types"
import { DateFilter } from "./filter-components/date-filter"
import { EnumFilter } from "./filter-components/enum-filter"
import { TextFilter } from "./filter-components/text-filter"
import { NumberFilter } from "./filter-components/number-filter"

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: FilterCondition[]) => void
  existingFilters?: FilterCondition[]
}

export function FilterModal({ open, onOpenChange, onApplyFilters, existingFilters = [] }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterCondition[]>([])
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize filters only once when modal opens
  useEffect(() => {
    if (open && !isInitialized) {
      setFilters(existingFilters.length > 0 ? existingFilters : [])
      setIsInitialized(true)
    }
  }, [open, existingFilters, isInitialized])

  // Reset initialization state when modal closes
  useEffect(() => {
    if (!open) {
      setIsInitialized(false)
    }
  }, [open])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        activeDropdown &&
        dropdownRefs.current[activeDropdown] &&
        !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeDropdown])

  // Add a new filter
  const addNewFilter = useCallback(() => {
    const column = FILTER_COLUMNS[0]
    const defaultOperator = column.defaultOperators
      ? column.defaultOperators[0]
      : column.type === COLUMN_TYPES.ENUM
        ? "equals"
        : OPERATORS[column.type][0].value

    const newFilter: FilterCondition = {
      id: crypto.randomUUID(),
      column: column.id,
      columnType: column.type,
      operator: defaultOperator,
      values: [],
      valuesLogicalOperator: column.defaultLogicalOperator || "OR",
    }
    setFilters((prev) => [...prev, newFilter])
  }, [])

  // Remove a filter
  const removeFilter = useCallback((filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId))
  }, [])

  // Update filter column
  const updateFilterColumn = useCallback((filterId: string, columnId: string) => {
    const column = FILTER_COLUMNS.find((col) => col.id === columnId)
    if (!column) return

    const defaultOperator = column.defaultOperators
      ? column.defaultOperators[0]
      : column.type === COLUMN_TYPES.ENUM
        ? "equals"
        : OPERATORS[column.type][0].value

    const defaultLogicalOperator = column.defaultLogicalOperator || (column.type === COLUMN_TYPES.ENUM ? "OR" : "AND")

    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === filterId) {
          return {
            ...filter,
            column: columnId,
            columnType: column.type,
            operator: defaultOperator,
            values: [],
            valuesLogicalOperator: defaultLogicalOperator,
          }
        }
        return filter
      }),
    )
  }, [])

  // Update filter operator
  const updateFilterOperator = useCallback((filterId: string, operator: string) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === filterId) {
          return {
            ...filter,
            operator,
            values: [],
          }
        }
        return filter
      }),
    )
  }, [])

  // Add filter value
  const addFilterValue = useCallback((filterId: string, value: any, endValue?: any) => {
    if ((!value && value !== 0) || (typeof value === "string" && value.trim() === "")) return

    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === filterId) {
          // For non-enum types with operators like "equals", "less_than", etc., replace the value
          if (
            filter.columnType !== COLUMN_TYPES.TEXT &&
            filter.columnType !== COLUMN_TYPES.ENUM &&
            filter.operator !== "between"
          ) {
            return {
              ...filter,
              values: [{ id: crypto.randomUUID(), value, endValue }],
            }
          }

          // For "between" operator, replace the value
          if (filter.operator === "between") {
            return {
              ...filter,
              values: [{ id: crypto.randomUUID(), value, endValue }],
            }
          }

          // Don't add duplicate values for enum types or text with multiple values
          if (filter.values.some((v) => v.value === value)) {
            return filter
          }

          return {
            ...filter,
            values: [...filter.values, { id: crypto.randomUUID(), value, endValue }],
          }
        }
        return filter
      }),
    )
  }, [])

  // Remove filter value
  const removeFilterValue = useCallback((filterId: string, valueId: string) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === filterId) {
          return {
            ...filter,
            values: filter.values.filter((v) => v.id !== valueId),
          }
        }
        return filter
      }),
    )
  }, [])

  // Toggle enum value
  const toggleEnumValue = useCallback((filterId: string, value: string) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id === filterId) {
          const hasValue = filter.values.some((v) => v.value === value)

          if (hasValue) {
            // Remove the value
            return {
              ...filter,
              values: filter.values.filter((v) => v.value !== value),
            }
          } else {
            // Add the value
            return {
              ...filter,
              values: [...filter.values, { id: crypto.randomUUID(), value }],
            }
          }
        }
        return filter
      }),
    )
  }, [])

  // Select all enum values
  const handleSelectAll = useCallback(
    (filterId: string) => {
      const filter = filters.find((f) => f.id === filterId)
      if (!filter) return

      const column = FILTER_COLUMNS.find((col) => col.id === filter.column)
      if (!column || !column.options) return

      const allValues = column.options.map((opt) => opt.value)

      setFilters((prev) =>
        prev.map((f) => {
          if (f.id === filterId) {
            return {
              ...f,
              values: allValues.map((value) => ({ id: crypto.randomUUID(), value })),
            }
          }
          return f
        }),
      )
    },
    [filters],
  )

  // Clear all enum values
  const handleClearAll = useCallback((filterId: string) => {
    setFilters((prev) =>
      prev.map((f) => {
        if (f.id === filterId) {
          return { ...f, values: [] }
        }
        return f
      }),
    )
  }, [])

  // Change logical operator
  const handleChangeLogicalOperator = useCallback((filterId: string, operator: string) => {
    setFilters((prev) =>
      prev.map((f) => {
        if (f.id === filterId) {
          return { ...f, valuesLogicalOperator: operator as "AND" | "OR" }
        }
        return f
      }),
    )
  }, [])

  // Apply filters
  const applyFilters = useCallback(() => {
    // Only apply filters that have values
    const validFilters = filters.filter((filter) => filter.values.length > 0)
    onApplyFilters(validFilters)
    onOpenChange(false)
  }, [filters, onApplyFilters, onOpenChange])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters([])
  }, [])

  // Memoize available operators for better performance
  const getAvailableOperators = useCallback((filter: FilterCondition) => {
    const column = FILTER_COLUMNS.find((col) => col.id === filter.column)

    // For columns with default operators (like campaign name)
    if (column?.defaultOperators) {
      return column.defaultOperators.map((op) => {
        const operatorObj = OPERATORS[column.type]?.find((o) => o.value === op)
        return operatorObj || { value: op, label: op }
      })
    }

    // For other columns, use the standard operators for their type
    return OPERATORS[filter.columnType] || []
  }, [])

  // Determine if we should show the operator dropdown for this filter
  const shouldShowOperator = useCallback((filter: FilterCondition) => {
    return filter.columnType !== COLUMN_TYPES.ENUM
  }, [])

  // Determine if we should show the logical operator dropdown (AND/OR)
  const shouldShowLogicalOperator = useCallback((filter: FilterCondition) => {
    return filter.columnType === COLUMN_TYPES.TEXT
  }, [])

  // Render filter input based on column type
  const renderFilterInput = useCallback(
    (filter: FilterCondition) => {
      switch (filter.columnType) {
        case COLUMN_TYPES.ENUM:
          return (
            <EnumFilter
              filter={filter}
              onToggleValue={toggleEnumValue}
              onSelectAll={() => handleSelectAll(filter.id)}
              onClearAll={() => handleClearAll(filter.id)}
              isActive={activeDropdown === `enum-${filter.id}`}
              onToggleDropdown={() => {
                setActiveDropdown(activeDropdown === `enum-${filter.id}` ? null : `enum-${filter.id}`)
              }}
            />
          )
        case COLUMN_TYPES.DATE:
          return <DateFilter filter={filter} onValueChange={addFilterValue} />
        case COLUMN_TYPES.TEXT:
          return (
            <TextFilter
              filter={filter}
              onAddValue={(value) => addFilterValue(filter.id, value)}
              onRemoveValue={(valueId) => removeFilterValue(filter.id, valueId)}
              onChangeLogicalOperator={(op) => handleChangeLogicalOperator(filter.id, op)}
              shouldShowLogicalOperator={shouldShowLogicalOperator}
            />
          )
        case COLUMN_TYPES.NUMBER:
          return <NumberFilter filter={filter} onValueChange={addFilterValue} />
        case COLUMN_TYPES.PERCENTAGE:
          return <NumberFilter filter={filter} onValueChange={addFilterValue} showPercentage={true} />
        default:
          return null
      }
    },
    [
      activeDropdown,
      toggleEnumValue,
      handleSelectAll,
      handleClearAll,
      addFilterValue,
      removeFilterValue,
      handleChangeLogicalOperator,
      shouldShowLogicalOperator,
    ],
  )

  // Count valid filters (with values)
  const validFilterCount = useMemo(() => {
    return filters.filter((f) => f.values.length > 0).length
  }, [filters])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{ zIndex: 9001, height: "auto", minHeight: "600px" }}
        data-filter-modal="true"
      >
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4 overflow-y-auto pr-2 flex-1">
          {filters.map((filter) => (
            <div key={filter.id} className="border rounded-md p-4">
              <div className="flex items-center gap-2">
                {/* Column selector */}
                <Select value={filter.column} onValueChange={(value) => updateFilterColumn(filter.id, value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILTER_COLUMNS.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator selector - only show for non-enum types */}
                {shouldShowOperator(filter) && (
                  <Select value={filter.operator} onValueChange={(value) => updateFilterOperator(filter.id, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableOperators(filter).map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Filter input - specific to the column type */}
                <div className="flex-1">{renderFilterInput(filter)}</div>

                {/* Remove filter button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFilter(filter.id)}
                  className="h-10 w-10"
                  aria-label="Remove filter"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {filters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No filters added yet. Click the button below to add a filter.
            </div>
          )}

          <Button variant="outline" size="sm" onClick={addNewFilter} className="w-full mt-2">
            <Plus className="h-4 w-4 mr-2" /> Add New Filter
          </Button>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={clearAllFilters} disabled={filters.length === 0}>
            Clear All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters} disabled={validFilterCount === 0} className="bg-primary hover:bg-primary/90">
              Apply {validFilterCount} {validFilterCount === 1 ? "Filter" : "Filters"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
