"use client"

import { useState } from "react"
import { EnhancedTaskList } from "@/components/enhanced-task-list"
import { EnhancedRulesCriteria } from "@/components/enhanced-rules-criteria"
import { EnhancedExecutionLog } from "@/components/enhanced-execution-log"
import { mockStrategies, mockTasks, mockExecutionLogs } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { MetricCard } from "@/components/ui/metric-card"
import { BarChart2, ClipboardList, History } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from "@/components/protected-route"

export default function StrategyPage({ params }: { params: { id: string } }) {
  const strategyId = params.id
  const [activeTab, setActiveTab] = useState("tasks")

  // Find the strategy from mock data
  const strategy = mockStrategies.find((s) => s.id === strategyId)

  if (!strategy) {
    notFound()
  }

  // Filter tasks for this strategy
  const strategyTasks = mockTasks.filter((task) => task.strategyId === strategyId)

  // Filter logs for this strategy
  const strategyLogs = mockExecutionLogs.filter((log) => log.strategyId === strategyId)

  // Calculate metrics
  const totalTasks = strategyTasks.length
  const approvedTasks = strategyTasks.filter((task) => task.status === "approved").length
  const ignoredTasks = strategyTasks.filter((task) => task.status === "ignored").length
  const pendingTasks = totalTasks - approvedTasks - ignoredTasks

  return (
    <ProtectedRoute>
      <div className="p-6 w-full">
        <div className="mb-6">
          <Breadcrumb
            segments={[
              { name: "Objectives", href: "/" },
              { name: "Reduce Ad Waste", href: "/" },
              { name: strategy.name },
            ]}
          />
          <div className="flex items-center gap-3 mt-4 mb-2">
            <h1 className="text-2xl font-bold">{strategy.name}</h1>
            {pendingTasks > 0 && (
              <Badge variant="default" className="rounded-full px-2.5 py-0.5">
                {pendingTasks} {pendingTasks === 1 ? "task" : "tasks"}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{strategy.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard title="Total Tasks" value={totalTasks} description="In this strategy" />
          <MetricCard title="Pending Tasks" value={pendingTasks} description="Awaiting review" />
          <MetricCard
            title="Approved Tasks"
            value={approvedTasks}
            description="Successfully implemented"
            trend={{
              value: approvedTasks,
              isPositive: true,
              label: "from last week",
            }}
          />
          <MetricCard
            title="Estimated Savings"
            value={`$${strategy.estimatedSavings}`}
            description="Monthly savings"
            helpText="Projected monthly savings based on approved tasks"
          />
        </div>

        <Tabs defaultValue="tasks" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Recommended Tasks</span>
              {pendingTasks > 0 && (
                <Badge variant="outline" className="ml-1 bg-primary/10 text-primary border-primary/20">
                  {pendingTasks}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Strategy Rules</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Execution Log</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-0 border-0 p-0">
            <EnhancedTaskList tasks={strategyTasks} />
          </TabsContent>

          <TabsContent value="rules" className="mt-0 border-0 p-0">
            <EnhancedRulesCriteria
              strategyId={strategyId}
              strategyName={strategy.name}
              strategyDescription={strategy.description}
            />
          </TabsContent>

          <TabsContent value="logs" className="mt-0 border-0 p-0">
            <EnhancedExecutionLog logs={strategyLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
