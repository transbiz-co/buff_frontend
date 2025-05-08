"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ExternalLink } from "lucide-react"
import { getAmazonAdsAuthorizeUrl } from "@/lib/api/connections"
import { toast } from "sonner"

// Mapping of marketplace codes to Seller Central URLs
const SELLER_CENTRAL_URLS: Record<string, string> = {
  // Americas
  US: "https://sellercentral.amazon.com",
  CA: "https://sellercentral.amazon.ca",
  MX: "https://sellercentral.amazon.com.mx",
  BR: "https://sellercentral.amazon.com.br",

  // Europe
  UK: "https://sellercentral-europe.amazon.com",
  DE: "https://sellercentral-europe.amazon.com",
  FR: "https://sellercentral-europe.amazon.com",
  IT: "https://sellercentral-europe.amazon.com",
  ES: "https://sellercentral-europe.amazon.com",
  NL: "https://sellercentral.amazon.nl",
  SE: "https://sellercentral.amazon.se",
  PL: "https://sellercentral.amazon.pl",
  BE: "https://sellercentral.amazon.com.be",
  IE: "https://sellercentral.amazon.ie",

  // Asia-Pacific
  JP: "https://sellercentral.amazon.co.jp",
  AU: "https://sellercentral.amazon.com.au",
  SG: "https://sellercentral.amazon.sg",
  IN: "https://sellercentral.amazon.in",

  // Middle East and North Africa
  AE: "https://sellercentral.amazon.ae",
  SA: "https://sellercentral.amazon.sa",
  EG: "https://sellercentral.amazon.eg",
  TR: "https://sellercentral.amazon.com.tr",
  ZA: "https://sellercentral.amazon.co.za",
}

interface AddConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  onAddSuccess: () => void
}

export function AddConnectionDialog({ open, onOpenChange, userId, onAddSuccess }: AddConnectionDialogProps) {
  const [storeName, setStoreName] = useState("TransBiz Gadgets")
  const [connectionType] = useState<"Amazon Sponsored Ads">("Amazon Sponsored Ads")
  const [marketplace] = useState("US")
  const [step, setStep] = useState<"initial" | "connecting" | "success">("initial")
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // 實際重定向到 Amazon Ads 授權頁面
  const handleConnect = async () => {
    if (!userId) {
      toast.error("Please sign in to your account")
      return
    }

    setIsLoading(true)
    setAuthError(null)
    setStep("connecting")

    try {
      // 獲取授權 URL
      const { authorizeUrl } = await getAmazonAdsAuthorizeUrl(userId)
      
      // 重定向到 Amazon 授權頁面
      console.log("Redirecting to Amazon auth URL:", authorizeUrl)
      window.location.href = authorizeUrl
    } catch (error) {
      console.error("獲取授權 URL 失敗:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setAuthError(errorMessage)
      toast.error("Unable to connect to Amazon Ads. Please try again later.")
      setStep("initial")
      setIsLoading(false)
    }
  }

  // 對話框關閉時重置狀態
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setStep("initial")
      setIsLoading(false)
      setAuthError(null)
    }
    onOpenChange(open)
  }

  // 模擬成功（在實際情況下不會使用此功能）
  // 實際上成功會由 callback URL 重定向回應用並刷新頁面
  const handleSimulateSuccess = () => {
    // 模擬授權成功後的重定向
    window.location.href = `${window.location.origin}/connections?status=success`
  }

  const handleFinish = () => {
    onAddSuccess()
    setStep("initial")
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Connection</DialogTitle>
          <DialogDescription>Connect your Amazon account to enable data synchronization.</DialogDescription>
        </DialogHeader>

        {step === "initial" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="My Amazon Store"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Connection Type</Label>
              <RadioGroup
                value={connectionType}
                defaultValue="Amazon Sponsored Ads"
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Amazon Sponsored Ads" id="amazon-ads" />
                  <Label htmlFor="amazon-ads">Amazon Sponsored Ads</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Connect to your Amazon advertising data for campaign optimization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketplace">Marketplace</Label>
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                United States (US)
              </div>
              <p className="text-xs text-muted-foreground">
                Currently, we only support connections to the US marketplace
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-sm">
                <p className="font-medium mb-1">Connection Error</p>
                <p>{authError}</p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-md text-sm">
              <p className="font-medium text-blue-700 mb-1">How the connection works:</p>
              <p className="text-blue-600 mb-2">
                You'll be redirected to Amazon Advertising to authorize access to your Sponsored Ads data for the US marketplace. This allows TransBiz to optimize your advertising campaigns and provide analytics.
              </p>
              <p className="text-blue-600">
                No credentials are stored directly - we use Amazon's secure OAuth authorization process.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={isLoading} className="gap-2">
                Connect with Amazon <ExternalLink size={16} />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "connecting" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Connecting to Amazon...</p>
            <p className="text-sm text-muted-foreground mt-2">You'll be redirected to Amazon to authorize access.</p>
            {/* 僅用於開發環境的模擬按鈕 */}
            {process.env.NODE_ENV === "development" && (
              <Button onClick={handleSimulateSuccess} className="mt-4">
                Simulate Success
              </Button>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-lg font-medium">Connection Successful!</p>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Your Amazon Sponsored Ads account has been successfully connected for the US marketplace.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish}>Finish</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
