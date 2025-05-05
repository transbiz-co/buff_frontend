"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface MiniTrendChartProps {
  data: number[]
  color: string
}

export function MiniTrendChart({ data, color }: MiniTrendChartProps) {
  // Convert the array of numbers to the format required by recharts
  const chartData = data.map((value, index) => ({ value }))

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
