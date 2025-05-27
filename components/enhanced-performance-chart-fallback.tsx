"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import type { DailyPerformance } from "@/lib/api/bid-optimizer-api"

// Sample data for the performance chart - dates from Mar 7 to Apr 6, 2025
const samplePerformanceData = [
  {
    date: "Mar 7",
    spend: 1063,
    sales: 1925,
    acos: 55.2,
    impressions: 141769,
    clicks: 1871,
    orders: 128,
    units: 193,
    ctr: 1.3,
    cvr: 6.8,
    cpc: 0.81,
    roas: 1.81,
    rpc: 6.32,
  },
  {
    date: "Mar 8",
    spend: 850,
    sales: 1800,
    acos: 47.2,
    impressions: 140898,
    clicks: 1800,
    orders: 120,
    units: 180,
    ctr: 1.3,
    cvr: 6.7,
    cpc: 0.79,
    roas: 2.12,
    rpc: 6.0,
  },
  {
    date: "Mar 9",
    spend: 950,
    sales: 4200,
    acos: 22.6,
    impressions: 142000,
    clicks: 1900,
    orders: 210,
    units: 320,
    ctr: 1.3,
    cvr: 11.1,
    cpc: 0.5,
    roas: 4.42,
    rpc: 10.5,
  },
  {
    date: "Mar 10",
    spend: 600,
    sales: 1000,
    acos: 60.0,
    impressions: 98765,
    clicks: 1200,
    orders: 50,
    units: 75,
    ctr: 1.2,
    cvr: 4.2,
    cpc: 0.5,
    roas: 1.67,
    rpc: 4.17,
  },
  {
    date: "Mar 11",
    spend: 1050,
    sales: 2200,
    acos: 47.7,
    impressions: 110000,
    clicks: 2100,
    orders: 110,
    units: 165,
    ctr: 1.9,
    cvr: 5.2,
    cpc: 0.5,
    roas: 2.1,
    rpc: 5.24,
  },
  {
    date: "Mar 12",
    spend: 1200,
    sales: 2400,
    acos: 50.0,
    impressions: 115000,
    clicks: 2300,
    orders: 120,
    units: 180,
    ctr: 2.0,
    cvr: 5.2,
    cpc: 0.52,
    roas: 2.0,
    rpc: 5.22,
  },
  {
    date: "Mar 13",
    spend: 1150,
    sales: 2350,
    acos: 48.9,
    impressions: 112000,
    clicks: 2200,
    orders: 117,
    units: 175,
    ctr: 2.0,
    cvr: 5.3,
    cpc: 0.52,
    roas: 2.04,
    rpc: 5.34,
  },
  {
    date: "Mar 14",
    spend: 1750,
    sales: 3500,
    acos: 50.0,
    impressions: 130000,
    clicks: 3200,
    orders: 175,
    units: 260,
    ctr: 2.5,
    cvr: 5.5,
    cpc: 0.55,
    roas: 2.0,
    rpc: 5.47,
  },
  {
    date: "Mar 15",
    spend: 1200,
    sales: 2300,
    acos: 52.2,
    impressions: 118000,
    clicks: 2400,
    orders: 115,
    units: 170,
    ctr: 2.0,
    cvr: 4.8,
    cpc: 0.5,
    roas: 1.92,
    rpc: 4.79,
  },
  {
    date: "Mar 16",
    spend: 1750,
    sales: 4800,
    acos: 36.5,
    impressions: 135000,
    clicks: 3300,
    orders: 240,
    units: 360,
    ctr: 2.4,
    cvr: 7.3,
    cpc: 0.53,
    roas: 2.74,
    rpc: 7.27,
  },
  {
    date: "Mar 17",
    spend: 1600,
    sales: 4200,
    acos: 38.1,
    impressions: 128000,
    clicks: 3100,
    orders: 210,
    units: 315,
    ctr: 2.4,
    cvr: 6.8,
    cpc: 0.52,
    roas: 2.63,
    rpc: 6.77,
  },
  {
    date: "Mar 18",
    spend: 1550,
    sales: 5200,
    acos: 29.8,
    impressions: 125000,
    clicks: 3000,
    orders: 260,
    units: 390,
    ctr: 2.4,
    cvr: 8.7,
    cpc: 0.52,
    roas: 3.35,
    rpc: 8.67,
  },
  {
    date: "Mar 19",
    spend: 800,
    sales: 2500,
    acos: 32.0,
    impressions: 95000,
    clicks: 1600,
    orders: 125,
    units: 190,
    ctr: 1.7,
    cvr: 7.8,
    cpc: 0.5,
    roas: 3.13,
    rpc: 7.81,
  },
  {
    date: "Mar 20",
    spend: 750,
    sales: 2300,
    acos: 32.6,
    impressions: 92000,
    clicks: 1500,
    orders: 115,
    units: 175,
    ctr: 1.6,
    cvr: 7.7,
    cpc: 0.5,
    roas: 3.07,
    rpc: 7.67,
  },
  {
    date: "Mar 21",
    spend: 1350,
    sales: 2800,
    acos: 48.2,
    impressions: 120000,
    clicks: 2700,
    orders: 140,
    units: 210,
    ctr: 2.3,
    cvr: 5.2,
    cpc: 0.5,
    roas: 2.07,
    rpc: 5.19,
  },
  {
    date: "Mar 22",
    spend: 700,
    sales: 1200,
    acos: 58.3,
    impressions: 85000,
    clicks: 1400,
    orders: 60,
    units: 90,
    ctr: 1.6,
    cvr: 4.3,
    cpc: 0.5,
    roas: 1.71,
    rpc: 4.29,
  },
  {
    date: "Mar 23",
    spend: 1450,
    sales: 4000,
    acos: 36.3,
    impressions: 122000,
    clicks: 2900,
    orders: 200,
    units: 300,
    ctr: 2.4,
    cvr: 6.9,
    cpc: 0.5,
    roas: 2.76,
    rpc: 6.9,
  },
  {
    date: "Mar 24",
    spend: 1350,
    sales: 2500,
    acos: 54.0,
    impressions: 118000,
    clicks: 2700,
    orders: 125,
    units: 190,
    ctr: 2.3,
    cvr: 4.6,
    cpc: 0.5,
    roas: 1.85,
    rpc: 4.63,
  },
  {
    date: "Mar 25",
    spend: 1750,
    sales: 6000,
    acos: 29.2,
    impressions: 135000,
    clicks: 3500,
    orders: 300,
    units: 450,
    ctr: 2.6,
    cvr: 8.6,
    cpc: 0.5,
    roas: 3.43,
    rpc: 8.57,
  },
  {
    date: "Mar 26",
    spend: 1300,
    sales: 2800,
    acos: 46.4,
    impressions: 115000,
    clicks: 2600,
    orders: 140,
    units: 210,
    ctr: 2.3,
    cvr: 5.4,
    cpc: 0.5,
    roas: 2.15,
    rpc: 5.38,
  },
  {
    date: "Mar 27",
    spend: 1850,
    sales: 5200,
    acos: 35.6,
    impressions: 140000,
    clicks: 3700,
    orders: 260,
    units: 390,
    ctr: 2.6,
    cvr: 7.0,
    cpc: 0.5,
    roas: 2.81,
    rpc: 7.03,
  },
  {
    date: "Mar 28",
    spend: 1100,
    sales: 2700,
    acos: 40.7,
    impressions: 105000,
    clicks: 2200,
    orders: 135,
    units: 200,
    ctr: 2.1,
    cvr: 6.1,
    cpc: 0.5,
    roas: 2.45,
    rpc: 6.14,
  },
  {
    date: "Mar 29",
    spend: 1800,
    sales: 3700,
    acos: 48.6,
    impressions: 138000,
    clicks: 3600,
    orders: 185,
    units: 280,
    ctr: 2.6,
    cvr: 5.1,
    cpc: 0.5,
    roas: 2.06,
    rpc: 5.14,
  },
  {
    date: "Mar 30",
    spend: 1200,
    sales: 2800,
    acos: 42.9,
    impressions: 110000,
    clicks: 2400,
    orders: 140,
    units: 210,
    ctr: 2.2,
    cvr: 5.8,
    cpc: 0.5,
    roas: 2.33,
    rpc: 5.83,
  },
  {
    date: "Mar 31",
    spend: 1700,
    sales: 5600,
    acos: 30.4,
    impressions: 132000,
    clicks: 3400,
    orders: 280,
    units: 420,
    ctr: 2.6,
    cvr: 8.2,
    cpc: 0.5,
    roas: 3.29,
    rpc: 8.24,
  },
  {
    date: "Apr 1",
    spend: 600,
    sales: 1000,
    acos: 60.0,
    impressions: 80000,
    clicks: 1200,
    orders: 50,
    units: 75,
    ctr: 1.5,
    cvr: 4.2,
    cpc: 0.5,
    roas: 1.67,
    rpc: 4.17,
  },
  {
    date: "Apr 2",
    spend: 700,
    sales: 1400,
    acos: 50.0,
    impressions: 85000,
    clicks: 1400,
    orders: 70,
    units: 105,
    ctr: 1.6,
    cvr: 5.0,
    cpc: 0.5,
    roas: 2.0,
    rpc: 5.0,
  },
  {
    date: "Apr 3",
    spend: 1200,
    sales: 3200,
    acos: 37.5,
    impressions: 110000,
    clicks: 2400,
    orders: 160,
    units: 240,
    ctr: 2.2,
    cvr: 6.7,
    cpc: 0.5,
    roas: 2.67,
    rpc: 6.67,
  },
  {
    date: "Apr 4",
    spend: 1500,
    sales: 4500,
    acos: 33.3,
    impressions: 125000,
    clicks: 3000,
    orders: 225,
    units: 340,
    ctr: 2.4,
    cvr: 7.5,
    cpc: 0.5,
    roas: 3.0,
    rpc: 7.5,
  },
  {
    date: "Apr 5",
    spend: 1300,
    sales: 3900,
    acos: 33.3,
    impressions: 115000,
    clicks: 2600,
    orders: 195,
    units: 290,
    ctr: 2.3,
    cvr: 7.5,
    cpc: 0.5,
    roas: 3.0,
    rpc: 7.5,
  },
  {
    date: "Apr 6",
    spend: 1100,
    sales: 3300,
    acos: 33.3,
    impressions: 105000,
    clicks: 2200,
    orders: 165,
    units: 250,
    ctr: 2.1,
    cvr: 7.5,
    cpc: 0.5,
    roas: 3.0,
    rpc: 7.5,
  },
]

interface TooltipState {
  visible: boolean
  x: number
  y: number
  dataIndex: number
}

export type ChartType = "bar" | "line"

export interface MetricConfig {
  key: string
  color: string
  active: boolean
  label: string
  chartType: ChartType
  // Define typical ranges for each metric to help with scaling
  range?: {
    min: number
    max: number
  }
}

interface EnhancedPerformanceChartFallbackProps {
  className?: string
  activeMetrics: MetricConfig[]
  dateRange?: DateRange | undefined
  data?: DailyPerformance[]
}

// Define some sensible default ranges for metrics that need special handling
const defaultMetricRanges = {
  acos: { min: 0, max: 100 }, // Percentages typically 0-100%
  ctr: { min: 0, max: 5 }, // CTR typically under 5%
  cvr: { min: 0, max: 15 }, // CVR typically under 15%
}

export function EnhancedPerformanceChartFallback({
  className,
  activeMetrics,
  dateRange,
  data,
}: EnhancedPerformanceChartFallbackProps) {
  const [timeRange, setTimeRange] = useState("30d")
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    dataIndex: 0,
  })

  // Transform API data to match the chart format
  const transformData = useCallback((apiData: DailyPerformance[]) => {
    return apiData.map(item => ({
      date: format(new Date(item.date), 'MMM d'),
      spend: parseFloat(item.spend),
      sales: parseFloat(item.sales),
      acos: item.acos !== null && item.acos !== undefined ? parseFloat(item.acos) : null,
      acosIsInfinite: item.acos === null && parseFloat(item.spend) > 0, // 標記無限大的情況
      impressions: item.impressions,
      clicks: item.clicks,
      orders: item.orders,
      units: item.units,
      ctr: item.ctr ? parseFloat(item.ctr) : 0,
      cvr: item.cvr ? parseFloat(item.cvr) : 0,
      cpc: item.cpc ? parseFloat(item.cpc) : 0,
      roas: item.roas ? parseFloat(item.roas) : 0,
      rpc: item.rpc ? parseFloat(item.rpc) : 0,
    }))
  }, [])

  // Filter data based on selected date range
  const getFilteredData = useCallback(() => {
    // Use provided data if available, otherwise use sample data
    const sourceData = data ? transformData(data) : samplePerformanceData
    
    // If we have a date range from the campaign table, use that
    if (dateRange?.from && dateRange?.to) {
      return sourceData.filter((item) => {
        // Convert string date like "Mar 7" to a Date object for comparison
        const year = new Date().getFullYear()
        const dateStr = `${item.date}, ${year}`
        const itemDate = new Date(dateStr)

        return itemDate >= dateRange.from && itemDate <= dateRange.to
      })
    }

    // Otherwise, use the timeRange buttons
    switch (timeRange) {
      case "7d":
        return sourceData.slice(-7)
      case "14d":
        return sourceData.slice(-14)
      case "30d":
      default:
        return sourceData
    }
  }, [timeRange, dateRange, data, transformData])

  const filteredData = getFilteredData()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Add this after the useEffect that sets isMounted
  useEffect(() => {
    if (!isMounted || !chartContainerRef.current) return

    // Function to update the canvas and redraw
    const updateCanvas = () => {
      if (!canvasRef.current || !chartContainerRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Get the device pixel ratio for high-DPI displays
      const dpr = window.devicePixelRatio || 1

      // Get the container's dimensions
      const rect = chartContainerRef.current.getBoundingClientRect()

      // Set the canvas dimensions with device pixel ratio for sharper rendering
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Scale the canvas context
      ctx.scale(dpr, dpr)

      // Set the canvas CSS dimensions
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      drawChart()
    }

    // Create a resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvas()
    })

    // Observe the chart container
    resizeObserver.observe(chartContainerRef.current)

    // Initial update
    updateCanvas()

    // Clean up
    return () => {
      resizeObserver.disconnect()
    }
  }, [isMounted, filteredData, timeRange, tooltip.visible, tooltip.dataIndex, activeMetrics])

  // Get min and max values for each active metric
  const getMetricRange = (metricKey: string) => {
    // Always start with 0 as the minimum as requested
    const min = 0

    // Special handling for ACOS
    if (metricKey === 'acos') {
      let max = Number.NEGATIVE_INFINITY
      let hasInfiniteValues = false

      filteredData.forEach((item) => {
        if (item.acosIsInfinite) {
          hasInfiniteValues = true
        } else if (item.acos !== null && item.acos > max) {
          max = item.acos
        }
      })

      // If we have infinite values, set a visual ceiling
      if (hasInfiniteValues) {
        // Use 200% as visual ceiling, or actual max if it's higher
        max = Math.max(max, 200)
      }

      // Check if we have a predefined range and if the data exceeds it
      const defaultRange = defaultMetricRanges[metricKey as keyof typeof defaultMetricRanges]
      if (defaultRange && max <= defaultRange.max && !hasInfiniteValues) {
        return defaultRange
      }

      // Add padding and round to nice number
      max = max * 1.1
      if (max > 100) {
        max = Math.ceil(max / 50) * 50
      } else {
        max = Math.ceil(max / 10) * 10
      }

      return { min, max }
    }

    // For other metrics, use the original logic
    let max = Number.NEGATIVE_INFINITY

    filteredData.forEach((item) => {
      const value = item[metricKey as keyof typeof item] as number | null
      if (value !== null && value !== undefined && value > max) max = value
    })

    // If no valid data points found, use a default range
    if (max === Number.NEGATIVE_INFINITY) {
      const defaultRange = defaultMetricRanges[metricKey as keyof typeof defaultMetricRanges]
      if (defaultRange) {
        return defaultRange
      }
      // Fallback defaults for different metric types
      if (metricKey === "spend" || metricKey === "sales") {
        return { min: 0, max: 1000 }
      } else if (metricKey === "impressions") {
        return { min: 0, max: 10000 }
      } else {
        return { min: 0, max: 100 }
      }
    }

    // Check if we have a predefined range and if the data exceeds it
    const defaultRange = defaultMetricRanges[metricKey as keyof typeof defaultMetricRanges]
    if (defaultRange && max <= defaultRange.max) {
      // Use predefined range only if data fits within it
      return defaultRange
    }

    // Add padding (10% above the max)
    max = max * 1.1

    // Round to a "nice" number for the max
    // For large numbers (>1000), round to nearest 1000, 5000, 10000, etc.
    if (max > 100000) {
      max = Math.ceil(max / 50000) * 50000
    } else if (max > 10000) {
      max = Math.ceil(max / 10000) * 10000
    } else if (max > 1000) {
      max = Math.ceil(max / 1000) * 1000
    } else if (max > 100) {
      max = Math.ceil(max / 100) * 100
    } else if (max > 10) {
      max = Math.ceil(max / 10) * 10
    } else {
      max = Math.ceil(max)
    }

    return { min, max }
  }

  // Calculate which data point is closest to mouse position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!chartContainerRef.current || filteredData.length === 0) return

      const chartRect = chartContainerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - chartRect.left
      const columnWidth = chartRect.width / filteredData.length

      // Calculate which data point is closest to the mouse
      const dataIndex = Math.min(Math.max(0, Math.floor(mouseX / columnWidth)), filteredData.length - 1)

      // Position tooltip directly above the data point, not following the mouse
      const pointX = dataIndex * columnWidth + columnWidth / 2

      setTooltip({
        visible: true,
        x: pointX,
        y: 0,
        dataIndex,
      })
    },
    [filteredData.length],
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  // Add this function before the return statement
  const drawChart = useCallback(() => {
    if (!canvasRef.current || !chartContainerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the container's dimensions for proper scaling
    const rect = chartContainerRef.current.getBoundingClientRect()

    // Clear canvas (using CSS dimensions to account for device pixel ratio)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate column width to center dots on date columns
    const columnWidth = rect.width / filteredData.length

    // Get active metrics
    const activeMetricsList = activeMetrics.filter((m) => m.active)

    // First draw the bars
    const activeBarMetrics = activeMetricsList.filter((m) => m.chartType === "bar")
    const barWidth = (columnWidth / (activeBarMetrics.length + 1)) * 0.8 // Leave some space between bars

    activeBarMetrics.forEach((metric, metricIndex) => {
      const range = getMetricRange(metric.key)

      filteredData.forEach((item, dataIndex) => {
        const value = item[metric.key as keyof typeof item] as number
        // Scale the value based on this metric's range
        const barHeight = ((value - range.min) / (range.max - range.min)) * rect.height * 0.8 // 80% of chart height max

        // Calculate x position to center the group of bars
        const barGroupOffset = columnWidth / 2 - (activeBarMetrics.length * barWidth) / 2
        const x = dataIndex * columnWidth + barGroupOffset + metricIndex * barWidth

        // Draw bar
        ctx.fillStyle = metric.color
        ctx.globalAlpha = 0.7 // Semi-transparent bars
        ctx.fillRect(x, rect.height - barHeight, barWidth, barHeight)
        ctx.globalAlpha = 1.0
      })
    })

    // Then draw the lines (so they appear on top of bars)
    activeMetricsList
      .filter((m) => m.chartType === "line")
      .forEach((metric) => {
        const range = getMetricRange(metric.key)

        // Create points array for the line
        const points = filteredData.map((item, i) => {
          // Center the x position on each date column
          const x = i * columnWidth + columnWidth / 2

          // Special handling for ACOS
          if (metric.key === 'acos') {
            if (item.acosIsInfinite) {
              // Place at the top of the range for infinite values
              const y = rect.height - (1 * rect.height * 0.8) // At 100% of chart height
              return { x, y, isInfinite: true }
            } else if (item.acos === null) {
              return { x, y: 0, isNull: true }
            }
          }

          // Scale the value based on this metric's range
          const value = item[metric.key as keyof typeof item] as number
          const y = rect.height - ((value - range.min) / (range.max - range.min)) * rect.height * 0.8

          return { x, y, isInfinite: false, isNull: false }
        })

        // Set up clipping region to prevent drawing outside chart area
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, rect.width, rect.height)
        ctx.clip()

        // Draw smooth curved line
        ctx.beginPath()
        ctx.strokeStyle = metric.color
        ctx.lineWidth = 3

        // Draw curved line using bezier curves, handling null/infinite values
        if (points.length > 0) {
          let isDrawing = false
          
          for (let i = 0; i < points.length; i++) {
            const point = points[i]
            
            // Skip null values
            if (point.isNull) {
              if (isDrawing) {
                ctx.stroke()
                isDrawing = false
              }
              continue
            }
            
            // Start new path segment if needed
            if (!isDrawing) {
              ctx.beginPath()
              ctx.moveTo(point.x, point.y)
              isDrawing = true
            } else if (i < points.length - 1) {
              const nextPoint = points[i + 1]
              
              if (!nextPoint.isNull) {
                // Draw line segment
                if (metric.key === 'acos' && (point.isInfinite || nextPoint.isInfinite)) {
                  // Use solid line for infinite values (no special line style)
                  ctx.lineTo(nextPoint.x, nextPoint.y)
                } else {
                  // Normal curve
                  const controlPointX1 = point.x + (nextPoint.x - point.x) / 2
                  const controlPointX2 = nextPoint.x - (nextPoint.x - point.x) / 2
                  ctx.bezierCurveTo(controlPointX1, point.y, controlPointX2, nextPoint.y, nextPoint.x, nextPoint.y)
                }
              }
            }
          }
          
          if (isDrawing) {
            ctx.stroke()
          }
        }

        // Draw data points
        points.forEach((point, index) => {
          // Skip null values
          if (point.isNull) return
          
          // Highlight the dot if it's the currently hovered data point
          const isHovered = tooltip.visible && tooltip.dataIndex === index
          const dotRadius = isHovered ? 7 : 6
          const innerDotRadius = isHovered ? 6 : 5

          // Special marker for infinite ACOS values
          if (metric.key === 'acos' && point.isInfinite) {
            // Draw a warning triangle or special symbol
            ctx.save()
            ctx.fillStyle = metric.color
            ctx.font = 'bold 14px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText('∞', point.x, point.y - 10)
            
            // Still draw a point but make it distinct
            ctx.beginPath()
            ctx.strokeStyle = metric.color
            ctx.lineWidth = 2
            ctx.arc(point.x, point.y, dotRadius, 0, 2 * Math.PI)
            ctx.stroke()
            
            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.arc(point.x, point.y, innerDotRadius - 1, 0, 2 * Math.PI)
            ctx.fill()
            
            ctx.restore()
          } else {
            // Normal data point
            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.arc(point.x, point.y, dotRadius, 0, 2 * Math.PI)
            ctx.fill()

            ctx.beginPath()
            ctx.fillStyle = metric.color
            ctx.arc(point.x, point.y, innerDotRadius, 0, 2 * Math.PI)
            ctx.fill()
          }
        })

        ctx.restore()
      })
  }, [filteredData, tooltip.visible, tooltip.dataIndex, activeMetrics])

  // Format value based on metric type
  const formatValue = (value: number | null | undefined, metricKey: string): string => {
    // Handle null/undefined values gracefully
    if (value === null || value === undefined) {
      // Return appropriate default display for different metric types
      if (metricKey === "acos" || metricKey === "ctr" || metricKey === "cvr") {
        return "N/A"
      } else if (metricKey === "spend" || metricKey === "sales" || metricKey === "cpc" || metricKey === "rpc") {
        return "$0.00"
      } else if (metricKey === "roas") {
        return "0.0"
      } else {
        return "0"
      }
    }
    
    // Ensure value is a number
    const numValue = typeof value === 'number' ? value : parseFloat(String(value))
    if (isNaN(numValue)) {
      return "N/A"
    }
    
    if (metricKey === "acos" || metricKey === "ctr" || metricKey === "cvr") {
      // Format percentages with appropriate precision
      return numValue < 10 ? `${numValue.toFixed(1)}%` : `${Math.round(numValue)}%`
    } else if (metricKey === "spend" || metricKey === "sales") {
      // Format dollar values with K for thousands, always show 2 decimal places
      return numValue >= 1000 ? `$${(numValue / 1000).toFixed(1)}K` : `$${numValue.toFixed(2)}`
    } else if (metricKey === "cpc" || metricKey === "rpc") {
      // Format small dollar values
      return `$${numValue.toFixed(2)}`
    } else if (metricKey === "roas") {
      return numValue.toFixed(1)
    } else if (metricKey === "impressions") {
      // Format large numbers with K
      return numValue >= 1000 ? `${(numValue / 1000).toFixed(0)}K` : numValue.toString()
    } else {
      // Format other values
      return numValue.toString()
    }
  }

  // Get active metrics for rendering axes
  const activeMetricsList = activeMetrics.filter((m) => m.active)

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
          {activeMetricsList.map((metric) => (
            <div key={metric.key} className="flex items-center gap-1">
              <div
                className={`h-3 w-3 ${metric.chartType === "bar" ? "rounded-sm" : "rounded-full"}`}
                style={{ backgroundColor: metric.color }}
              ></div>
              <span className="text-sm">{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="relative h-[350px] w-full bg-white rounded-md overflow-hidden">
          {/* Y-axis labels - dynamically positioned for each active metric */}
          {activeMetricsList.map((metric, index) => {
            const range = getMetricRange(metric.key)
            const position = index % 2 === 0 ? "left" : "right"
            const offset = Math.floor(index / 2) * 40 // Offset for multiple axes on same side

            return (
              <div
                key={metric.key}
                className={`absolute top-0 ${position}-0 h-full flex flex-col justify-between text-xs pt-2 pb-8`}
                style={{
                  color: metric.color,
                  [position]: `${offset}px`,
                  fontWeight: 500,
                  width: "40px",
                  textAlign: position === "left" ? "right" : "left",
                  paddingLeft: position === "right" ? "8px" : "0px",
                  paddingRight: position === "left" ? "8px" : "0px",
                }}
              >
                <div>{formatValue(range.max, metric.key)}</div>
                <div>{formatValue((range.max + range.min) / 2, metric.key)}</div>
                <div>{formatValue(range.min, metric.key)}</div>
              </div>
            )
          })}

          {/* Grid lines - adjust left and right margins to accommodate axes */}
          <div className="absolute top-0 left-[80px] right-[80px] h-full">
            <div className="h-1/3 border-b border-dashed border-gray-200"></div>
            <div className="h-1/3 border-b border-dashed border-gray-200"></div>
            <div className="h-1/3 border-b border-dashed border-gray-200"></div>
          </div>

          {/* Chart content area - adjust left and right margins to accommodate axes */}
          <div
            ref={chartContainerRef}
            className="absolute top-0 left-[80px] right-[80px] bottom-8 flex items-end"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {filteredData.map((item, index) => {
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Individual bar tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-md border text-xs z-10 w-36">
                      <div className="font-medium">{item.date}</div>
                      {activeMetricsList.map((metric) => (
                        <div key={metric.key} style={{ color: metric.color }}>
                          {metric.label}: {
                            metric.key === 'acos' && item.acosIsInfinite
                              ? '∞ (No Sales)'
                              : formatValue(item[metric.key as keyof typeof item] as number, metric.key)
                          }
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Chart canvas */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

            {/* Chart area tooltip */}
            {tooltip.visible &&
              filteredData.length > 0 &&
              tooltip.dataIndex >= 0 &&
              tooltip.dataIndex < filteredData.length && (
                <div
                  className="absolute bg-white p-3 rounded-md shadow-lg border border-gray-200 z-20 w-[180px] transition-opacity duration-150"
                  style={{
                    left: `${tooltip.x}px`,
                    top: "20px",
                    transform: "translate(-50%, 0)",
                    pointerEvents: "none",
                    opacity: "0.98",
                  }}
                >
                  <div className="font-medium text-sm mb-2 border-b pb-1">{filteredData[tooltip.dataIndex].date}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {activeMetricsList.map((metric) => (
                      <React.Fragment key={metric.key}>
                        <div style={{ color: metric.color }} className="font-medium">
                          {metric.label}:
                        </div>
                        <div className="text-right">
                          {metric.key === 'acos' && filteredData[tooltip.dataIndex].acosIsInfinite
                            ? <span className="font-bold">∞ (No Sales)</span>
                            : formatValue(
                                filteredData[tooltip.dataIndex][metric.key as keyof (typeof filteredData)[0]] as number,
                                metric.key,
                              )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* X-axis labels - adjust left and right margins to match chart area */}
          <div className="absolute bottom-0 left-[80px] right-[80px] h-8 flex text-xs text-gray-500 overflow-hidden">
            {filteredData.map((item, index) => {
              // Only show every 3rd label when there are many data points to avoid overcrowding
              const showLabel = filteredData.length <= 14 || index % 3 === 0

              return (
                <div key={index} className="flex-1 text-center truncate">
                  {showLabel ? item.date : ""}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
