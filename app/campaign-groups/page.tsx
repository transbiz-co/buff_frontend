import { Suspense } from "react"
import CampaignGroupsContent from "@/components/campaign-groups/campaign-groups-content"
import Loading from "@/app/loading"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ProtectedRoute } from "@/components/protected-route"

export default function CampaignGroupsPage() {
  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Breadcrumb segments={[{ name: "Campaign Groups" }]} />
        </div>
        <Suspense fallback={<Loading />}>
          <CampaignGroupsContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  )
}
