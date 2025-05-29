"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import CampaignGroupsPureContent from "@/components/campaign-groups/campaign-groups-pure-content"
import Loading from "@/app/loading"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { AmazonConnectionsGuard } from "@/components/common/amazon-connections-guard"
import { useAmazonConnectionsGuard } from "@/hooks/use-amazon-connections-guard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CampaignGroupsPage() {
  const { activeConnections } = useAmazonConnectionsGuard()
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("")

  useEffect(() => {
    if (activeConnections.length > 0 && !selectedConnectionId) {
      setSelectedConnectionId(activeConnections[0].id)
    }
  }, [activeConnections, selectedConnectionId])

  const selectedConnection = activeConnections.find(c => c.id === selectedConnectionId)

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Breadcrumb segments={[{ name: "Campaign Groups" }]} />
        
        <div className="w-64">
          <Select value={selectedConnectionId} onValueChange={setSelectedConnectionId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選擇 Amazon 廣告帳戶" />
            </SelectTrigger>
            <SelectContent>
              {activeConnections.map(connection => (
                <SelectItem key={connection.id} value={connection.id}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{connection.accountName}</span>
                    <span className="text-xs text-muted-foreground">{connection.profileId}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <AmazonConnectionsGuard 
        pageName="Campaign Groups"
        description="Connect your Amazon Advertising account to create and manage campaign groups for better organization of your advertising campaigns."
      >
        <Suspense fallback={<Loading />}>
          <CampaignGroupsPureContent profileId={selectedConnection?.profileId} />
        </Suspense>
      </AmazonConnectionsGuard>
    </div>
  )
}
