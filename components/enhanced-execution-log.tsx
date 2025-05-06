"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  RefreshCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react"
import type { ExecutionLog } from "@/lib/types"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ExecutionLogTableProps {
  logs: ExecutionLog[]
}

export function EnhancedExecutionLog({ logs }: ExecutionLogTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ExecutionLog | null
    direction: "asc" | "desc"
  }>({ key: "date", direction: "desc" })

  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "status",
    "campaign",
    "clicks",
    "impressions",
    "spend",
    "sales",
    "acos",
    "date",
    "action",
    "revert",
  ])

  const [statusFilter, setStatusFilter] = useState<string[]>(["approved", "ignored", "reverted"])

  const handleSort = (key: keyof ExecutionLog) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleToggleColumn = (column: string) => {
    setVisibleColumns((prev) => (prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]))
  }

  const handleToggleStatusFilter = (status: string) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const handleRevert = (logId: string) => {
    toast.success("Action reverted successfully")
  }

  const filteredLogs = logs.filter((log) => statusFilter.includes(log.status))

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortConfig.key) return 0

    if (sortConfig.key === "campaign" || sortConfig.key === "date" || sortConfig.key === "status") {
      return sortConfig.direction === "asc"
        ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
        : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]))
    } else {
      const aValue = a[sortConfig.key] as number
      const bValue = b[sortConfig.key] as number

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  return (
    <div className="buff-section">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Task Execution Log</h2>
        <p className="text-muted-foreground">View the history of all executed tasks and their outcomes.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("approved")}
                onCheckedChange={() => handleToggleStatusFilter("approved")}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("ignored")}
                onCheckedChange={() => handleToggleStatusFilter("ignored")}
              >
                Ignored
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("reverted")}
                onCheckedChange={() => handleToggleStatusFilter("reverted")}
              >
                Reverted
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown size={14} />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={sortConfig.key === "date"} onClick={() => handleSort("date")}>
                Date{" "}
                {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "(Oldest first)" : "(Newest first)")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortConfig.key === "spend"} onClick={() => handleSort("spend")}>
                Spend{" "}
                {sortConfig.key === "spend" && (sortConfig.direction === "asc" ? "(Low to High)" : "(High to Low)")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={sortConfig.key === "acos"} onClick={() => handleSort("acos")}>
                ACoS {sortConfig.key === "acos" && (sortConfig.direction === "asc" ? "(Low to High)" : "(High to Low)")}
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
              checked={visibleColumns.includes("status")}
              onCheckedChange={() => handleToggleColumn("status")}
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("campaign")}
              onCheckedChange={() => handleToggleColumn("campaign")}
            >
              Campaign
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("clicks")}
              onCheckedChange={() => handleToggleColumn("clicks")}
            >
              Clicks
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("impressions")}
              onCheckedChange={() => handleToggleColumn("impressions")}
            >
              Impressions
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
              checked={visibleColumns.includes("acos")}
              onCheckedChange={() => handleToggleColumn("acos")}
            >
              ACoS
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={visibleColumns.includes("date")}
              onCheckedChange={() => handleToggleColumn("date")}
            >
              Date
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {visibleColumns.includes("status") && <TableHead className="font-medium">Status</TableHead>}
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
              {visibleColumns.includes("date") && (
                <TableHead className="font-medium" onClick={() => handleSort("date")}>
                  <div className="flex items-center cursor-pointer hover:text-foreground">
                    Date
                    {sortConfig.key === "date" &&
                      (sortConfig.direction === "asc" ? (
                        <SortAsc className="ml-1 h-4 w-4" />
                      ) : (
                        <SortDesc className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              )}
              {visibleColumns.includes("action") && <TableHead className="font-medium">Action Taken</TableHead>}
              {visibleColumns.includes("revert") && <TableHead className="font-medium text-right">Revert</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.map((log) => (
              <TableRow key={log.id} className="group">
                {visibleColumns.includes("status") && (
                  <TableCell>
                    {log.status === "approved" && (
                      <Badge variant="success" className="flex items-center gap-1 w-fit">
                        <CheckCircle size={12} />
                        <span>Approved</span>
                      </Badge>
                    )}
                    {log.status === "ignored" && (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <XCircle size={12} />
                        <span>Ignored</span>
                      </Badge>
                    )}
                    {log.status === "reverted" && (
                      <Badge variant="warning" className="flex items-center gap-1 w-fit">
                        <AlertCircle size={12} />
                        <span>Reverted</span>
                      </Badge>
                    )}
                  </TableCell>
                )}
                {visibleColumns.includes("campaign") && (
                  <TableCell className="max-w-[300px] truncate font-medium">{log.campaign}</TableCell>
                )}
                {visibleColumns.includes("clicks") && <TableCell>{log.clicks.toLocaleString()}</TableCell>}
                {visibleColumns.includes("impressions") && <TableCell>{log.impressions.toLocaleString()}</TableCell>}
                {visibleColumns.includes("spend") && (
                  <TableCell className="font-medium">${log.spend.toFixed(2)}</TableCell>
                )}
                {visibleColumns.includes("sales") && (
                  <TableCell className="font-medium">${log.sales.toFixed(2)}</TableCell>
                )}
                {visibleColumns.includes("acos") && (
                  <TableCell>
                    <Badge variant={log.acos > 50 ? "destructive" : "outline"}>{log.acos}%</Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("date") && <TableCell>{log.date}</TableCell>}
                {visibleColumns.includes("action") && (
                  <TableCell>
                    <Badge variant="outline">Campaign Paused</Badge>
                  </TableCell>
                )}
                {visibleColumns.includes("revert") && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRevert(log.id)}
                      disabled={log.status === "reverted"}
                    >
                      <RefreshCcw size={16} />
                    </Button>
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
