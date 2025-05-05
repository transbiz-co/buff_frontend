"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

// Define column categories
const COLUMN_CATEGORIES = {
  ALL: "All",
  APP: "App",
  AD_PERFORMANCE: "Ad Performance",
  CAMPAIGN_SETTINGS: "Campaign Settings",
  OTHER: "Other",
}

// Define column metadata with categories
export interface ColumnDefinition {
  id: string
  label: string
  category: string
  width?: number
  minWidth?: number
  visible?: boolean
  required?: boolean
  order?: number
  frozen?: boolean
}

interface CustomizeColumnsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columns: ColumnDefinition[]
  onColumnsChange: (columns: ColumnDefinition[]) => void
}

// Update the CustomizeColumnsDialog function to include a Freeze Columns section
export function CustomizeColumnsDialog({ open, onOpenChange, columns, onColumnsChange }: CustomizeColumnsDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(COLUMN_CATEGORIES.ALL)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [availableColumns, setAvailableColumns] = useState<ColumnDefinition[]>([])
  const [selectedColumns, setSelectedColumns] = useState<ColumnDefinition[]>([])
  const [frozenColumns, setFrozenColumns] = useState<ColumnDefinition[]>([])
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
  const [draggedItemSection, setDraggedItemSection] = useState<"selected" | "frozen" | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const [dropTargetSection, setDropTargetSection] = useState<"selected" | "frozen" | null>(null)
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(null)
  const [showAfterLastFrozen, setShowAfterLastFrozen] = useState<boolean>(false)
  const [showAfterLastSelected, setShowAfterLastSelected] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Refs for the columns containers
  const selectedColumnsRef = useRef<HTMLDivElement>(null)
  const frozenColumnsRef = useRef<HTMLDivElement>(null)
  const frozenColumnsContentRef = useRef<HTMLDivElement>(null)
  const selectedColumnsContentRef = useRef<HTMLDivElement>(null)

  // Initialize columns when dialog opens
  useEffect(() => {
    if (open) {
      // Filter out required columns like checkbox from the dialog
      const customizableColumns = columns
        .filter((col) => !col.required)
        .map((col) => {
          // Update categories based on new requirements
          let category = col.category

          // Move specific metrics to App category
          if (col.id === "last30dSales" || col.id === "last30dSpend" || col.id === "lastOptimized") {
            category = COLUMN_CATEGORIES.APP
          }

          // Explicitly check for Campaign Group by ID or label
          if (col.id === "campaignGroup" || col.label === "Campaign Group") {
            category = COLUMN_CATEGORIES.APP
          }

          // Move Campaign and Campaign Ad Type to Campaign Settings
          if ((col.id === "campaign" || col.id === "adType") && col.category === "General") {
            category = COLUMN_CATEGORIES.CAMPAIGN_SETTINGS
          }

          // Replace AdLabs with App
          if (category === "AdLabs") {
            category = COLUMN_CATEGORIES.APP
          }

          // Remove General category by moving remaining items to Other
          if (category === "General") {
            category = COLUMN_CATEGORIES.OTHER
          }

          return { ...col, category }
        })

      // Separate frozen and non-frozen columns
      const frozen = customizableColumns
        .filter((col) => col.frozen && col.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))

      // Get visible non-frozen columns in their current order
      const visible = customizableColumns
        .filter((col) => !col.frozen && col.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))

      // Set selected and frozen columns in their current order
      setSelectedColumns(visible)
      setFrozenColumns(frozen)

      // Sort available columns to match the order of visible columns
      const sortedAvailableColumns = [...customizableColumns].sort((a, b) => {
        // Get the index of each column in the visible array
        const aIndexVisible = visible.findIndex((v) => v.id === a.id)
        const bIndexVisible = visible.findIndex((v) => v.id === b.id)

        // Get the index of each column in the frozen array
        const aIndexFrozen = frozen.findIndex((v) => v.id === a.id)
        const bIndexFrozen = frozen.findIndex((v) => v.id === b.id)

        // If both columns are in the same array, sort by their order in that array
        if (aIndexVisible !== -1 && bIndexVisible !== -1) {
          return aIndexVisible - bIndexVisible
        }
        if (aIndexFrozen !== -1 && bIndexFrozen !== -1) {
          return aIndexFrozen - bIndexFrozen
        }

        // If columns are in different arrays, prioritize frozen columns
        if (aIndexFrozen !== -1) return -1
        if (bIndexFrozen !== -1) return 1
        if (aIndexVisible !== -1) return -1
        if (bIndexVisible !== -1) return 1

        // For columns not in either array, maintain their original order
        return 0
      })

      // Set available columns with the new order
      setAvailableColumns(sortedAvailableColumns)
    }
  }, [open, columns])

  // Add a global drag event listener to track mouse position during drag
  useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !frozenColumnsRef.current || !selectedColumnsRef.current) return

      // Check if mouse is over the frozen columns container
      const frozenRect = frozenColumnsRef.current.getBoundingClientRect()
      const isOverFrozen =
        e.clientX >= frozenRect.left &&
        e.clientX <= frozenRect.right &&
        e.clientY >= frozenRect.top &&
        e.clientY <= frozenRect.bottom

      // Check if mouse is over the selected columns container
      const selectedRect = selectedColumnsRef.current.getBoundingClientRect()
      const isOverSelected =
        e.clientX >= selectedRect.left &&
        e.clientX <= selectedRect.right &&
        e.clientY >= selectedRect.top &&
        e.clientY >= selectedRect.bottom

      if (isOverFrozen) {
        // Get all draggable items in the frozen container
        const items = frozenColumnsRef.current.querySelectorAll('[draggable="true"]')

        // If there are no items or only one item, and mouse is in the bottom half of the container
        if (items.length <= 1 && e.clientY > frozenRect.top + frozenRect.height / 2) {
          // Reset regular drop indicators when showing "after last item" indicator
          setDropTargetIndex(null)
          setDropTargetSection(null)
          setDropPosition(null)

          setShowAfterLastFrozen(true)
          setShowAfterLastSelected(false)
          return
        }

        // If there are items, check if mouse is below the last item
        if (items.length > 0) {
          const lastItem = items[items.length - 1] as HTMLElement
          const lastItemRect = lastItem.getBoundingClientRect()

          if (e.clientY > lastItemRect.bottom) {
            // Reset regular drop indicators when showing "after last item" indicator
            setDropTargetIndex(null)
            setDropTargetSection(null)
            setDropPosition(null)

            setShowAfterLastFrozen(true)
            setShowAfterLastSelected(false)
            return
          }
        }
      } else if (isOverSelected) {
        // Similar logic for selected columns
        const items = selectedColumnsRef.current.querySelectorAll('[draggable="true"]')

        if (items.length <= 1 && e.clientY > selectedRect.top + selectedRect.height / 2) {
          // Reset regular drop indicators when showing "after last item" indicator
          setDropTargetIndex(null)
          setDropTargetSection(null)
          setDropPosition(null)

          setShowAfterLastSelected(true)
          setShowAfterLastFrozen(false)
          return
        }

        if (items.length > 0) {
          const lastItem = items[items.length - 1] as HTMLElement
          const lastItemRect = lastItem.getBoundingClientRect()

          if (e.clientY > lastItemRect.bottom) {
            // Reset regular drop indicators when showing "after last item" indicator
            setDropTargetIndex(null)
            setDropTargetSection(null)
            setDropPosition(null)

            setShowAfterLastSelected(true)
            setShowAfterLastFrozen(false)
            return
          }
        }
      }

      // If not in a special case, reset the "after last item" indicators
      if (!isOverFrozen && showAfterLastFrozen) {
        setShowAfterLastFrozen(false)
      }

      if (!isOverSelected && showAfterLastSelected) {
        setShowAfterLastSelected(false)
      }
    }

    document.addEventListener("mousemove", handleGlobalMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
    }
  }, [isDragging, frozenColumns.length, selectedColumns.length, showAfterLastFrozen, showAfterLastSelected])

  // Filter available columns based on category and search query
  const filteredAvailableColumns = availableColumns.filter((column: ColumnDefinition) => {
    const matchesCategory = selectedCategory === COLUMN_CATEGORIES.ALL || column.category === selectedCategory
    const matchesSearch = column.label.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle column selection/deselection
  const toggleColumnSelection = (column: ColumnDefinition, isSelected: boolean) => {
    if (isSelected) {
      // Add to selected columns if not already there
      if (!selectedColumns.some((col) => col.id === column.id) && !frozenColumns.some((col) => col.id === column.id)) {
        setSelectedColumns([...selectedColumns, { ...column, visible: true, frozen: false }])
      }
    } else {
      // Remove from selected columns
      setSelectedColumns(selectedColumns.filter((col) => col.id !== column.id))
      // Also remove from frozen columns if it's there
      setFrozenColumns(frozenColumns.filter((col) => col.id !== column.id))
    }
  }

  // Remove a column from selected columns
  const removeColumn = (columnId: string, section: "selected" | "frozen") => {
    if (section === "selected") {
      setSelectedColumns(selectedColumns.filter((col) => col.id !== columnId))
    } else {
      setFrozenColumns(frozenColumns.filter((col) => col.id !== columnId))
    }
  }

  // Remove all columns
  const removeAllColumns = (section: "selected" | "frozen") => {
    if (section === "selected") {
      setSelectedColumns([])
    } else {
      setFrozenColumns([])
    }
  }

  // Move a column to a new position within the same section
  const moveColumn = (fromIndex: number, toIndex: number, section: "selected" | "frozen") => {
    if (section === "selected") {
      if (toIndex < 0 || toIndex >= selectedColumns.length || fromIndex === toIndex) return

      const newSelectedColumns = [...selectedColumns]
      const [movedColumn] = newSelectedColumns.splice(fromIndex, 1)
      newSelectedColumns.splice(toIndex, 0, movedColumn)
      setSelectedColumns(newSelectedColumns)
    } else {
      if (toIndex < 0 || toIndex >= frozenColumns.length || fromIndex === toIndex) return

      const newFrozenColumns = [...frozenColumns]
      const [movedColumn] = newFrozenColumns.splice(fromIndex, 1)
      newFrozenColumns.splice(toIndex, 0, movedColumn)
      setFrozenColumns(newFrozenColumns)
    }
  }

  // Move a column between sections
  const moveColumnBetweenSections = (
    fromIndex: number,
    fromSection: "selected" | "frozen",
    toSection: "selected" | "frozen",
    toIndex: number,
  ) => {
    if (fromSection === toSection) {
      moveColumn(fromIndex, toIndex, fromSection)
      return
    }

    if (fromSection === "selected" && toSection === "frozen") {
      const newSelectedColumns = [...selectedColumns]
      const [movedColumn] = newSelectedColumns.splice(fromIndex, 1)
      const newFrozenColumns = [...frozenColumns]
      newFrozenColumns.splice(toIndex, 0, { ...movedColumn, frozen: true })
      setSelectedColumns(newSelectedColumns)
      setFrozenColumns(newFrozenColumns)
    } else if (fromSection === "frozen" && toSection === "selected") {
      const newFrozenColumns = [...frozenColumns]
      const [movedColumn] = newFrozenColumns.splice(fromIndex, 1)
      const newSelectedColumns = [...selectedColumns]
      newSelectedColumns.splice(toIndex, 0, { ...movedColumn, frozen: false })
      setFrozenColumns(newFrozenColumns)
      setSelectedColumns(newSelectedColumns)
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number, section: "selected" | "frozen") => {
    // Set data for transfer
    e.dataTransfer.setData("columnIndex", index.toString())
    e.dataTransfer.setData("columnSection", section)

    // Set dragged item index and section for visual feedback
    setDraggedItemIndex(index)
    setDraggedItemSection(section)
    setIsDragging(true)

    // Reset the "after last item" indicators
    setShowAfterLastFrozen(false)
    setShowAfterLastSelected(false)

    // Style the drag ghost element
    const draggedElement = e.currentTarget as HTMLElement

    // Create a clone for the drag image
    const clone = draggedElement.cloneNode(true) as HTMLElement
    clone.style.width = `${draggedElement.offsetWidth}px`
    clone.style.backgroundColor = "#f3f4f6"
    clone.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"
    clone.style.transform = "rotate(2deg)"
    clone.style.position = "absolute"
    clone.style.top = "-1000px"
    clone.style.left = "-1000px"
    clone.style.zIndex = "9999"

    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(clone, 20, 20)

    // Remove the clone after drag starts
    setTimeout(() => {
      document.body.removeChild(clone)
    }, 0)

    // Add styling to the original element
    draggedElement.classList.add("opacity-50", "border-dashed", "border-2", "border-blue-400")
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number, section: "selected" | "frozen") => {
    e.preventDefault()

    if (draggedItemIndex === null || (draggedItemSection === section && draggedItemIndex === index)) {
      setDropTargetIndex(null)
      setDropTargetSection(null)
      setDropPosition(null)
      return
    }

    // Always reset the "after last item" indicators when hovering over a specific item
    setShowAfterLastFrozen(false)
    setShowAfterLastSelected(false)

    // Determine if we should insert before or after the target
    const targetElement = e.currentTarget as HTMLElement
    const rect = targetElement.getBoundingClientRect()
    const mouseY = e.clientY
    const threshold = rect.top + rect.height / 2

    const newPosition = mouseY < threshold ? "before" : "after"

    // Only update state if something changed to avoid unnecessary re-renders
    if (index !== dropTargetIndex || section !== dropTargetSection || newPosition !== dropPosition) {
      setDropTargetIndex(index)
      setDropTargetSection(section)
      setDropPosition(newPosition)
    }
  }

  // Handle drag over for empty container
  const handleDragOverEmpty = (e: React.DragEvent, section: "selected" | "frozen") => {
    e.preventDefault()

    if (
      draggedItemSection === section &&
      (section === "selected" ? selectedColumns.length === 0 : frozenColumns.length === 0)
    ) {
      return
    }

    // Reset the "after last item" indicators
    setShowAfterLastFrozen(false)
    setShowAfterLastSelected(false)

    setDropTargetIndex(0)
    setDropTargetSection(section)
    setDropPosition("before")
  }

  // Handle drag over for the container itself
  const handleContainerDragOver = (e: React.DragEvent, section: "selected" | "frozen") => {
    e.preventDefault()

    const containerRef = section === "selected" ? selectedColumnsRef : frozenColumnsRef
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const items = containerRef.current.querySelectorAll('[draggable="true"]')

    // Check if mouse is below the last item
    if (items.length > 0) {
      const lastItem = items[items.length - 1] as HTMLElement
      const lastItemRect = lastItem.getBoundingClientRect()

      if (e.clientY > lastItemRect.bottom) {
        // Reset regular drop indicators when showing "after last item" indicator
        setDropTargetIndex(null)
        setDropTargetSection(null)
        setDropPosition(null)

        if (section === "frozen") {
          setShowAfterLastFrozen(true)
          setShowAfterLastSelected(false)
        } else {
          setShowAfterLastSelected(true)
          setShowAfterLastFrozen(false)
        }
        return
      }
    }

    // Special handling for when there's only one item or no items
    if (items.length <= 1) {
      // If mouse is in the bottom half of the container
      if (e.clientY > containerRect.top + containerRect.height / 2) {
        // Reset regular drop indicators when showing "after last item" indicator
        setDropTargetIndex(null)
        setDropTargetSection(null)
        setDropPosition(null)

        if (section === "frozen") {
          setShowAfterLastFrozen(true)
          setShowAfterLastSelected(false)
        } else {
          setShowAfterLastSelected(true)
          setShowAfterLastFrozen(false)
        }
      }
    }
  }

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent, section: "selected" | "frozen") => {
    // Only clear the drop target if we're leaving the container, not just moving between items
    const relatedTarget = e.relatedTarget as HTMLElement
    const containerRef = section === "selected" ? selectedColumnsRef : frozenColumnsRef

    if (!containerRef.current?.contains(relatedTarget)) {
      if (dropTargetSection === section) {
        setDropTargetIndex(null)
        setDropTargetSection(null)
        setDropPosition(null)
      }

      // Reset the "after last item" indicators when leaving the container
      if (section === "frozen") {
        setShowAfterLastFrozen(false)
      } else {
        setShowAfterLastSelected(false)
      }
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, section: "selected" | "frozen") => {
    e.preventDefault()

    // Get the dragged item data
    const fromIndex = Number.parseInt(e.dataTransfer.getData("columnIndex"), 10)
    const fromSection = e.dataTransfer.getData("columnSection") as "selected" | "frozen"

    // Reset visual states
    setDraggedItemIndex(null)
    setDraggedItemSection(null)
    setDropTargetIndex(null)
    setDropTargetSection(null)
    setDropPosition(null)
    setShowAfterLastFrozen(false)
    setShowAfterLastSelected(false)
    setIsDragging(false)

    // Handle drop after the last item
    if (section === "frozen" && showAfterLastFrozen) {
      const toIndex = frozenColumns.length
      moveColumnBetweenSections(fromIndex, fromSection, "frozen", toIndex)
      return
    }

    if (section === "selected" && showAfterLastSelected) {
      const toIndex = selectedColumns.length
      moveColumnBetweenSections(fromIndex, fromSection, "selected", toIndex)
      return
    }

    // If we have a valid drop target and position
    if (dropTargetIndex !== null && dropTargetSection !== null && dropPosition !== null) {
      // Calculate the actual target index
      let toIndex = dropTargetIndex
      if (dropPosition === "after") {
        toIndex += 1
      }

      // If dropping in the same section, adjust for the removal of the dragged item
      if (fromSection === dropTargetSection && fromIndex < toIndex) {
        toIndex -= 1
      }

      moveColumnBetweenSections(fromIndex, fromSection, dropTargetSection, toIndex)
    } else if (section === "selected" && selectedColumns.length === 0) {
      // Dropping into an empty selected columns container
      if (fromSection === "frozen") {
        const newFrozenColumns = [...frozenColumns]
        const [movedColumn] = newFrozenColumns.splice(fromIndex, 1)
        setFrozenColumns(newFrozenColumns)
        setSelectedColumns([{ ...movedColumn, frozen: false }])
      }
    } else if (section === "frozen" && frozenColumns.length === 0) {
      // Dropping into an empty frozen columns container
      if (fromSection === "selected") {
        const newSelectedColumns = [...selectedColumns]
        const [movedColumn] = newSelectedColumns.splice(fromIndex, 1)
        setSelectedColumns(newSelectedColumns)
        setFrozenColumns([{ ...movedColumn, frozen: true }])
      }
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    // Reset all visual states
    setDraggedItemIndex(null)
    setDraggedItemSection(null)
    setDropTargetIndex(null)
    setDropTargetSection(null)
    setDropPosition(null)
    setShowAfterLastFrozen(false)
    setShowAfterLastSelected(false)
    setIsDragging(false)

    // Remove any lingering styles from dragged elements
    const draggedElements = document.querySelectorAll(".opacity-50, .border-dashed")
    draggedElements.forEach((el) => {
      el.classList.remove("opacity-50", "border-dashed", "border-2", "border-blue-400")
    })
  }

  // Save changes
  const handleSave = () => {
    // Get the required columns (like checkbox) that should always be visible
    const requiredColumns = columns.filter((col) => col.required)

    // Create a new array with all columns, updating visibility, frozen state, and order
    const updatedColumns = [...availableColumns].map((col) => {
      const isInSelected = selectedColumns.some((selected) => selected.id === col.id)
      const isInFrozen = frozenColumns.some((frozen) => frozen.id === col.id)

      return {
        ...col,
        visible: isInSelected || isInFrozen,
        frozen: isInFrozen,
        // Set order based on position in selectedColumns or frozenColumns array
        order: isInFrozen
          ? frozenColumns.findIndex((frozen) => frozen.id === col.id)
          : isInSelected
            ? selectedColumns.findIndex((selected) => selected.id === col.id) + frozenColumns.length
            : 999, // Put non-visible columns at the end
      }
    })

    // Make sure "campaign" column is frozen by default if it's visible
    const campaignColumn = updatedColumns.find((col) => col.id === "campaign")
    if (campaignColumn && campaignColumn.visible) {
      campaignColumn.frozen = true
    }

    // Combine required columns with updated columns
    const finalColumns = [...requiredColumns, ...updatedColumns].sort((a, b) => {
      // Required columns come first, then frozen columns, then regular columns
      if (a.required && !b.required) return -1
      if (!a.required && b.required) return 1
      if (a.frozen && !b.frozen) return -1
      if (!a.frozen && b.frozen) return 1
      return (a.order || 0) - (b.order || 0)
    })

    onColumnsChange(finalColumns)
    onOpenChange(false)
  }

  // Select all filtered columns
  const selectAll = () => {
    const columnsToAdd = filteredAvailableColumns.filter(
      (col: ColumnDefinition) =>
        !selectedColumns.some((selected) => selected.id === col.id) &&
        !frozenColumns.some((frozen) => frozen.id === col.id),
    )

    if (columnsToAdd.length > 0) {
      setSelectedColumns([...selectedColumns, ...columnsToAdd.map((col) => ({ ...col, visible: true, frozen: false }))])
    }
  }

  // Get the style for a column item based on its state
  const getColumnItemStyle = (index: number, section: "selected" | "frozen") => {
    // Base styles
    const baseStyles = "flex items-center justify-between p-2 border rounded group transition-all duration-200"

    // If this is the item being dragged
    if (index === draggedItemIndex && section === draggedItemSection) {
      return `${baseStyles} opacity-50 border-dashed border-2 border-blue-400`
    }

    // If we're not in a drag operation or this isn't affected
    if (draggedItemIndex === null || dropTargetIndex === null) {
      return `${baseStyles} hover:bg-gray-50`
    }

    // If this is the drop target
    if (index === dropTargetIndex && section === dropTargetSection) {
      return `${baseStyles} bg-blue-50 scale-[1.02] shadow-sm z-10`
    }

    // Default style
    return `${baseStyles} hover:bg-gray-50`
  }

  // Render the insertion indicator
  const renderInsertionIndicator = (index: number, section: "selected" | "frozen") => {
    // Don't show regular indicators if we're showing an "after last item" indicator
    if ((section === "frozen" && showAfterLastFrozen) || (section === "selected" && showAfterLastSelected)) {
      return null
    }

    if (draggedItemIndex === null || dropTargetIndex === null || dropTargetSection !== section) return null

    // Show indicator before this item
    if (dropPosition === "before" && index === dropTargetIndex) {
      return <div className="h-1 bg-blue-500 rounded-full w-full my-1 animate-pulse" />
    }

    // Show indicator after this item
    if (dropPosition === "after" && index === dropTargetIndex) {
      return <div className="h-1 bg-blue-500 rounded-full w-full my-1 animate-pulse" />
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customize Columns</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Categories */}
          <div className="w-[200px] space-y-1 overflow-y-auto">
            {Object.values(COLUMN_CATEGORIES).map((category) => (
              <div
                key={category}
                className={cn(
                  "px-4 py-2 rounded cursor-pointer hover:bg-gray-100",
                  selectedCategory === category && "bg-gray-100",
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>

          {/* Available Columns */}
          <div className="flex-1 border-x px-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pt-2 pb-4 space-y-4 z-10">
              <h3 className="text-lg font-medium">Available</h3>
              <Input
                placeholder="Search Columns"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 h-auto" onClick={selectAll}>
                Select All
              </Button>
            </div>

            <div className="space-y-2">
              {filteredAvailableColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column.id}`}
                    checked={
                      selectedColumns.some((col) => col.id === column.id) ||
                      frozenColumns.some((col) => col.id === column.id)
                    }
                    onCheckedChange={(checked) => toggleColumnSelection(column, checked === true)}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label htmlFor={`column-${column.id}`} className="cursor-pointer">
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected and Frozen Columns */}
          <div className="w-[300px] overflow-y-auto space-y-6">
            {/* Frozen Columns */}
            <div
              className="border rounded-md p-4"
              ref={frozenColumnsRef}
              onDragOver={(e) => handleContainerDragOver(e, "frozen")}
              onDragLeave={(e) => handleDragLeave(e, "frozen")}
              onDrop={(e) => handleDrop(e, "frozen")}
              onDragEnd={handleDragEnd}
            >
              <div className="sticky top-0 bg-white pb-4 flex justify-between items-center z-10">
                <h3 className="text-lg font-medium">Frozen Columns ({frozenColumns.length})</h3>
                {frozenColumns.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 p-0 h-auto"
                    onClick={() => removeAllColumns("frozen")}
                  >
                    Remove All
                  </Button>
                )}
              </div>

              <div className="space-y-0" ref={frozenColumnsContentRef}>
                {frozenColumns.map((column, index) => (
                  <div key={column.id} className="relative">
                    {renderInsertionIndicator(index, "frozen")}
                    <div
                      className={getColumnItemStyle(index, "frozen")}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, "frozen")}
                      onDragOver={(e) => handleDragOver(e, index, "frozen")}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <span>{column.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        onClick={() => removeColumn(column.id, "frozen")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {index === frozenColumns.length - 1 && renderInsertionIndicator(index + 1, "frozen")}
                  </div>
                ))}

                {/* Show the "after last item" indicator */}
                {showAfterLastFrozen && frozenColumns.length > 0 && (
                  <div className="h-1 bg-blue-500 rounded-full w-full my-1 animate-pulse" />
                )}

                {/* Empty state with drop indicator */}
                {frozenColumns.length === 0 && (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 text-center text-gray-500",
                      dropTargetSection === "frozen" || showAfterLastFrozen
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300",
                    )}
                    onDragOver={(e) => handleDragOverEmpty(e, "frozen")}
                  >
                    Drag columns here to freeze them
                  </div>
                )}
              </div>
            </div>

            {/* Selected Columns */}
            <div
              className="border rounded-md p-4"
              ref={selectedColumnsRef}
              onDragOver={(e) => handleContainerDragOver(e, "selected")}
              onDragLeave={(e) => handleDragLeave(e, "selected")}
              onDrop={(e) => handleDrop(e, "selected")}
              onDragEnd={handleDragEnd}
            >
              <div className="sticky top-0 bg-white pb-4 flex justify-between items-center z-10">
                <h3 className="text-lg font-medium">Selected ({selectedColumns.length})</h3>
                {selectedColumns.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-600 p-0 h-auto"
                    onClick={() => removeAllColumns("selected")}
                  >
                    Remove All
                  </Button>
                )}
              </div>

              <div className="space-y-0" ref={selectedColumnsContentRef}>
                {selectedColumns.map((column, index) => (
                  <div key={column.id} className="relative">
                    {renderInsertionIndicator(index, "selected")}
                    <div
                      className={getColumnItemStyle(index, "selected")}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, "selected")}
                      onDragOver={(e) => handleDragOver(e, index, "selected")}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <span>{column.label}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        onClick={() => removeColumn(column.id, "selected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {index === selectedColumns.length - 1 && renderInsertionIndicator(index + 1, "selected")}
                  </div>
                ))}

                {/* Show the "after last item" indicator */}
                {showAfterLastSelected && selectedColumns.length > 0 && (
                  <div className="h-1 bg-blue-500 rounded-full w-full my-1 animate-pulse" />
                )}

                {/* Empty state with drop indicator */}
                {selectedColumns.length === 0 && (
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-md p-4 text-center text-gray-500",
                      dropTargetSection === "selected" || showAfterLastSelected
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-300",
                    )}
                    onDragOver={(e) => handleDragOverEmpty(e, "selected")}
                  >
                    Drag columns here to display them
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
