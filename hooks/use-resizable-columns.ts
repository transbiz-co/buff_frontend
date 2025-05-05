"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface ResizableColumn {
  id: string
  width: number
  minWidth?: number
}

export function useResizableColumns(initialColumns: ResizableColumn[]) {
  // Store columns in state
  const [columns, setColumns] = useState<ResizableColumn[]>(initialColumns)
  // Track which column is being resized
  const [resizingColumnId, setResizingColumnId] = useState<string | null>(null)
  // Track total table width to ensure it can expand
  const [tableWidth, setTableWidth] = useState<number>(0)

  // Refs to track resize state
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)
  const tableRef = useRef<HTMLTableElement | null>(null)
  const resizingRef = useRef<boolean>(false)

  // Calculate initial table width on mount
  useEffect(() => {
    if (!resizingRef.current) {
      const totalWidth = initialColumns.reduce((sum, col) => sum + col.width, 0)
      setTableWidth(totalWidth)
      console.log("Initial table width:", totalWidth)
    }
  }, [initialColumns])

  // Update columns when initialColumns change
  useEffect(() => {
    if (!resizingRef.current) {
      setColumns(initialColumns)
    }
  }, [initialColumns])

  // Start resizing a column
  const startResize = useCallback(
    (columnId: string, startX: number, tableElement: HTMLTableElement | null) => {
      console.log(`Starting resize for column: ${columnId} at X: ${startX}`)

      // Set resizing state
      setResizingColumnId(columnId)
      resizingRef.current = true
      startXRef.current = startX
      tableRef.current = tableElement

      // Find the column and store its starting width
      const column = columns.find((col) => col.id === columnId)
      if (column) {
        startWidthRef.current = column.width
        console.log(`Starting width: ${startWidthRef.current}px`)
      }

      // Add a class to the body to prevent text selection during resize
      document.body.classList.add("resize-active")
    },
    [columns],
  )

  // Handle resize movement
  const handleResize = useCallback(
    (clientX: number) => {
      if (!resizingColumnId || !resizingRef.current) {
        return
      }

      // Calculate the change in width
      const deltaX = clientX - startXRef.current
      console.log(`Resize delta: ${deltaX}px`)

      // Find the column being resized
      const column = columns.find((col) => col.id === resizingColumnId)
      if (!column) {
        return
      }

      // Calculate the new width, respecting minimum width
      const minWidth = column.minWidth || 50
      const newWidth = Math.max(startWidthRef.current + deltaX, minWidth)
      console.log(`New width: ${newWidth}px`)

      // Calculate the width difference to update total table width
      const widthDifference = newWidth - column.width

      // Update column width in state
      setColumns((prevColumns) =>
        prevColumns.map((col) => (col.id === resizingColumnId ? { ...col, width: newWidth } : col)),
      )

      // Update total table width to ensure it can expand
      setTableWidth((prevWidth) => prevWidth + widthDifference)

      // Apply width directly to the DOM for immediate feedback
      if (tableRef.current) {
        // Update the column width
        const thElements = tableRef.current.querySelectorAll("th")
        const thElement = Array.from(thElements).find((th) => th.getAttribute("data-column-id") === resizingColumnId)
        if (thElement) {
          thElement.style.width = `${newWidth}px`
          console.log(`Applied width ${newWidth}px to column ${resizingColumnId}`)
        }

        // Update the table width to ensure it can expand
        tableRef.current.style.width = `${tableWidth + widthDifference}px`
        console.log(`Applied width ${tableWidth + widthDifference}px to table`)
      }
    },
    [resizingColumnId, columns, tableWidth],
  )

  // End resizing
  const endResize = useCallback(() => {
    console.log(`Ending resize for column: ${resizingColumnId}`)
    setResizingColumnId(null)
    resizingRef.current = false
    document.body.classList.remove("resize-active")
  }, [resizingColumnId])

  // Add global event listeners when resizing
  useEffect(() => {
    if (resizingColumnId && resizingRef.current) {
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault()
        handleResize(e.clientX)
      }

      const handleMouseUp = () => {
        endResize()
      }

      // Add event listeners with capture phase to ensure we get all events
      document.addEventListener("mousemove", handleMouseMove, { capture: true, passive: false })
      document.addEventListener("mouseup", handleMouseUp, { capture: true })

      // Also add to window for extra reliability
      window.addEventListener("mousemove", handleMouseMove, { passive: false })
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove, { capture: true })
        document.removeEventListener("mouseup", handleMouseUp, { capture: true })
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [resizingColumnId, handleResize, endResize])

  return {
    columns,
    startResize,
    isResizing: resizingRef.current,
    resizingColumnId,
    tableWidth,
  }
}
