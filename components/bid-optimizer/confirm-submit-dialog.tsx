"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ConfirmSubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: () => void
  isLoading: boolean
}

export function ConfirmSubmitDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  isLoading,
}: ConfirmSubmitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground">
            You are about to submit {selectedCount} optimization{selectedCount !== 1 ? "s" : ""} to Amazon. This action
            cannot be undone. Are you sure you want to proceed?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              `Submit ${selectedCount} Change${selectedCount !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
