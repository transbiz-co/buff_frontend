"use client"

import { useMemo } from "react"

interface TinyAreaChartProps {
  data: number[]
  color: string
  height?: number
  strokeWidth?: number
  fillOpacity?: number
}

export function TinyAreaChart({ data, color, height = 40, strokeWidth = 1.5, fillOpacity = 0.2 }: TinyAreaChartProps) {
  // Calculate points for the SVG path
  const points = useMemo(() => {
    if (!data || data.length === 0) return ""

    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue || 1

    // Create normalized points for the path
    const normalizedPoints = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - minValue) / range) * 100
      return `${x},${y}`
    })

    return normalizedPoints.join(" ")
  }, [data])

  // Create the area path (line + bottom enclosure)
  const areaPath = useMemo(() => {
    if (!points) return ""

    // Start with the line path
    let path = `M0,${100 - ((data[0] - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 100}`

    // Add line segments
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data) || 1)) * 100
      path += ` L${x},${y}`
    })

    // Add bottom enclosure
    path += ` L100,100 L0,100 Z`

    return path
  }, [data, points])

  if (!data || data.length === 0) {
    return <div className="h-10 w-full bg-gray-100 rounded" />
  }

  return (
    <div className="h-10 w-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Area fill */}
        <path d={areaPath} fill={color} fillOpacity={fillOpacity} />

        {/* Line on top */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
