"use client"

interface MiniTrendChartFallbackProps {
  data: number[]
  color: string
}

export function MiniTrendChartFallback({ data, color }: MiniTrendChartFallbackProps) {
  // Create a simple SVG line chart
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  // Create points for the SVG path
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - minValue) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="h-10 w-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  )
}
