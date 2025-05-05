"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { OptimizationTable } from "@/components/bid-optimizer/optimization-table"
import { ConfirmSubmitDialog } from "@/components/bid-optimizer/confirm-submit-dialog"
import { mockOptimizationData } from "@/lib/mock-optimization-data"

export default function PreviewOptimizationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [optimizations, setOptimizations] = useState(mockOptimizationData)
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate summary metrics
  const summary = useMemo(() => {
    const selected = optimizations.filter((opt) => selectedOptimizations.includes(opt.id))

    return {
      totalChanges: selected.length,
      estimatedImpact: {
        acos: {
          value: selected.reduce((sum, opt) => {
            const currentAcos = Number.parseFloat(opt.currentAcos.replace("%", ""))
            const newAcos = Number.parseFloat(opt.newAcos.replace("%", ""))
            return sum + (newAcos - currentAcos)
          }, 0),
          percentage:
            selected.reduce((sum, opt) => {
              const currentAcos = Number.parseFloat(opt.currentAcos.replace("%", ""))
              const newAcos = Number.parseFloat(opt.newAcos.replace("%", ""))
              return sum + ((newAcos - currentAcos) / currentAcos) * 100
            }, 0) / (selected.length || 1),
        },
        spend: {
          value: selected.reduce((sum, opt) => {
            const currentValue = Number.parseFloat(opt.currentValue.replace("$", ""))
            const newValue = Number.parseFloat(opt.newValue.replace("$", ""))
            return sum + (newValue - currentValue)
          }, 0),
          percentage:
            selected.reduce((sum, opt) => {
              const currentValue = Number.parseFloat(opt.currentValue.replace("$", ""))
              const newValue = Number.parseFloat(opt.newValue.replace("$", ""))
              return sum + ((newValue - currentValue) / currentValue) * 100
            }, 0) / (selected.length || 1),
        },
      },
    }
  }, [optimizations, selectedOptimizations])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOptimizations(optimizations.map((opt) => opt.id))
    } else {
      setSelectedOptimizations([])
    }
  }

  const handleSelectOptimization = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOptimizations((prev) => [...prev, id])
    } else {
      setSelectedOptimizations((prev) => prev.filter((optId) => optId !== id))
    }
  }

  const handleUpdateOptimization = (id: string, newValue: string) => {
    setOptimizations((prev) =>
      prev.map((opt) =>
        opt.id === id
          ? {
              ...opt,
              newValue: newValue.startsWith("$") ? newValue : `$${newValue}`,
              delta: calculateDelta(
                Number.parseFloat(opt.currentValue.replace("$", "")),
                Number.parseFloat(newValue.replace("$", "")),
              ),
            }
          : opt,
      ),
    )
  }

  const calculateDelta = (current: number, newVal: number) => {
    const diff = ((newVal - current) / current) * 100
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`
  }

  const handleBackToCampaigns = () => {
    router.push("/bid-optimizer")
  }

  const handleSubmitChanges = () => {
    if (selectedOptimizations.length === 0) {
      toast({
        title: "No optimizations selected",
        description: "Please select at least one optimization to submit",
        variant: "destructive",
      })
      return
    }
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmSubmit = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Changes submitted successfully",
      description: `Successfully submitted ${selectedOptimizations.length} changes to Amazon`,
    })
    setIsLoading(false)
    setIsConfirmDialogOpen(false)
    router.push("/bid-optimizer")
  }

  return (
    <div className="p-6 w-full">
      {/* Header with breadcrumb */}
      <div className="mb-6">
        <Breadcrumb segments={[{ name: "Bid Optimizer", href: "/bid-optimizer" }, { name: "Preview Optimizations" }]} />
      </div>

      {/* Back button and page title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleBackToCampaigns}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Campaigns</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedOptimizations.length === 0}
            onClick={() => setSelectedOptimizations([])}
          >
            Clear Selection
          </Button>
          <Button size="sm" disabled={selectedOptimizations.length === 0} onClick={handleSubmitChanges}>
            Submit to Amazon ({selectedOptimizations.length})
          </Button>
        </div>
      </div>

      {/* Optimization Table */}
      <OptimizationTable
        optimizations={optimizations}
        selectedOptimizations={selectedOptimizations}
        onSelectAll={handleSelectAll}
        onSelectOptimization={handleSelectOptimization}
        onUpdateOptimization={handleUpdateOptimization}
      />

      {/* Confirm Submit Dialog */}
      <ConfirmSubmitDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        selectedCount={selectedOptimizations.length}
        onConfirm={handleConfirmSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
