import type * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string
    href?: string
  }[]
  separator?: React.ReactNode
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("buff-breadcrumb", className)} {...props}>
      <ol className="flex items-center">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <li key={segment.name} className="flex items-center">
              {index > 0 && <span className="buff-breadcrumb-separator mx-2">{separator}</span>}

              {isLast || !segment.href ? (
                <span className="buff-breadcrumb-current">{segment.name}</span>
              ) : (
                <Link href={segment.href} className="buff-breadcrumb-link">
                  {segment.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export const BreadcrumbList = () => null
export const BreadcrumbItem = () => null
export const BreadcrumbLink = () => null
export const BreadcrumbPage = () => null
export const BreadcrumbSeparator = () => null
export const BreadcrumbEllipsis = () => null
