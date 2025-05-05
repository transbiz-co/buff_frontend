"use client"

import { useState } from "react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AddConnectionDialog } from "@/components/connections/add-connection-dialog"
import { toast } from "@/components/ui/use-toast"

// Update the connection type definition
interface Connection {
  id: string
  storeName: string
  type: "Amazon Sponsored Ads"
  status: boolean
  marketplace: string
  lastUpdated: string
  isSyncing?: boolean
}

export default function ConnectionsPage() {
  // Update the mock data with new store names and connection types
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      storeName: "Cool Gadgets",
      type: "Amazon Sponsored Ads",
      status: true,
      marketplace: "US",
      lastUpdated: "2025-04-05T14:30:00Z",
      isSyncing: false,
    },
    {
      id: "3",
      storeName: "Happy Pets",
      type: "Amazon Sponsored Ads",
      status: false,
      marketplace: "US",
      lastUpdated: "2025-04-01T08:45:00Z",
      isSyncing: false,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleStatusChange = (id: string, newStatus: boolean) => {
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.id === id) {
          toast.success(`${conn.storeName} connection ${newStatus ? "enabled" : "disabled"}`)
          return { ...conn, status: newStatus }
        }
        return conn
      }),
    )
  }

  const handleAddConnection = (connection: Omit<Connection, "id" | "lastUpdated" | "isSyncing">) => {
    const newConnection: Connection = {
      ...connection,
      id: Math.random().toString(36).substring(2, 9),
      lastUpdated: new Date().toISOString(),
      isSyncing: false,
    }

    setConnections((prev) => [...prev, newConnection])
    toast.success(`${connection.storeName} connection added successfully`)
    setIsAddDialogOpen(false)
  }

  const handleSyncData = (id: string) => {
    // Set the connection to syncing state
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.id === id) {
          return { ...conn, isSyncing: true }
        }
        return conn
      }),
    )

    // Simulate a sync process
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((conn) => {
          if (conn.id === id) {
            const newLastUpdated = new Date().toISOString()
            toast.success(`${conn.storeName} data synced successfully`)
            return {
              ...conn,
              isSyncing: false,
              lastUpdated: newLastUpdated,
            }
          }
          return conn
        }),
      )
    }, 2000)
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Breadcrumb segments={[{ name: "Connections" }]} />
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold">Connections</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Connection
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Manage your connections to Amazon Sponsored Ads for the US marketplace
        </p>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-medium">Store Name</TableHead>
              <TableHead className="font-medium">Type</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Marketplace</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id} className="group">
                <TableCell className="font-medium">{connection.storeName}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      connection.type === "Amazon Sponsored Ads"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }
                  >
                    {connection.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={connection.status}
                    onCheckedChange={(checked) => handleStatusChange(connection.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{connection.marketplace}</Badge>
                </TableCell>
                <TableCell>{formatDate(connection.lastUpdated)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncData(connection.id)}
                    disabled={connection.isSyncing || !connection.status}
                    className="whitespace-nowrap"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${connection.isSyncing ? "animate-spin" : ""}`} />
                    {connection.isSyncing ? "Syncing..." : "Sync Data"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {connections.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No connections found. Click "Add Connection" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddConnectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddConnection={handleAddConnection}
      />
    </div>
  )
}
