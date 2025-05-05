"use client"

import { useState, useRef, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface Optimization {
  id: string
  biddingEntity: string
  targeting: string
  campaign: string
  lastOptimized: string
  targetAcos: string
  prioritization: string
  currentValue: string
  newValue: string
  delta: string
  changeReason: string
  limitReason: string
  currentAcos: string
  newAcos: string
}

interface OptimizationTableProps {
  optimizations: Optimization[]
  selectedOptimizations: string[]
  onSelectAll: (checked: boolean) => void
  onSelectOptimization: (id: string, checked: boolean) => void
  onUpdateOptimization: (id: string, newValue: string) => void
}

export function OptimizationTable({
  optimizations,
  selectedOptimizations,
  onSelectAll,
  onSelectOptimization,
  onUpdateOptimization,
}: OptimizationTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Optimization
    direction: "asc" | "desc"
  }>({ key: "biddingEntity", direction: "asc" })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle clicks outside the input to save
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && editingId) {
        saveEditing(editingId)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingId])

  const handleSort = (key: keyof Optimization) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const isPercentageEntity = (biddingEntity: string) => {
    return biddingEntity === "Product Pages" || biddingEntity === "Rest of Search"
  }

  const startEditing = (id: string, currentValue: string, biddingEntity: string) => {
    setEditingId(id)
    // Remove currency symbol or percentage sign for editing
    const valueForEditing = isPercentageEntity(biddingEntity)
      ? currentValue.replace("%", "")
      : currentValue.replace("$", "")
    setEditValue(valueForEditing)
  }

  const saveEditing = (id: string) => {
    const optimization = optimizations.find((opt) => opt.id === id)
    if (optimization) {
      // Format the value based on bidding entity type
      const formattedValue = isPercentageEntity(optimization.biddingEntity)
        ? `${editValue}%`
        : editValue.startsWith("$")
          ? editValue
          : `$${editValue}`

      onUpdateOptimization(id, formattedValue)
    }
    setEditingId(null)
    setEditValue("")
  }

  // Calculate delta color based on value
  const getDeltaColor = (delta: string) => {
    if (
      delta === "0.0%" ||
      delta === "0%" ||
      delta === "+0.0%" ||
      delta === "+0%" ||
      delta === "-0.0%" ||
      delta === "-0%"
    ) {
      return "text-gray-500" // No change
    }
    return delta.includes("+") ? "text-green-500" : "text-orange-500" // Positive is green, negative is orange
  }

  // Sort optimizations
  const sortedOptimizations = [...optimizations].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (typeof aValue === "string" && typeof bValue === "string") {
      // Handle numeric strings (like "$0.45" or "40%")
      if ((aValue.includes("$") || aValue.includes("%")) && (bValue.includes("$") || bValue.includes("%"))) {
        const aNum = Number.parseFloat(aValue.replace("$", "").replace("%", ""))
        const bNum = Number.parseFloat(bValue.replace("$", "").replace("%", ""))
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum
      }

      return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // Render change reason badge
  const renderChangeReasonBadge = (reason: string) => {
    if (!reason) return null

    const colorMap: Record<string, string> = {
      "High ACOS": "bg-red-100 text-red-800 border-red-200",
      "Profile Performance": "bg-blue-100 text-blue-800 border-blue-200",
      "Optimization Group Perf.": "bg-purple-100 text-purple-800 border-purple-200",
      "High Spend": "bg-orange-100 text-orange-800 border-orange-200",
    }

    return (
      <Badge variant="outline" className={cn("font-normal", colorMap[reason] || "")}>
        {reason}
      </Badge>
    )
  }

  // Render limit reason badge
  const renderLimitReasonBadge = (reason: string) => {
    return reason ? (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 font-normal">
        {reason}
      </Badge>
    ) : null
  }

  // Function to render bidding entity with appropriate styling
  const renderBiddingEntity = (entity: string) => {
    // Targeting entities (Keyword and Product Target)
    if (entity === "Keyword" || entity === "Product Target") {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-normal">
          {entity}
        </Badge>
      )
    }
    // Placement entities (Product Pages and Rest of Search)
    else if (entity === "Product Pages" || entity === "Rest of Search") {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-normal">
          {entity}
        </Badge>
      )
    }
    // Default case
    return <span>{entity}</span>
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOptimizations.length === optimizations.length && optimizations.length > 0}
                  onCheckedChange={onSelectAll}
                  className="border-gray-300 text-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500"
                />
              </TableHead>

              <TableHead className="font-medium">
                <div className="flex items-center">Campaign Ad Type</div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("campaign")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Campaign
                  {sortConfig.key === "campaign" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("biddingEntity")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Bidding Entity
                  {sortConfig.key === "biddingEntity" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("targeting")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Targeting
                  {sortConfig.key === "targeting" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium">
                <div className="flex items-center">Match Type</div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("lastOptimized")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Last Optimized
                  {sortConfig.key === "lastOptimized" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("targetAcos")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Target ACOS
                  {sortConfig.key === "targetAcos" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("prioritization")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Prioritization
                  {sortConfig.key === "prioritization" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("currentValue")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Current Value
                  {sortConfig.key === "currentValue" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium w-[100px]" onClick={() => handleSort("newValue")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  New Value
                  {sortConfig.key === "newValue" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("delta")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Delta
                  {sortConfig.key === "delta" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium">Change Reason</TableHead>

              <TableHead className="font-medium">Limit Reason</TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("currentAcos")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  Current ACOS
                  {sortConfig.key === "currentAcos" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>

              <TableHead className="font-medium" onClick={() => handleSort("newAcos")}>
                <div className="flex items-center cursor-pointer hover:text-foreground">
                  New ACOS
                  {sortConfig.key === "newAcos" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedOptimizations.map((optimization) => (
              <TableRow
                key={optimization.id}
                className={cn("group", selectedOptimizations.includes(optimization.id) && "bg-primary/5")}
              >
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedOptimizations.includes(optimization.id)}
                    onCheckedChange={(checked) => onSelectOptimization(optimization.id, checked === true)}
                    className="border-gray-300 text-gray-500 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500"
                  />
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    SP
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {optimization.campaign}
                </TableCell>

                <TableCell className="font-medium whitespace-nowrap">
                  {renderBiddingEntity(optimization.biddingEntity)}
                </TableCell>

                <TableCell className="whitespace-nowrap">{optimization.targeting}</TableCell>

                <TableCell className="whitespace-nowrap">
                  {optimization.biddingEntity === "Keyword" ? "Phrase" : ""}
                </TableCell>

                <TableCell className="whitespace-nowrap">{optimization.lastOptimized}</TableCell>

                <TableCell className="whitespace-nowrap">{optimization.targetAcos}</TableCell>

                <TableCell className="whitespace-nowrap">{optimization.prioritization}</TableCell>

                <TableCell className="whitespace-nowrap">{optimization.currentValue}</TableCell>

                <TableCell className="whitespace-nowrap w-[100px] px-0">
                  <div className="w-[100px] px-2">
                    {editingId === optimization.id ? (
                      <div className="relative w-full">
                        {isPercentageEntity(optimization.biddingEntity) ? (
                          <div className="relative">
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-[80px] pr-6 h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditing(optimization.id)
                                if (e.key === "Escape") {
                                  setEditingId(null)
                                  setEditValue("")
                                }
                              }}
                            />
                            <span className="absolute right-2 top-1/2 transform -translate-y-1/2">%</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">$</span>
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-[80px] pl-6 h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditing(optimization.id)
                                if (e.key === "Escape") {
                                  setEditingId(null)
                                  setEditValue("")
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="flex items-center justify-between border border-transparent px-2 py-1 rounded hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all w-[80px] h-8"
                        onClick={() => startEditing(optimization.id, optimization.newValue, optimization.biddingEntity)}
                        title="Click to edit"
                      >
                        <span>{optimization.newValue}</span>
                        <Pencil className="h-3 w-3 text-gray-400 ml-1 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  <span className={getDeltaColor(optimization.delta)}>{optimization.delta}</span>
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {renderChangeReasonBadge(optimization.changeReason)}
                </TableCell>

                <TableCell className="whitespace-nowrap">{renderLimitReasonBadge(optimization.limitReason)}</TableCell>

                <TableCell className="whitespace-nowrap">{optimization.currentAcos}</TableCell>

                <TableCell className="whitespace-nowrap">{optimization.newAcos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
