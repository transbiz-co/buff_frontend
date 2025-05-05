"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Info, CheckCircle, XCircle, Filter, SortAsc, SortDesc, ChevronDown } from "lucide-react"
import type { Task } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface TaskListProps {
  tasks: Task[]
}

export function EnhancedTaskList({ tasks }: TaskListProps) {
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
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task["metrics"] | "campaign"
    direction: "asc" | "desc"
  }>({ key: "acos", direction: "desc" })
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "campaign",
    "impressions",
    "clicks",
    "ctr",
    "spend",
    "sales",
    "orders",
    "acos",
    "action",
    "approval",
  ])

  // Extract strategy ID from the first task (assuming all tasks have the same strategy ID)
  const strategyId = tasks.length > 0 ? tasks[0].strategyId : ""

  const handleApprove = (taskId: string) => {
    setTaskStates((prev) => ({ ...prev, [taskId]: "approved" }))
    toast.success("Task approved successfully")
  }

  const handleIgnore = (taskId: string) => {
    setTaskStates((prev) => ({ ...prev, [taskId]: "ignored" }))
    toast.info("Task ignored")
  }

  const handleBatchApprove = () => {
    if (selectedTasks.length === 0) return

    const newTaskStates = { ...taskStates }
    selectedTasks.forEach((taskId) => {
      newTaskStates[taskId] = "approved"
    })

    setTaskStates(newTaskStates)
    setSelectedTasks([])
    toast.success(`${selectedTasks.length} tasks approved successfully`)
  }

  const handleBatchIgnore = () => {
    if (selectedTasks.length === 0) return

    const newTaskStates = { ...taskStates }
    selectedTasks.forEach((taskId) => {
      newTaskStates[taskId] = "ignored"
    })

    setTaskStates(newTaskStates)
    setSelectedTasks([])
    toast.info(`${selectedTasks.length} tasks ignored`)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map((task) => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks((prev) => [...prev, taskId])
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId))
    }
  }

  const handleSort = (key: keyof Task["metrics"] | "campaign") => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleToggleColumn = (column: string) => {
    setVisibleColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortConfig.key === "campaign") {
      return sortConfig.direction === "asc"
        ? a.campaign.localeCompare(b.campaign)
        : b.campaign.localeCompare(a.campaign)
    } else {
      const aValue = a.metrics[sortConfig.key]
      const bValue = b.metrics[sortConfig.key]

      return sortConfig.direction === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1
    }
  })

  return (
    <div className="buff-section">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Recommended Tasks</h2>
        <p className="text-muted-foreground">Review and approve AI-recommended optimization actions.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedTasks.length > 0 && (
            <>
              <span className="text-sm font-medium">{selectedTasks.length} selected</span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-success-600 border-success-200 hover:bg-success-50"
                onClick={handleBatchApprove}
              >
                <CheckCircle size={14} />
                <span>Approve Selected</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive border-red-200 hover:bg-red-50"
                onClick={handleBatchIgnore}
              >
                <XCircle size={14} />
                <span>Ignore Selected</span>
              </Button>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={14} />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Approved</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Ignored</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <SortAsc size={14} />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={sortConfig.key === "acos"} onClick={() => handleSort("acos")}>
                ACoS {sortConfig.key === "acos" && (sortConfig.direction === "asc" ? "(Low to High)" : "(High to Low)")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortConfig.key === "spend"} onClick={() => handleSort("spend")}>
                Spend{" "}
                {sortConfig.key === "spend" && (sortConfig.direction === "asc" ? "(Low to High)" : "(High to Low)")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortConfig.key === "sales"} onClick={() => handleSort("sales")}>
                Sales{" "}
                {sortConfig.key === "sales" && (sortConfig.direction === "asc" ? "(Low to High)" : "(High to Low)")}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronDown size={14} />
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("campaign")}
              onCheckedChange={() => handleToggleColumn("campaign")}
            >
              Campaign
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("impressions")}
              onCheckedChange={() => handleToggleColumn("impressions")}
            >
              Impressions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("clicks")}
              onCheckedChange={() => handleToggleColumn("clicks")}
            >
              Clicks
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("ctr")}
              onCheckedChange={() => handleToggleColumn("ctr")}
            >
              CTR
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("spend")}
              onCheckedChange={() => handleToggleColumn("spend")}
            >
              Spend
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("sales")}
              onCheckedChange={() => handleToggleColumn("sales")}
            >
              Sales
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("orders")}
              onCheckedChange={() => handleToggleColumn("orders")}
            >
              Orders
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("acos")}
              onCheckedChange={() => handleToggleColumn("acos")}
            >
              ACoS
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all tasks"
                />
              </TableHead>
              {visibleColumns.includes("campaign") && (
                <TableHead className="font-medium" onClick={() => handleSort("campaign")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Campaign
                    {sortConfig.key === "campaign" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("impressions") && (
                <TableHead className="font-medium" onClick={() => handleSort("impressions")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Impressions
                    {sortConfig.key === "impressions" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("clicks") && (
                <TableHead className="font-medium" onClick={() => handleSort("clicks")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Clicks
                    {sortConfig.key === "clicks" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("ctr") && (
                <TableHead className="font-medium" onClick={() => handleSort("ctr")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    CTR
                    {sortConfig.key === "ctr" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("spend") && (
                <TableHead className="font-medium" onClick={() => handleSort("spend")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Spend
                    {sortConfig.key === "spend" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("sales") && (
                <TableHead className="font-medium" onClick={() => handleSort("sales")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Sales
                    {sortConfig.key === "sales" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("orders") && (
                <TableHead className="font-medium" onClick={() => handleSort("orders")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Orders
                    {sortConfig.key === "orders" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("acos") && (
                <TableHead className="font-medium" onClick={() => handleSort("acos")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    ACoS
                    {sortConfig.key === "acos" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("action") && <TableHead className="font-medium">Action</TableHead>}
              {visibleColumns.includes("approval") && (
                <TableHead className="font-medium text-right">Approval</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow key={task.id} className="group">
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={(checked) => handleSelectTask(task.id, !!checked)}
                    aria-label={`Select ${task.campaign}`}
                  />
                </TableCell>
                {visibleColumns.includes("campaign") && (
                  <TableCell className="max-w-[300px] truncate font-medium">{task.campaign}</TableCell>
                )}
                {visibleColumns.includes("impressions") && (
                  <TableCell>{task.metrics.impressions.toLocaleString()}</TableCell>
                )}
                {visibleColumns.includes("clicks") && <TableCell>{task.metrics.clicks.toLocaleString()}</TableCell>}
                {visibleColumns.includes("ctr") && <TableCell>{task.metrics.ctr}%</TableCell>}
                {visibleColumns.includes("spend") && (
                  <TableCell className="font-medium">${task.metrics.spend.toFixed(2)}</TableCell>
                )}
                {visibleColumns.includes("sales") && (
                  <TableCell className="font-medium">${task.metrics.sales.toFixed(2)}</TableCell>
                )}
                {visibleColumns.includes("orders") && <TableCell>{task.metrics.orders}</TableCell>}
                {visibleColumns.includes("acos") && (
                  <TableCell>
                    <Badge variant={task.metrics.acos > 50 ? "destructive" : "outline"}>{task.metrics.acos}%</Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("action") && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Pause Campaign</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Info size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
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
                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-md bg-muted/50 p-2">
                                  <div className="text-xs text-muted-foreground">Spend</div>
                                  <div className="font-medium">${task.metrics.spend.toFixed(2)}</div>
                                </div>
                                <div className="rounded-md bg-muted/50 p-2">
                                  <div className="text-xs text-muted-foreground">Sales</div>
                                  <div className="font-medium">${task.metrics.sales.toFixed(2)}</div>
                                </div>
                                <div className="rounded-md bg-muted/50 p-2">
                                  <div className="text-xs text-muted-foreground">ACoS</div>
                                  <div className="font-medium">{task.metrics.acos}%</div>
                                </div>
                                <div className="rounded-md bg-muted/50 p-2">
                                  <div className="text-xs text-muted-foreground">Orders</div>
                                  <div className="font-medium">{task.metrics.orders}</div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Expected Outcome:</h4>
                              <p className="text-sm text-muted-foreground">{task.expectedOutcome}</p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => handleIgnore(task.id)}>
                              Ignore
                            </Button>
                            <Button onClick={() => handleApprove(task.id)}>Approve</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.includes("approval") && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant={taskStates[task.id] === "approved" ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${taskStates[task.id] === "approved" ? "bg-success hover:bg-success-600" : "text-success hover:text-success-600"}`}
                        onClick={() => handleApprove(task.id)}
                      >
                        <CheckCircle size={16} />
                      </Button>
                      <Button
                        variant={taskStates[task.id] === "ignored" ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${taskStates[task.id] === "ignored" ? "bg-destructive hover:bg-destructive/90" : "text-destructive hover:text-destructive/90"}`}
                        onClick={() => handleIgnore(task.id)}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Import this component
import { Separator } from "@/components/ui/separator"
