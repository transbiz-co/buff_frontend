"use client"

import { useState, useCallback } from "react"
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

// Sample data for the performance chart - dates from Mar 7 to Apr 6, 2025
const performanceData = [
  { date: "Mar 7", spend: 1063, sales: 1925, acos: 55.2 },
  { date: "Mar 8", spend: 850, sales: 1800, acos: 47.2 },
  { date: "Mar 9", spend: 950, sales: 4200, acos: 22.6 },
  { date: "Mar 10", spend: 600, sales: 1000, acos: 60.0 },
  { date: "Mar 11", spend: 1050, sales: 2200, acos: 47.7 },
  { date: "Mar 12", spend: 1200, sales: 2400, acos: 50.0 },
  { date: "Mar 13", spend: 1150, sales: 2350, acos: 48.9 },
  { date: "Mar 14", spend: 1750, sales: 3500, acos: 50.0 },
  { date: "Mar 15", spend: 1200, sales: 2300, acos: 52.2 },
  { date: "Mar 16", spend: 1750, sales: 4800, acos: 36.5 },
  { date: "Mar 17", spend: 1600, sales: 4200, acos: 38.1 },
  { date: "Mar 18", spend: 1550, sales: 5200, acos: 29.8 },
  { date: "Mar 19", spend: 800, sales: 2500, acos: 32.0 },
  { date: "Mar 20", spend: 750, sales: 2300, acos: 32.6 },
  { date: "Mar 21", spend: 1350, sales: 2800, acos: 48.2 },
  { date: "Mar 22", spend: 700, sales: 1200, acos: 58.3 },
  { date: "Mar 23", spend: 1450, sales: 4000, acos: 36.3 },
  { date: "Mar 24", spend: 1350, sales: 2500, acos: 54.0 },
  { date: "Mar 25", spend: 1750, sales: 6000, acos: 29.2 },
  { date: "Mar 26", spend: 1300, sales: 2800, acos: 46.4 },
  { date: "Mar 27", spend: 1850, sales: 5200, acos: 35.6 },
  { date: "Mar 28", spend: 1100, sales: 2700, acos: 40.7 },
  { date: "Mar 29", spend: 1800, sales: 3700, acos: 48.6 },
  { date: "Mar 30", spend: 1200, sales: 2800, acos: 42.9 },
  { date: "Mar 31", spend: 1700, sales: 5600, acos: 30.4 },
  { date: "Apr 1", spend: 600, sales: 1000, acos: 60.0 },
  { date: "Apr 2", spend: 700, sales: 1400, acos: 50.0 },
  { date: "Apr 3", spend: 1200, sales: 3200, acos: 37.5 },
  { date: "Apr 4", spend: 1500, sales: 4500, acos: 33.3 },
  { date: "Apr 5", spend: 1300, sales: 3900, acos: 33.3 },
  { date: "Apr 6", spend: 1100, sales: 3300, acos: 33.3 },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md">
        <p className="font-medium text-sm mb-1">{label}</p>
        <p className="text-sm text-[#2563EB]">Spend: ${payload[0]?.value?.toLocaleString()}</p>
        <p className="text-sm text-[#10B981]">Sales: ${payload[1]?.value?.toLocaleString()}</p>
        <p className="text-sm text-[#F59E0B]">ACOS: {payload[2]?.value}%</p>
      </div>
    )
  }

  return null
}

interface PerformanceChartProps {
  className?: string
  dateRange?: DateRange | undefined
}

export function PerformanceChart({ className, dateRange }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState("30d")

  // Filter data based on selected date range or time range
  const getFilteredData = useCallback(() => {
    if (dateRange?.from && dateRange?.to) {
      const { from, to } = dateRange
      if (!from || !to) return []
      return performanceData.filter((item) => {
        const year = 2025
        const dateStr = `${item.date}, ${year}`
        const itemDate = new Date(dateStr)
        return itemDate >= from && itemDate <= to
      })
    }

    // Otherwise, use the timeRange buttons
    switch (timeRange) {
      case "7d":
        return performanceData.slice(-7)
      case "14d":
        return performanceData.slice(-14)
      case "30d":
      default:
        return performanceData
    }
  }, [timeRange, dateRange])

  const filteredData = getFilteredData()

  // Determine if we should show the time range buttons
  const showTimeRangeButtons = !dateRange?.from || !dateRange?.to

  // Get a formatted date range string for display
  const getDateRangeString = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
    }
    return ""
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
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="spend" fill="#2563EB" radius={[2, 2, 0, 0]} maxBarSize={12} name="Spend" />
              <Bar yAxisId="left" dataKey="sales" fill="#10B981" radius={[2, 2, 0, 0]} maxBarSize={12} name="Sales" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acos"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2, fill: "white" }}
                name="ACOS"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
