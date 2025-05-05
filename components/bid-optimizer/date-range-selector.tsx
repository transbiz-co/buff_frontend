"use client"

import * as React from "react"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateRangeSelectorProps {
  className?: string
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function DateRangeSelector({ className, onDateRangeChange }: DateRangeSelectorProps) {
  // Ensure we're using the current date for calculations
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today,
  })
  const [isOpen, setIsOpen] = React.useState(false)
  const [preset, setPreset] = React.useState<string>("last30Days")

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
      setDate(selectedPreset.range)
      onDateRangeChange(selectedPreset.range)
    }
  }

  // Handle custom date selection
  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range)
    if (range?.from && range?.to) {
      setPreset("custom")
      onDateRangeChange(range)
    }
  }

  // Initialize with default date range
  React.useEffect(() => {
    onDateRangeChange(date)
  }, [])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn("justify-start text-left font-normal bg-white", !date && "text-muted-foreground")}
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
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select value={preset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="today">{presets.today.label}</SelectItem>
                <SelectItem value="yesterday">{presets.yesterday.label}</SelectItem>
                <SelectItem value="last7Days">{presets.last7Days.label}</SelectItem>
                <SelectItem value="last30Days">{presets.last30Days.label}</SelectItem>
                <SelectItem value="thisMonth">{presets.thisMonth.label}</SelectItem>
                <SelectItem value="lastMonth">{presets.lastMonth.label}</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            className="p-3"
            disabled={(date) => date > new Date()} // Disable future dates
            toDate={new Date()} // Set maximum selectable date to today
          />
          <div className="p-3 border-t flex justify-end">
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
