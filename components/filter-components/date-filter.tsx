"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react"
import { format, addMonths, isAfter, isBefore, isSameDay, isValid, parse } from "date-fns"
import type { FilterCondition } from "./filter-types"
import { Input } from "@/components/ui/input"
import { createPortal } from "react-dom"

interface DateFilterProps {
  filter: FilterCondition
  onValueChange: (filterId: string, value: any, endValue?: any) => void
}

export const DateFilter = memo(function DateFilter({ filter, onValueChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filter.values[0]?.value ? new Date(filter.values[0].value) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    filter.values[0]?.endValue ? new Date(filter.values[0].endValue) : undefined,
  )
  const [showCalendar, setShowCalendar] = useState<boolean>(false)
  const [activeInput, setActiveInput] = useState<"start" | "end" | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)
  const [inputStartValue, setInputStartValue] = useState<string>(startDate ? format(startDate, "MM/dd/yyyy") : "")
  const [inputEndValue, setInputEndValue] = useState<string>(endDate ? format(endDate, "MM/dd/yyyy") : "")
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 })

  // Initialize portal container
  useEffect(() => {
    // Create portal container if it doesn't exist
    if (!document.getElementById("date-picker-portal")) {
      const div = document.createElement("div")
      div.id = "date-picker-portal"
      div.style.position = "fixed"
      div.style.top = "0"
      div.style.left = "0"
      div.style.width = "100%"
      div.style.height = "100%"
      div.style.pointerEvents = "none"
      div.style.zIndex = "99999"
      document.body.appendChild(div)
    }
    setPortalContainer(document.getElementById("date-picker-portal"))

    return () => {
      // Cleanup only if component is unmounting completely
      if (!document.querySelector('[data-filter-modal="true"]')) {
        const portal = document.getElementById("date-picker-portal")
        if (portal) {
          document.body.removeChild(portal)
        }
      }
    }
  }, [])

  // Update input values when dates change
  useEffect(() => {
    setInputStartValue(startDate ? format(startDate, "MM/dd/yyyy") : "")
  }, [startDate])

  useEffect(() => {
    setInputEndValue(endDate ? format(endDate, "MM/dd/yyyy") : "")
  }, [endDate])

  // Position calendar when shown
  useEffect(() => {
    if (showCalendar && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()

      // Calculate position - try to position below the input
      let top = rect.bottom + window.scrollY + 4
      let left = rect.left + window.scrollX

      // Check if calendar would go off the bottom of the screen
      const calendarHeight = 380 // Approximate height of calendar
      if (top + calendarHeight > window.innerHeight + window.scrollY) {
        // Position above the input instead
        top = rect.top + window.scrollY - calendarHeight - 4
      }

      // Check if calendar would go off the right of the screen
      const calendarWidth = 600 // Approximate width of calendar
      if (left + calendarWidth > window.innerWidth) {
        // Align right edge with right edge of input
        left = rect.right + window.scrollX - calendarWidth
      }

      setCalendarPosition({ top, left })
    }
  }, [showCalendar])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle manual input
  const handleInputChange = useCallback(
    (value: string, type: "start" | "end") => {
      if (type === "start") {
        setInputStartValue(value)
        // Try to parse the date
        const parsedDate = parse(value, "MM/dd/yyyy", new Date())
        if (isValid(parsedDate)) {
          setStartDate(parsedDate)
          if (filter.operator === "between" && endDate && isBefore(endDate, parsedDate)) {
            // If end date is before new start date, clear end date
            setEndDate(undefined)
            setInputEndValue("")
            onValueChange(filter.id, parsedDate.toISOString(), undefined)
          } else {
            onValueChange(filter.id, parsedDate.toISOString(), endDate?.toISOString())
          }

          // Auto-focus end date input after valid start date is entered
          if (filter.operator === "between" && endInputRef.current) {
            setTimeout(() => {
              endInputRef.current?.focus()
            }, 0)
          }
        }
      } else {
        setInputEndValue(value)
        // Try to parse the date
        const parsedDate = parse(value, "MM/dd/yyyy", new Date())
        if (isValid(parsedDate) && startDate && !isBefore(parsedDate, startDate)) {
          setEndDate(parsedDate)
          onValueChange(filter.id, startDate.toISOString(), parsedDate.toISOString())
        }
      }
    },
    [filter.id, filter.operator, startDate, endDate, onValueChange, setInputEndValue],
  )

  const handleDateSelect = useCallback(
    (date: Date) => {
      if (filter.operator === "between") {
        if (activeInput === "start" || (!activeInput && !startDate)) {
          setStartDate(date)

          // If we have an end date and it's before the new start date, clear it
          if (endDate && isBefore(endDate, date)) {
            setEndDate(undefined)
            setInputEndValue("")
            onValueChange(filter.id, date.toISOString(), undefined)
          } else {
            onValueChange(filter.id, date.toISOString(), endDate?.toISOString())
          }

          // Automatically switch to end date selection
          setActiveInput("end")

          // Auto-focus end date input after selecting start date
          if (endInputRef.current) {
            setTimeout(() => {
              endInputRef.current?.focus()
            }, 0)
          }
        } else if (activeInput === "end") {
          // Only allow end date to be after start date
          if (startDate && !isBefore(date, startDate)) {
            setEndDate(date)
            onValueChange(filter.id, startDate.toISOString(), date.toISOString())
            setShowCalendar(false)
          }
        }
      } else {
        // For single date selection (before, after, equals)
        setStartDate(date)
        setEndDate(undefined) // Clear any end date to avoid confusion
        onValueChange(filter.id, date.toISOString())
        setShowCalendar(false)
      }
    },
    [filter.id, filter.operator, activeInput, startDate, endDate, onValueChange, setInputEndValue],
  )

  const nextMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }, [currentMonth])

  const prevMonth = useCallback(() => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }, [currentMonth])

  const clearDates = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
    setInputStartValue("")
    setInputEndValue("")
    onValueChange(filter.id, undefined, undefined)
  }, [filter.id, onValueChange])

  if (filter.operator === "never") {
    return <div className="text-sm text-muted-foreground">No date input required</div>
  }

  // Generate calendar for a specific month
  const renderCalendarMonth = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    // Get day of week of first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days in month
    const daysInMonth = lastDay.getDate()

    // Create array of week rows
    const weeks = []
    let days = []

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i)
      days.push(date)

      // Start new week row when we reach Saturday
      if ((firstDayOfWeek + i) % 7 === 0 || i === daysInMonth) {
        // If this is the last day and we haven't filled the week, add empty cells
        if (i === daysInMonth) {
          const remainingDays = 7 - (days.length % 7)
          if (remainingDays < 7) {
            for (let j = 0; j < remainingDays; j++) {
              days.push(null)
            }
          }
        }

        weeks.push([...days])
        days = []
      }
    }

    const today = new Date()

    return (
      <div className="calendar-month">
        <div className="text-center font-medium py-2">{format(month, "MMMM yyyy")}</div>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-8 w-8" />
              }

              // For single date operations, only highlight the start date
              const isSelected =
                filter.operator === "between"
                  ? (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))
                  : startDate && isSameDay(day, startDate)

              // Only show range highlighting for 'between' operator
              const isInRange =
                filter.operator === "between" &&
                startDate &&
                endDate &&
                isAfter(day, startDate) &&
                isBefore(day, endDate)

              const isFutureDate = isAfter(day, today)

              const isDisabled = isFutureDate || (activeInput === "end" && startDate && isBefore(day, startDate))

              return (
                <button
                  key={`day-${day.getDate()}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm
                    ${isSelected ? "bg-primary text-white" : ""}
                    ${isInRange ? "bg-primary/20" : ""}
                    ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                  `}
                  aria-label={format(day, "MMMM d, yyyy")}
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                >
                  {day.getDate()}
                </button>
              )
            }),
          )}
        </div>
      </div>
    )
  }

  // Calendar component to be rendered in portal
  const CalendarComponent = () => (
    <div
      ref={calendarRef}
      className="fixed bg-white border rounded-md shadow-md p-4 z-[99999]"
      style={{
        top: `${calendarPosition.top}px`,
        left: `${calendarPosition.left}px`,
        width: "600px",
        pointerEvents: "auto",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {filter.operator === "between"
            ? activeInput === "start"
              ? "Select Start Date"
              : "Select End Date"
            : "Select Date"}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-4">
        {renderCalendarMonth(currentMonth)}
        {renderCalendarMonth(addMonths(currentMonth, 1))}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="ghost" size="sm" onClick={clearDates}>
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowCalendar(false)
          }}
        >
          Close
        </Button>
      </div>
    </div>
  )

  if (filter.operator === "between") {
    return (
      <div className="flex gap-2 relative" ref={triggerRef}>
        <div className="flex-1">
          <div className="relative">
            <Input
              ref={startInputRef}
              type="text"
              placeholder="MM/DD/YYYY"
              value={inputStartValue}
              onChange={(e) => handleInputChange(e.target.value, "start")}
              onFocus={() => {
                setActiveInput("start")
                setShowCalendar(true)
              }}
              aria-label="Start date"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <CalendarIcon
                className="h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => {
                  setActiveInput("start")
                  setShowCalendar(true)
                  startInputRef.current?.focus()
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">-</div>

        <div className="flex-1">
          <div className="relative">
            <Input
              ref={endInputRef}
              type="text"
              placeholder="MM/DD/YYYY"
              value={inputEndValue}
              onChange={(e) => handleInputChange(e.target.value, "end")}
              onFocus={() => {
                setActiveInput("end")
                setShowCalendar(true)
              }}
              aria-label="End date"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <CalendarIcon
                className="h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => {
                  setActiveInput("end")
                  setShowCalendar(true)
                  endInputRef.current?.focus()
                }}
              />
            </div>
          </div>
        </div>

        {(startDate || endDate) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={clearDates}
            aria-label="Clear dates"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {showCalendar && portalContainer && createPortal(<CalendarComponent />, portalContainer)}
      </div>
    )
  }

  // For "before", "after", "is"
  return (
    <div className="relative w-full" ref={triggerRef}>
      <div className="relative">
        <Input
          ref={startInputRef}
          type="text"
          placeholder="MM/DD/YYYY"
          value={inputStartValue}
          onChange={(e) => handleInputChange(e.target.value, "start")}
          onFocus={() => {
            setActiveInput("start")
            setShowCalendar(true)
          }}
          aria-label="Date"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <CalendarIcon
            className="h-4 w-4 text-gray-400 cursor-pointer"
            onClick={() => {
              setActiveInput("start")
              setShowCalendar(true)
              startInputRef.current?.focus()
            }}
          />
        </div>
      </div>

      {startDate && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
          onClick={clearDates}
          aria-label="Clear date"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {showCalendar && portalContainer && createPortal(<CalendarComponent />, portalContainer)}
    </div>
  )
})
