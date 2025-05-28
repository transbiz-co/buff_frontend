import { Suspense } from "react"
import CampaignGroupsPureContent from "@/components/campaign-groups/campaign-groups-pure-content"
import Loading from "@/app/loading"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { AmazonConnectionsGuard } from "@/components/common/amazon-connections-guard"

export default function CampaignGroupsPage() {
  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Breadcrumb segments={[{ name: "Campaign Groups" }]} />
      </div>
      
      <AmazonConnectionsGuard 
        pageName="Campaign Groups"
        description="Connect your Amazon Advertising account to create and manage campaign groups for better organization of your advertising campaigns."
      >
        <Suspense fallback={<Loading />}>
          <CampaignGroupsPureContent />
        </Suspense>
      </AmazonConnectionsGuard>
    </div>
  )
}
