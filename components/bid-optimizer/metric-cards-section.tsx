"use client"

import type React from "react"

import { useCallback } from "react"
import { MetricCard } from "@/components/metric-card"
import { toast } from "@/components/ui/use-toast"
import type { MetricConfig } from "@/components/enhanced-performance-chart-fallback"

interface MetricCardsSectionProps {
  metrics: MetricConfig[]
  onMetricsChange: React.Dispatch<React.SetStateAction<MetricConfig[]>>
}

export function MetricCardsSection({ metrics, onMetricsChange }: MetricCardsSectionProps) {
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

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {metrics.map((metric) => (
        <div key={metric.key} className="w-[140px] flex-grow-0 flex-shrink-0">
          <MetricCard
            title={metric.label}
            value={
              metric.key === "impressions"
                ? "257.0K"
                : metric.key === "clicks"
                  ? "1.5K"
                  : metric.key === "orders"
                    ? "51"
                    : metric.key === "spend"
                      ? "$1.1K"
                      : metric.key === "sales"
                        ? "$1.2K"
                        : metric.key === "acos"
                          ? "97.8%"
                          : metric.key === "ctr"
                            ? "0.59%"
                            : metric.key === "cvr"
                              ? "3.4%"
                              : metric.key === "cpc"
                                ? "$0.76"
                                : metric.key === "roas"
                                  ? "1.02"
                                  : metric.key === "rpc"
                                    ? "$0.78"
                                    : ""
            }
            trend={{
              prevValue:
                metric.key === "impressions"
                  ? "312.6K"
                  : metric.key === "clicks"
                    ? "1.8K"
                    : metric.key === "orders"
                      ? "77"
                      : metric.key === "spend"
                        ? "$1.3K"
                        : metric.key === "sales"
                          ? "$1.8K"
                          : metric.key === "acos"
                            ? "72.2%"
                            : metric.key === "ctr"
                              ? "0.57%"
                              : metric.key === "cvr"
                                ? "4.3%"
                                : metric.key === "cpc"
                                  ? "$0.75"
                                  : metric.key === "roas"
                                    ? "1.38"
                                    : metric.key === "rpc"
                                      ? "$1.04"
                                      : "",
              change:
                metric.key === "impressions"
                  ? "-17.8%"
                  : metric.key === "clicks"
                    ? "-15.1%"
                    : metric.key === "orders"
                      ? "-33.8%"
                      : metric.key === "spend"
                        ? "-13.8%"
                        : metric.key === "sales"
                          ? "-36.3%"
                          : metric.key === "acos"
                            ? "+35.4%"
                            : metric.key === "ctr"
                              ? "+3.5%"
                              : metric.key === "cvr"
                                ? "-21.9%"
                                : metric.key === "cpc"
                                  ? "+1.5%"
                                  : metric.key === "roas"
                                    ? "-26.1%"
                                    : metric.key === "rpc"
                                      ? "-25.0%"
                                      : "",
              isPositive:
                metric.key === "impressions"
                  ? false
                  : metric.key === "clicks"
                    ? false
                    : metric.key === "orders"
                      ? false
                      : metric.key === "spend"
                        ? true
                        : metric.key === "sales"
                          ? false
                          : metric.key === "acos"
                            ? false
                            : metric.key === "ctr"
                              ? true
                              : metric.key === "cvr"
                                ? false
                                : metric.key === "cpc"
                                  ? false
                                  : metric.key === "roas"
                                    ? false
                                    : metric.key === "rpc"
                                      ? false
                                      : false,
            }}
            isActive={metric.active}
            color={metric.color}
            onClick={() => toggleMetric(metric.key)}
            chartType={metric.chartType}
          />
        </div>
      ))}
    </div>
  )
}
