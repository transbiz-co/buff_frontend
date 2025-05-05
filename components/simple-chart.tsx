"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SimpleChartProps {
  title: string
  className?: string
}

export function SimpleChart({ title, className }: SimpleChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create a simple canvas-based chart that doesn't rely on Recharts
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md relative overflow-hidden">
          {!isMounted ? (
            <div className="text-muted-foreground">Loading chart...</div>
          ) : (
            <>
              {/* Simple static chart visualization */}
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="h-[60%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[40%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[70%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[90%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[50%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[80%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[65%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
                <div className="h-[75%] w-[10%] bg-primary/60 mx-[0.5%] rounded-t-sm"></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg width="100%" height="100%" className="text-primary/80">
                  <path
                    d="M0,150 C50,120 100,180 150,100 C200,20 250,80 300,60 C350,40 400,90 450,70 C500,50 550,110 600,90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-sm">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary/60"></div>
            <span className="text-sm">Spend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-primary rounded-full"></div>
            <span className="text-sm">ACOS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
