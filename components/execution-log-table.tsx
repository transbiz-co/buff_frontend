"use client"

import { Button } from "@/components/ui/button"
import { RefreshCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { ExecutionLog } from "@/lib/types"

interface ExecutionLogTableProps {
  logs: ExecutionLog[]
}

export function ExecutionLogTable({ logs }: ExecutionLogTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACoS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Taken
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revert</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  {log.status === "approved" && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Approved</span>
                    </div>
                  )}
                  {log.status === "ignored" && (
                    <div className="flex items-center text-red-600">
                      <XCircle size={16} className="mr-1" />
                      <span>Ignored</span>
                    </div>
                  )}
                  {log.status === "reverted" && (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle size={16} className="mr-1" />
                      <span>Reverted</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-[300px] truncate">{log.campaign}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.clicks.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.impressions.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900">${log.spend.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">${log.sales.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.acos}%</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">Campaign Paused</td>
                <td className="px-4 py-3 text-sm">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RefreshCcw size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
