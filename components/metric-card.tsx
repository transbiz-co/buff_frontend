"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart2, LineChart } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  trend?: {
    prevValue?: string
    change: string
    isPositive: boolean
  }
  className?: string
  isActive?: boolean
  color?: string
  onClick?: () => void
  chartType?: "bar" | "line"
}

export function MetricCard({
  title,
  value,
  trend,
  className,
  isActive = false,
  color = "#000",
  onClick,
  chartType = "bar",
}: MetricCardProps) {
  return (
    <Card
      className={`${className} ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} w-full h-full`}
      onClick={onClick}
    >
      <CardContent className="p-3 relative">
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-md" style={{ backgroundColor: color }} />
        )}
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-muted-foreground truncate">{title}</div>
          {isActive && (
            <div className="text-xs" style={{ color }}>
              {chartType === "bar" ? <BarChart2 size={12} /> : <LineChart size={12} />}
            </div>
          )}
        </div>
        <div className="text-lg font-bold truncate">{value}</div>
        {trend && (
          <div className="flex items-center mt-1">
            {trend.prevValue && <span className="text-xs text-muted-foreground mr-1 truncate">{trend.prevValue}</span>}
            <div className={`flex items-center text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {trend.isPositive ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
              <span className="truncate">{trend.change}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
