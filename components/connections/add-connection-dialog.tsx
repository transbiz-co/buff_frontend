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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ExternalLink, AlertCircle } from "lucide-react"
import { getAmazonAdsAuthorizeUrl } from "@/lib/api/connections"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AddConnectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  onAddSuccess: () => void
}

export function AddConnectionDialog({ open, onOpenChange, userId, onAddSuccess }: AddConnectionDialogProps) {
  const [connectionType, setConnectionType] = useState<"amazon_ads" | "amazon_seller_central">("amazon_ads")
  const [step, setStep] = useState<"initial" | "authorization" | "connecting" | "success">("initial")
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Handle connection type selection and move to authorization info step
  const handleContinue = () => {
    if (connectionType === "amazon_ads") {
      setStep("authorization")
    }
  }

  // Go back to the initial step
  const handleBack = () => {
    setStep("initial")
  }

  // Redirect to Amazon Ads authorization page
  const handleAuthorize = async () => {
    if (!userId) {
      toast.error("Please sign in to your account")
      return
    }

    setIsLoading(true)
    setAuthError(null)
    setStep("connecting")

    try {
      // Get authorization URL
      const { authorizeUrl } = await getAmazonAdsAuthorizeUrl(userId)
      
      // Redirect to Amazon authorization page
      console.log("Redirecting to Amazon auth URL:", authorizeUrl)
      window.location.href = authorizeUrl
    } catch (error) {
      console.error("Failed to get authorization URL:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setAuthError(errorMessage)
      toast.error("Unable to connect to Amazon Ads. Please try again later.")
      setStep("authorization")
      setIsLoading(false)
    }
  }

  // Reset state when dialog is closed
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setStep("initial")
      setIsLoading(false)
      setAuthError(null)
    }
    onOpenChange(open)
  }

  // Simulate success (for development only)
  const handleSimulateSuccess = () => {
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
          <DialogDescription>Connect your Amazon account to enable data synchronization and optimization.</DialogDescription>
        </DialogHeader>

        {step === "initial" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <div className="grid gap-4 pt-2">
                <div 
                  className={cn(
                    "flex flex-col items-start rounded-md border border-input p-4 cursor-pointer",
                    connectionType === "amazon_ads" ? "bg-primary/10 border-primary/30" : "bg-background"
                  )}
                  onClick={() => setConnectionType("amazon_ads")}
                >
                  <RadioGroup value={connectionType} onValueChange={(value) => setConnectionType(value as "amazon_ads" | "amazon_seller_central")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amazon_ads" id="amazon-ads" />
                      <Label htmlFor="amazon-ads" className="font-medium">Amazon Ads</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    Connect your account to optimize campaigns and improve ACoS (Advertising Cost of Sale)
                  </p>
                </div>

                <div 
                  className="flex flex-col items-start rounded-md border border-input p-4 bg-muted/30 opacity-70 cursor-not-allowed"
                >
                  <RadioGroup value={connectionType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="amazon_seller_central" id="amazon-seller-central" disabled />
                      <Label htmlFor="amazon-seller-central" className="font-medium text-muted-foreground">Amazon Seller Central</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground mt-1 ml-6">
                    Connect to your Seller Central account to manage inventory and orders (Coming soon)
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "authorization" && (
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">You are about to connect to Amazon Advertising</p>
                  <p className="text-sm mt-1">This will redirect you to Amazon to authorize access to your advertising data. TransBiz will request the following permissions:</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 py-2">
              <h3 className="font-medium text-base">TransBiz will be able to:</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>View your advertising campaigns, ad groups, keywords, and targets</li>
                <li>Create, modify, and optimize your advertising campaigns</li>
                <li>View and analyze your advertising performance metrics</li>
                <li>Generate reports on your advertising data</li>
                <li>Optimize bids to improve your ACoS (Advertising Cost of Sale)</li>
              </ul>

              <p className="text-sm text-muted-foreground mt-4">
                You can revoke access at any time from your Amazon Advertising account settings.
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md text-sm">
                <p className="font-medium mb-1">Connection Error</p>
                <p>{authError}</p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleAuthorize} disabled={isLoading} className="gap-2">
                Authorize with Amazon <ExternalLink size={16} />
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "connecting" && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Connecting to Amazon Ads...</p>
            <p className="text-sm text-muted-foreground mt-2">You'll be redirected to Amazon to authorize access.</p>
            {/* For development environment only */}
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
              <p className="text-lg font-medium">Authorization Successful!</p>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Your Amazon Advertising account has been successfully authorized. Your ad profiles have been added to the system.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish}>Done</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
