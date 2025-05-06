"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronRight, Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: string
  title: string
  description: string
  content: React.ReactNode
}

interface GuidedWorkflowProps {
  title: string
  description: string
  steps: Step[]
  onComplete: () => void
  onCancel: () => void
}

export function GuidedWorkflow({ title, description, steps, onComplete, onCancel }: GuidedWorkflowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const progress = (completedSteps.length / steps.length) * 100

  const handleNext = () => {
    if (isLastStep) {
      setCompletedSteps((prev) => [...prev, currentStep.id])
      toast.success("Workflow completed successfully!")
      onComplete()
      return
    }

    setCompletedSteps((prev) => [...prev, currentStep.id])
    setCurrentStepIndex((prev) => prev + 1)
  }

  const handleBack = () => {
    if (isFirstStep) return
    setCurrentStepIndex((prev) => prev - 1)
  }

  const handleCancel = () => {
    toast.info("Workflow cancelled")
    onCancel()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            Step {currentStepIndex + 1} of {steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex gap-8">
          <div className="w-1/4 border-r pr-4">
            <nav className="space-y-1">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex
                const isCompleted = completedSteps.includes(step.id)

                return (
                  <div
                    key={step.id}
                    className={`flex items-center p-2 rounded-md ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                        isCompleted
                          ? "bg-success text-white"
                          : isActive
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
                    </div>
                    <span className={`text-sm ${isActive ? "font-medium" : ""}`}>{step.title}</span>
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </div>
                )
              })}
            </nav>
          </div>

          <div className="w-3/4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-1">{currentStep.title}</h3>
              <p className="text-muted-foreground text-sm">{currentStep.description}</p>
            </div>

            <div className="mb-6">{currentStep.content}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          <span>You can revisit this workflow later if needed</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {!isFirstStep && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext}>{isLastStep ? "Complete" : "Next"}</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
