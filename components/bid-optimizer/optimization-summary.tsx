import { Card, CardContent } from "@/components/ui/card"
import { InfoCircle } from "@/components/icons/info-circle"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"

interface OptimizationSummaryProps {
  summary: {
    totalChanges: number
    estimatedImpact: {
      acos: {
        value: number
        percentage: number
      }
      spend: {
        value: number
        percentage: number
      }
    }
  }
}

export function OptimizationSummary({ summary }: OptimizationSummaryProps) {
  const { totalChanges, estimatedImpact } = summary

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                Total Changes
                <Tooltip content="The number of bid changes that will be submitted to Amazon">
                  <InfoCircle className="h-4 w-4" />
                </Tooltip>
              </div>
              <div className="text-2xl font-bold">{totalChanges}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                Estimated ACOS Impact
                <Tooltip content="The estimated change in ACOS after applying these optimizations">
                  <InfoCircle className="h-4 w-4" />
                </Tooltip>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold">
                  {estimatedImpact.acos.value > 0 ? "+" : ""}
                  {estimatedImpact.acos.value.toFixed(2)}%
                </div>
                <div className={`text-xs ${estimatedImpact.acos.percentage < 0 ? "text-green-500" : "text-red-500"}`}>
                  {estimatedImpact.acos.percentage > 0 ? "+" : ""}
                  {estimatedImpact.acos.percentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                Estimated Spend Impact
                <Tooltip content="The estimated change in daily spend after applying these optimizations">
                  <InfoCircle className="h-4 w-4" />
                </Tooltip>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold">${Math.abs(estimatedImpact.spend.value).toFixed(2)}</div>
                <div className={`text-xs ${estimatedImpact.spend.percentage < 0 ? "text-green-500" : "text-red-500"}`}>
                  {estimatedImpact.spend.percentage > 0 ? "+" : ""}
                  {estimatedImpact.spend.percentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
