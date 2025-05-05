"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface PerformanceChartFallbackProps {
  className?: string
  dateRange?: DateRange | undefined
}

export function PerformanceChartFallback({ className, dateRange }: PerformanceChartFallbackProps) {
  const [timeRange, setTimeRange] = useState("30d")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determine if we should show the time range buttons
  const showTimeRangeButtons = !dateRange?.from || !dateRange?.to

  // Get a formatted date range string for display
  const getDateRangeString = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
    }
    return ""
  }

  // Calculate the number of days to display based on date range
  const getDaysCount = () => {
    if (dateRange?.from && dateRange?.to) {
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
      return diffDays
    }

    // Default to time range if no date range is provided
    return timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Performance Over Time
          {dateRange?.from && dateRange?.to && (
            <span className="text-sm font-normal text-muted-foreground ml-2">({getDateRangeString()})</span>
          )}
        </CardTitle>
        {showTimeRangeButtons && (
          <div className="flex items-center gap-2">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7D
            </Button>
            <Button variant={timeRange === "14d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("14d")}>
              14D
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              30D
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#2563EB]"></div>
            <span className="text-sm">Spend</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#10B981]"></div>
            <span className="text-sm">Sales</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#F59E0B]"></div>
            <span className="text-sm">ACOS</span>
          </div>
        </div>
        <div className="h-[350px] w-full bg-muted/20 rounded-md relative overflow-hidden">
          {!isMounted ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading chart...</div>
          ) : (
            <>
              {/* Simple static chart visualization */}
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end px-4">
                {Array.from({ length: getDaysCount() }).map((_, i) => (
                  <div key={i} className="flex-1 mx-[1px] flex flex-col items-stretch h-full justify-end">
                    <div
                      className="w-full bg-[#10B981] rounded-t-sm"
                      style={{
                        height: `${20 + Math.random() * 50}%`,
                        opacity: 0.8,
                      }}
                    ></div>
                    <div
                      className="w-full bg-[#2563EB] rounded-t-sm mt-[1px]"
                      style={{
                        height: `${10 + Math.random() * 30}%`,
                        opacity: 0.8,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg width="100%" height="100%" className="text-[#F59E0B]">
                  <path
                    d={`M0,${150 + Math.random() * 50} ${Array.from({
                      length: getDaysCount(),
                    })
                      .map((_, i) => {
                        const x = (i + 1) * (100 / getDaysCount())
                        const y = 50 + Math.random() * 150
                        return `L${x},${y}`
                      })
                      .join(" ")}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-7 mt-4 text-xs text-muted-foreground">
          {getDaysCount() <= 7 ? (
            <>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </>
          ) : (
            <>
              <div>Week 1</div>
              <div></div>
              <div>Week 2</div>
              <div></div>
              <div>Week 3</div>
              <div></div>
              <div>Week 4</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
