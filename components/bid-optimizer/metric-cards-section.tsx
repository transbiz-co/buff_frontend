"use client"

import type React from "react"

import { useCallback } from "react"
import { MetricCard } from "@/components/metric-card"
import { toast } from "sonner"
import type { MetricConfig } from "@/components/enhanced-performance-chart-fallback"
import type { MetricSummary } from "@/lib/api/bid-optimizer-api"

interface MetricCardsSectionProps {
  metrics: MetricConfig[]
  onMetricsChange: React.Dispatch<React.SetStateAction<MetricConfig[]>>
  summary?: {
    current: MetricSummary
    previous: MetricSummary
    changes: Record<string, string>
  }
}

export function MetricCardsSection({ metrics, onMetricsChange, summary }: MetricCardsSectionProps) {
  const toggleMetric = useCallback(
    (key: string) => {
      onMetricsChange((prevMetrics) => {
        // Count currently active metrics
        const activeCount = prevMetrics.filter((m) => m.active).length

        // Find the metric we're toggling
        const metric = prevMetrics.find((m) => m.key === key)

        // If we're trying to activate a metric and already have 4 active
        if (!metric?.active && activeCount >= 4) {
          toast.error(
            "You can only display up to 4 metrics at a time. Please deactivate a metric before adding another.",
          )
          return prevMetrics
        }

        // Otherwise toggle the metric
        return prevMetrics.map((metric) => (metric.key === key ? { ...metric, active: !metric.active } : metric))
      })
    },
    [onMetricsChange],
  )

  // Helper function to format metric values
  const formatMetricValue = (key: string, value: number | string | null): string => {
    if (value === null || value === undefined) return "N/A"
    
    switch (key) {
      case "impressions":
      case "clicks":
      case "orders":
      case "units":
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          compactDisplay: 'short'
        }).format(Number(value))
      
      case "spend":
      case "sales":
      case "cpc":
      case "rpc":
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
          compactDisplay: 'short'
        }).format(Number(value))
      
      case "acos":
      case "ctr":
      case "cvr":
        return `${value}%`
      
      case "roas":
        return String(value)
      
      default:
        return String(value)
    }
  }

  // Helper function to determine if a metric change is positive
  const isPositiveChange = (key: string, changeValue: string): boolean => {
    const numericChange = parseFloat(changeValue)
    
    // For these metrics, a decrease is positive
    if (["acos", "cpc", "spend"].includes(key)) {
      return numericChange < 0
    }
    
    // For all other metrics, an increase is positive
    return numericChange > 0
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {metrics.map((metric) => {
        const currentValue = summary?.current?.[metric.key as keyof MetricSummary]
        const previousValue = summary?.previous?.[metric.key as keyof MetricSummary]
        const changeValue = summary?.changes?.[metric.key]
        
        return (
          <div key={metric.key} className="w-[140px] flex-grow-0 flex-shrink-0">
            <MetricCard
              title={metric.label}
              value={formatMetricValue(metric.key, currentValue ?? 0)}
              trend={{
                prevValue: formatMetricValue(metric.key, previousValue ?? 0),
                change: changeValue || "0%",
                isPositive: changeValue ? isPositiveChange(metric.key, changeValue) : true
              }}
            isActive={metric.active}
            color={metric.color}
            onClick={() => toggleMetric(metric.key)}
            chartType={metric.chartType}
          />
        </div>
        )
      })}
    </div>
  )
}
