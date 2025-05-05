"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoCircle } from "@/components/icons/info-circle"
import { ArrowRight, ChevronDown } from "lucide-react"

interface OptimizeBidsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCampaignsCount: number
  onPreviewOptimizations: () => void
}

export function OptimizeBidsDialog({
  open,
  onOpenChange,
  selectedCampaignsCount,
  onPreviewOptimizations,
}: OptimizeBidsDialogProps) {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [maxIncreaseType, setMaxIncreaseType] = useState<string>("percentage")
  const [maxDecreaseType, setMaxDecreaseType] = useState<string>("percentage")
  const [placementMaxIncreaseType, setPlacementMaxIncreaseType] = useState<string>("percentage")
  const [placementMaxDecreaseType, setPlacementMaxDecreaseType] = useState<string>("percentage")

  // Add a function to toggle advanced settings visibility
  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings((prev) => !prev)
  }, [])

  const handlePreviewClick = useCallback(() => {
    onOpenChange(false)
    onPreviewOptimizations()
  }, [onOpenChange, onPreviewOptimizations])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Optimize bids</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Group Settings - Single row layout */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-medium">Campaign Group settings</h4>
                <InfoCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center">
                <Switch id="use-opt-group" defaultChecked />
                <Label htmlFor="use-opt-group" className="ml-2 text-primary font-medium">
                  Use Campaign Group settings
                </Label>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium mb-2">Target ACOS*</h4>
              <div className="flex items-center">
                <Input type="number" defaultValue="30" className="w-16 text-right" />
                <span className="ml-2">%</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium mb-2">Prioritization*</h4>
              <Select defaultValue="balanced">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select prioritization" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="reduce-acos">Reduce ACOS</SelectItem>
                  <SelectItem value="increase-sales">Increase sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-1">
            <div className="col-span-2">{/* Empty column */}</div>
            <div className="col-span-2 text-left">
              <p className="text-xs text-muted-foreground">*Applies only to "Not Set" Campaign Groups</p>
            </div>
          </div>

          {/* Targets to Optimize - Full width */}
          <div>
            <h4 className="text-base font-medium mb-4">Targets to optimize</h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">Improve efficiency</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="high-acos" defaultChecked />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="high-acos">High ACOS</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="high-spend-no-sales" defaultChecked />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="high-spend-no-sales">High spend, no sales</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3">Improve sales</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="low-acos" defaultChecked />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="low-acos">Low ACOS</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="low-visibility" defaultChecked />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="low-visibility">Low visibility</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-6">
                    <Checkbox id="include-zero-impressions" />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="include-zero-impressions">Include 0 impressions</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button variant="link" size="sm" className="text-primary" onClick={toggleAdvancedSettings}>
                {showAdvancedSettings ? "Hide advanced" : "Show advanced"}
                <ChevronDown
                  className={`h-4 w-4 ml-1 transition-transform ${showAdvancedSettings ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>

          {showAdvancedSettings && (
            <>
              {/* Bid Change Limits - Full width */}
              <div>
                <h4 className="text-base font-medium mb-4">Bid change limits</h4>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Bid floor</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select defaultValue="off">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select bid floor" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="minimum">Minimum</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Bid ceiling</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="smart" className="w-1/3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select bid ceiling" className="text-left" />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="smart">Smart</SelectItem>
                          <SelectItem value="maximum">Maximum</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select defaultValue="balanced" className="w-2/3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select target CPC" className="text-left" />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="conservative">1x Target CPC (Conservative)</SelectItem>
                          <SelectItem value="balanced">2x Target CPC (Balanced)</SelectItem>
                          <SelectItem value="aggressive">3x Target CPC (Aggressive)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Max increase</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="percentage" onValueChange={setMaxIncreaseType}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="amount">$</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                      {maxIncreaseType !== "off" && (
                        <>
                          <Input type="number" defaultValue="25" className="w-16 text-right" />
                          <span className="min-w-[20px]">{maxIncreaseType === "percentage" ? "%" : "$"}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Max decrease</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="percentage" onValueChange={setMaxDecreaseType}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="amount">$</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                      {maxDecreaseType !== "off" && (
                        <>
                          <Input type="number" defaultValue="25" className="w-16 text-right" />
                          <span className="min-w-[20px]">{maxDecreaseType === "percentage" ? "%" : "$"}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Placement Settings - Full width */}
              <div>
                <h4 className="text-base font-medium mb-4">Placement settings</h4>

                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="optimize-placements" defaultChecked />
                    <div className="flex items-center gap-1">
                      <Label htmlFor="optimize-placements">Optimize placements</Label>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Max increase</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="percentage" onValueChange={setPlacementMaxIncreaseType}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                      {placementMaxIncreaseType !== "off" && (
                        <>
                          <Input type="number" defaultValue="33" className="w-16 text-right" />
                          <span className="min-w-[20px]">%</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-sm font-medium">Max decrease</h5>
                      <InfoCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="percentage" onValueChange={setPlacementMaxDecreaseType}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start" className="text-left">
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="off">Off</SelectItem>
                        </SelectContent>
                      </Select>
                      {placementMaxDecreaseType !== "off" && (
                        <>
                          <Input type="number" defaultValue="33" className="w-16 text-right" />
                          <span className="min-w-[20px]">%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePreviewClick} className="bg-primary hover:bg-primary/90">
            Preview optimizations <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
