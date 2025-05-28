"use client"

import { Breadcrumb } from "@/components/ui/breadcrumb"
import { AmazonConnectionsGuard } from "@/components/common/amazon-connections-guard"
import BidOptimizerContent from "@/components/bid-optimizer/bid-optimizer-content"

export default function BidOptimizer() {
  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Breadcrumb segments={[{ name: "Bid Optimizer" }]} />
      </div>
      
      <AmazonConnectionsGuard 
        pageName="Bid Optimizer"
        description="Connect your Amazon Advertising account to start optimizing your campaigns and improving your advertising performance."
      >
        <BidOptimizerContent />
      </AmazonConnectionsGuard>
    </div>
  )
}