import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface RulesCriteriaProps {
  strategyId: string
  strategyName: string
  strategyDescription: string
}

export function EnhancedRulesCriteria({ strategyId, strategyName, strategyDescription }: RulesCriteriaProps) {
  return (
    <div className="buff-section">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Strategy Rules & Criteria</h2>
        <p className="text-muted-foreground">
          These rules determine how the AI identifies opportunities for optimization.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>
          <CardTitle>Rules & Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p>
              Retrieve the performance data for each active campaign. Use the most recent 7-day period to evaluate
              current performance.
            </p>
            <p>
              For each campaign, calculate the 30-day historical average for key performance metrics. This historical
              data serves as the baseline for comparison.
            </p>
            <p>
              Compare current 7-day metrics against the 30-day historical averages, focusing on three core performance
              indicators: number of orders, conversion rate, and ACOS (Advertising Cost of Sales).
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">
              Recommend a campaign to be paused only if all of the following conditions are met:
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    The number of orders in the last 7 days is <span className="font-bold">less than 2</span>.
                  </h4>
                  <p className="text-muted-foreground">
                    This indicates the campaign is contributing very little in terms of sales volume.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    The conversion rate has decreased by <span className="font-bold">at least 30%</span> compared to the
                    30-day average.
                  </h4>
                  <p className="text-muted-foreground">
                    This suggests the campaign is attracting less qualified traffic than before.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    The ACOS has increased by <span className="font-bold">at least 40%</span> compared to the 30-day
                    average.
                  </h4>
                  <p className="text-muted-foreground">
                    This means the cost per sale has risen sharply, making the campaign less profitable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
