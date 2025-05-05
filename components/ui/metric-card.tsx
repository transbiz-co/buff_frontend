import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TooltipHelp } from "@/components/ui/tooltip-help"
import type { LucideIcon } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon // Keep this for backward compatibility
  trend?: {
    value: string | number
    isPositive: boolean
    label?: string
  }
  helpText?: string
  className?: string
}

export function MetricCard({ title, value, description, trend, helpText, className }: MetricCardProps) {
  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            {title}
            {helpText && <TooltipHelp content={helpText} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className={trend.isPositive ? "text-success-600 font-medium" : "text-destructive font-medium"}>
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </span>
              {trend.label && ` ${trend.label}`}
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
