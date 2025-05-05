"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterCondition } from "./filter-types"

interface TextFilterProps {
  filter: FilterCondition
  onAddValue: (value: string) => void
  onRemoveValue: (valueId: string) => void
  onChangeLogicalOperator: (operator: string) => void
  shouldShowLogicalOperator: (filter: FilterCondition) => boolean
}

export function TextFilter({
  filter,
  onAddValue,
  onRemoveValue,
  onChangeLogicalOperator,
  shouldShowLogicalOperator,
}: TextFilterProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      onAddValue(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="flex gap-2">
      {shouldShowLogicalOperator(filter) && (
        <Select value={filter.valuesLogicalOperator} onValueChange={onChangeLogicalOperator}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="flex-1 relative">
        <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-10 bg-white">
          {filter.values.map((value) => (
            <Badge key={value.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              {value.value}
              <button
                type="button"
                onClick={() => onRemoveValue(value.id)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove ${value.value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-[100px]"
            placeholder="Type and press [ENTER]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Add filter value"
          />
        </div>
      </div>
    </div>
  )
}
