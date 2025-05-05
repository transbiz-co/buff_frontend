"use client"

import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

interface TransitionAnimationProps {
  message?: string
  onComplete?: () => void
  duration?: number
}

export function TransitionAnimation({
  message = "Calculating optimizations...",
  onComplete,
  duration = 2000,
}: TransitionAnimationProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration

    const updateProgress = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const newProgress = Math.min(100, (elapsed / duration) * 100)

      setProgress(newProgress)

      if (currentTime < endTime) {
        requestAnimationFrame(updateProgress)
      } else {
        if (onComplete) {
          onComplete()
        }
      }
    }

    requestAnimationFrame(updateProgress)

    return () => {
      // Cleanup if needed
    }
  }, [duration, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-card p-8 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full"
      >
        <LoadingSpinner size="lg" className="mb-4" />
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        <p className="text-muted-foreground mb-4 text-center">
          We're analyzing your campaigns and calculating the optimal bid adjustments.
        </p>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
      </motion.div>
    </motion.div>
  )
}
