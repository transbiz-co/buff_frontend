import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockStrategies, mockTasks } from "@/lib/mock-data"

export default function StrategyPage({ params }: { params: { id: string } }) {
  const strategyId = params.id

  // Find the strategy from mock data
  const strategy = mockStrategies.find((s) => s.id === strategyId) || {
    id: strategyId,
    name: "Unknown Strategy",
    description: "Strategy details not found",
    objective: "Unknown Objective",
    taskCount: 0,
    estimatedSavings: "$0",
  }

  // Filter tasks for this strategy
  const strategyTasks = mockTasks.filter((task) => task.strategyId === strategyId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{strategy.name}</h1>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Objective: <span className="font-medium">{strategy.objective}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estimated Savings</p>
          <p className="text-2xl font-bold text-green-600">{strategy.estimatedSavings}</p>
        </div>
      </div>

      <div className="mt-8">
        <TaskList tasks={strategyTasks} />
      </div>
    </div>
  )
}
