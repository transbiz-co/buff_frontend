"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CustomDateRangeSelectorProps {
  className?: string
  onDateRangeChange: (range: DateRange | undefined) => void
  position?: "left" | "right" // Added position prop to control popover direction
  initialDateRange?: DateRange
}

// Check if a date is in the future
const isFutureDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}

// Simple day picker component that doesn't rely on react-day-picker
function SimpleDayPicker({
  month,
  selected,
  onSelect,
  onMonthChange,
}: {
  month: Date
  selected: DateRange | undefined
  onSelect: (day: Date) => void
  onMonthChange: (month: Date) => void
}) {
  // Get days in month
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay()

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Create array of empty cells for days before first day of month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null)

  // Combine empty cells and days
  const cells = [...emptyCells, ...days]

  // Create weeks (7 days per week)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Check if a day is selected
  const isDaySelected = (day: number) => {
    if (!selected) return false

    const date = new Date(month.getFullYear(), month.getMonth(), day)

    if (selected.from && selected.to) {
      return date >= selected.from && date <= selected.to
    }

    if (selected.from) {
      return date.getTime() === selected.from.getTime()
    }

    return false
  }

  // Check if a day is the start of the range
  const isRangeStart = (day: number) => {
    if (!selected?.from) return false

    const date = new Date(month.getFullYear(), month.getMonth(), day)
    return date.getTime() === selected.from.getTime()
  }

  // Check if a day is the end of the range
  const isRangeEnd = (day: number) => {
    if (!selected?.to) return false

    const date = new Date(month.getFullYear(), month.getMonth(), day)
    return date.getTime() === selected.to.getTime()
  }

  // Check if a day is in the range
  const isInRange = (day: number) => {
    if (!selected?.from || !selected?.to) return false

    const date = new Date(month.getFullYear(), month.getMonth(), day)
    return date > selected.from && date < selected.to
  }

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day && today.getMonth() === month.getMonth() && today.getFullYear() === month.getFullYear()
    )
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">{format(month, "MMMM yyyy")}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="mt-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={`empty-${dayIndex}`} className="h-8" />
              }

              const isSelected = isDaySelected(day)
              const rangeStart = isRangeStart(day)
              const rangeEnd = isRangeEnd(day)
              const inRange = isInRange(day)
              const today = isToday(day)

              return (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                    isSelected && "bg-primary text-white",
                    !isSelected && today && "bg-gray-100",
                    !isSelected && !today && "hover:bg-gray-100",
                    rangeStart && "rounded-l-full",
                    rangeEnd && "rounded-r-full",
                    inRange && "bg-primary/20",
                    isFutureDate(new Date(month.getFullYear(), month.getMonth(), day)) &&
                      "text-gray-300 cursor-not-allowed",
                  )}
                  onClick={() => {
                    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day)
                    if (!isFutureDate(selectedDate)) {
                      onSelect(selectedDate)
                    }
                  }}
                  disabled={isFutureDate(new Date(month.getFullYear(), month.getMonth(), day))}
                >
                  {day}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CustomDateRangeSelector({
  className,
  onDateRangeChange,
  position = "right", // Default to right if not specified
  initialDateRange,
}: CustomDateRangeSelectorProps) {
  // Ensure we're using the current date for calculations
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Use initialDateRange if provided, otherwise default to last 30 days
  const defaultRange = initialDateRange || {
    from: subDays(today, 30),
    to: today,
  }

  const [date, setDate] = React.useState<DateRange | undefined>(defaultRange)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(defaultRange) // Temporary date while selecting
  const [isOpen, setIsOpen] = React.useState(false)
  const [preset, setPreset] = React.useState<string>("last30Days")

  // Initialize month displays based on the selected date range
  const [month1, setMonth1] = React.useState<Date>(tempDate?.from || new Date())
  const [month2, setMonth2] = React.useState<Date>(
    tempDate?.to && tempDate.from?.getMonth() !== tempDate.to.getMonth()
      ? tempDate.to
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  )

  const [selectingEnd, setSelectingEnd] = React.useState<boolean>(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Predefined date ranges
  const presets = {
    today: {
      label: "Today",
      range: { from: today, to: today },
    },
    yesterday: {
      label: "Yesterday",
      range: {
        from: subDays(today, 1),
        to: subDays(today, 1),
      },
    },
    last7Days: {
      label: "Last 7 days",
      range: {
        from: subDays(today, 6),
        to: today,
      },
    },
    last30Days: {
      label: "Last 30 days",
      range: {
        from: subDays(today, 29),
        to: today,
      },
    },
    thisMonth: {
      label: "This month",
      range: {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      },
    },
    lastMonth: {
      label: "Last month",
      range: {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      },
    },
  }

  // Handle preset selection
  const handlePresetChange = (value: string) => {
    setPreset(value)
    const selectedPreset = presets[value as keyof typeof presets]
    if (selectedPreset) {
      setTempDate(selectedPreset.range)
      setSelectingEnd(false) // Reset selection state when preset is selected

      // Update calendar months to match the new range
      setMonth1(selectedPreset.range.from)
      if (selectedPreset.range.to && selectedPreset.range.from.getMonth() !== selectedPreset.range.to.getMonth()) {
        setMonth2(selectedPreset.range.to)
      } else {
        setMonth2(new Date(selectedPreset.range.from.getFullYear(), selectedPreset.range.from.getMonth() + 1, 1))
      }

      // Don't trigger onChange here - wait for Apply button
    }
  }

  // Handle day selection
  const handleDaySelect = (day: Date) => {
    // Prevent selecting future dates
    if (isFutureDate(day)) return

    if (!selectingEnd) {
      // Selecting start date
      setTempDate({ from: day, to: undefined })
      setSelectingEnd(true)
    } else {
      // Selecting end date
      const newRange = { from: tempDate?.from, to: day }

      // Make sure end date is after start date
      if (tempDate?.from && day < tempDate.from) {
        newRange.from = day
        newRange.to = tempDate.from
      }

      // Make sure end date is not in the future
      if (newRange.to && isFutureDate(newRange.to)) {
        newRange.to = today
      }

      setTempDate(newRange)
      setSelectingEnd(false)

      // Don't trigger onChange here - wait for Apply button
    }
  }

  // Initialize calendar months based on the date range, but don't trigger onChange
  React.useEffect(() => {
    // Set initial calendar months based on the date range
    if (tempDate?.from) {
      setMonth1(tempDate.from)
    }
    if (tempDate?.to && tempDate.from && tempDate.from.getMonth() !== tempDate.to.getMonth()) {
      setMonth2(tempDate.to)
    } else if (tempDate?.from) {
      setMonth2(new Date(tempDate.from.getFullYear(), tempDate.from.getMonth() + 1, 1))
    }
  }, [])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Button
        id="date"
        variant="outline"
        size="sm"
        className={cn("justify-start text-left font-normal bg-white", !date && "text-muted-foreground")}
        onClick={() => {
          // Reset temp date to current date when opening
          setTempDate(date)
          setSelectingEnd(false)
          // Update month displays to match current date
          if (date?.from) {
            setMonth1(date.from)
            if (date?.to && date.from.getMonth() !== date.to.getMonth()) {
              setMonth2(date.to)
            } else {
              setMonth2(new Date(date.from.getFullYear(), date.from.getMonth() + 1, 1))
            }
          }
          setIsOpen(!isOpen)
        }}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
            </>
          ) : (
            format(date.from, "MMM d, yyyy")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </Button>

      {isOpen && (
        <div
          className={`absolute bg-white border rounded-md shadow-lg z-50 w-[600px] ${
            position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : "right-0 left-auto mt-1"
          }`}
        >
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={key === preset ? "default" : "outline"}
                  onClick={() => handlePresetChange(key)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant={preset === "custom" ? "default" : "outline"}
                onClick={() => setPreset("custom")}
                className="text-xs"
              >
                Custom
              </Button>
            </div>
          </div>

          <div className="flex">
            <SimpleDayPicker month={month1} selected={tempDate} onSelect={handleDaySelect} onMonthChange={setMonth1} />
            <SimpleDayPicker month={month2} selected={tempDate} onSelect={handleDaySelect} onMonthChange={setMonth2} />
          </div>

          <div className="p-3 border-t flex justify-between items-center">
            <div className="text-sm">
              {selectingEnd && tempDate?.from ? (
                <span>Select end date</span>
              ) : (
                <span>
                  {tempDate?.from && tempDate?.to ? (
                    <>
                      {format(tempDate.from, "MMM d, yyyy")} - {format(tempDate.to, "MMM d, yyyy")}
                    </>
                  ) : (
                    "Select start date"
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  // Cancel and restore previous date
                  setTempDate(date)
                  setSelectingEnd(false)
                  setIsOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  // Only trigger onChange when Apply is clicked
                  if (tempDate?.from && tempDate?.to) {
                    setDate(tempDate)
                    onDateRangeChange(tempDate)
                  }
                  setIsOpen(false)
                }}
                disabled={!tempDate?.from || !tempDate?.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
