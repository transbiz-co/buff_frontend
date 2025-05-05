import { StrategyList } from "@/components/strategy-list"
import { mockStrategies } from "@/lib/mock-data"
import { MetricCard } from "@/components/ui/metric-card"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function ReduceAdWastePage() {
  // Calculate metrics
  const totalStrategies = mockStrategies.length
  const totalTasks = mockStrategies.reduce((acc, strategy) => acc + strategy.pendingTasks, 0)
  const totalSavings = mockStrategies.reduce((acc, strategy) => acc + strategy.estimatedSavings, 0)

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Breadcrumb segments={[{ name: "Objectives" }, { name: "Reduce Ad Waste" }]} />
        <h1 className="text-2xl font-bold mt-4 mb-2">Reduce Ad Waste</h1>
        <p className="text-muted-foreground">
          Identify and eliminate inefficient ad spend to improve your ACOS and profitability
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard title="Active Strategies" value={totalStrategies} description="Optimization strategies" />
        <MetricCard
          title="Pending Tasks"
          value={totalTasks}
          description="Awaiting review"
          trend={{
            value: 2,
            isPositive: true,
            label: "from yesterday",
          }}
        />
        <MetricCard
          title="Approved Tasks"
          value={8}
          description="Successfully implemented"
          trend={{
            value: 4,
            isPositive: true,
            label: "from last week",
          }}
        />
        <MetricCard
          title="Estimated Savings"
          value={`$${totalSavings.toFixed(2)}`}
          description="Monthly savings"
          helpText="Projected monthly savings based on approved tasks"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Strategies</h2>
        <p className="text-muted-foreground">Select a strategy to review and approve AI-recommended optimizations</p>
      </div>

      <StrategyList strategies={mockStrategies} />
    </div>
  )
}
