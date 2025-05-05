"use client"

import { Button } from "@/components/ui/button"
import { Wand2, ArrowRight, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface FloatingActionButtonsProps {
  selectedCampaignsCount: number
  onOptimizeBids: () => void
  onBulkAction: (action: string) => void
}

export function FloatingActionButtons({
  selectedCampaignsCount,
  onOptimizeBids,
  onBulkAction,
}: FloatingActionButtonsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (selectedCampaignsCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            ref={buttonRef}
            variant="outline"
            size="sm"
            className="bg-white shadow-md h-10 px-4"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            More Actions
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </Button>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute bottom-full mb-1 right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[9999]"
            >
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  onBulkAction("state")
                  setDropdownOpen(false)
                }}
              >
                Change State
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  onBulkAction("opt-group")
                  setDropdownOpen(false)
                }}
              >
                Assign to Campaign Group
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  onBulkAction("bidding-strategy")
                  setDropdownOpen(false)
                }}
              >
                Change Bidding Strategy
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  onBulkAction("budget")
                  setDropdownOpen(false)
                }}
              >
                Change Budget
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={onOptimizeBids}
          size="lg"
          className="rounded-full shadow-lg flex items-center gap-2 px-6 py-6 bg-primary hover:bg-primary/90 transition-all"
        >
          <Wand2 className="h-5 w-5" />
          <span>Optimize Bids</span>
          <ArrowRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
