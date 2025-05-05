import type * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

import { toast as sonnerToast } from "sonner"

export const toast = {
  success: (message: string, options?: any) => {
    return sonnerToast.success(message, options)
  },
  error: (message: string, options?: any) => {
    return sonnerToast.error(message, options)
  },
  warning: (message: string, options?: any) => {
    return sonnerToast.warning(message, options)
  },
  info: (message: string, options?: any) => {
    return sonnerToast.info(message, options)
  },
}

// Add the useToast hook
export const useToast = () => {
  return {
    toast,
  }
}
