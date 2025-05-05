"use client"
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

// Sample data for the performance chart
const performanceData = [
  { date: "Mar 6", spend: 1400, sales: 3600, acos: 38.9 },
  { date: "Mar 7", spend: 1063, sales: 1925, acos: 55.2 },
  { date: "Mar 8", spend: 850, sales: 1800, acos: 47.2 },
  { date: "Mar 9", spend: 950, sales: 4200, acos: 22.6 },
  { date: "Mar 10", spend: 600, sales: 1000, acos: 60.0 },
  { date: "Mar 11", spend: 1050, sales: 2200, acos: 47.7 },
  { date: "Mar 12", spend: 1200, sales: 2400, acos: 50.0 },
  // Add more data as needed
]

export function SimplePerformanceChart() {
  return (
    <Card className="w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Performance Over Time</h3>
          <div className="flex items-center gap-2">
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
        </div>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="spend" fill="#2563EB" />
              <Bar yAxisId="left" dataKey="sales" fill="#10B981" />
              <Line yAxisId="right" type="monotone" dataKey="acos" stroke="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
