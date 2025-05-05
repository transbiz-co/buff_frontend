"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Info, RefreshCcw, CheckCircle, XCircle } from "lucide-react"
import type { Task } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter()
  const [taskStates, setTaskStates] = useState<Record<string, "pending" | "approved" | "ignored">>(
    tasks.reduce(
      (acc, task) => {
        acc[task.id] = task.status || "pending"
        return acc
      },
      {} as Record<string, "pending" | "approved" | "ignored">,
    ),
  )

  const handleApprove = (taskId: string) => {
    setTaskStates((prev) => ({ ...prev, [taskId]: "approved" }))
  }

  const handleIgnore = (taskId: string) => {
    setTaskStates((prev) => ({ ...prev, [taskId]: "ignored" }))
  }

  // Extract strategy ID from the first task (assuming all tasks have the same strategy ID)
  const strategyId = tasks.length > 0 ? tasks[0].strategyId : ""

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="flex gap-2">
          <Link href={`/strategy/${strategyId}/rules`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Info size={14} />
              <span>Strategy Rules & Criteria</span>
            </Button>
          </Link>
          <Link href={`/strategy/${strategyId}/log`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCcw size={14} />
              <span>View Execution Log</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">Campaign Performance</div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <RefreshCcw size={14} />
          <span>Reset Columns</span>
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPC</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACoS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Analysis
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-[300px] truncate">{task.campaign}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.metrics.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.metrics.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.metrics.ctr}%</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${task.metrics.spend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${task.metrics.sales.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.metrics.orders}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${task.metrics.ppc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.metrics.acos}%</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Pause Campaign</td>
                  <td className="px-4 py-3 text-sm">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Info size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Analysis</DialogTitle>
                          <DialogDescription>Campaign: {task.campaign}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Recommendation Reason:</h4>
                            <p className="text-sm text-muted-foreground">{task.analysis}</p>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Key Metrics:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>Spend: ${task.metrics.spend.toFixed(2)}</li>
                              <li>Sales: ${task.metrics.sales.toFixed(2)}</li>
                              <li>ACoS: {task.metrics.acos}%</li>
                              <li>CTR: {task.metrics.ctr}%</li>
                              <li>Orders: {task.metrics.orders}</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Expected Outcome:</h4>
                            <p className="text-sm text-muted-foreground">{task.expectedOutcome}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-1">
                      <Button
                        variant={taskStates[task.id] === "approved" ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${taskStates[task.id] === "approved" ? "bg-green-600 hover:bg-green-700" : "text-green-600 hover:text-green-700"}`}
                        onClick={() => handleApprove(task.id)}
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        variant={taskStates[task.id] === "ignored" ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${taskStates[task.id] === "ignored" ? "bg-red-600 hover:bg-red-700" : "text-red-600 hover:text-red-700"}`}
                        onClick={() => handleIgnore(task.id)}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
