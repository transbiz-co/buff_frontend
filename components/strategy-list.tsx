import Link from "next/link"
import { Clock, ArrowRight, TrendingUp } from "lucide-react"
import type { Strategy } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface StrategyListProps {
  strategies: Strategy[]
}

export function StrategyList({ strategies }: StrategyListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {strategies.map((strategy) => (
        <Card key={strategy.id} className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <CardDescription className="mt-1">{strategy.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>Last run: {strategy.lastRun} days ago</span>
              </div>
              <div className="flex items-center text-sm font-medium text-success-600">
                <TrendingUp size={14} className="mr-1" />
                <span>${strategy.estimatedSavings}/mo</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/strategy/${strategy.id}`} className="w-full">
              <Button variant="outline" className="w-full justify-between">
                <span>View Strategy</span>
                <div className="flex items-center gap-2">
                  {strategy.pendingTasks > 0 && (
                    <Badge variant="default" className="rounded-full px-2 py-0.5 text-xs">
                      {strategy.pendingTasks}
                    </Badge>
                  )}
                  <ArrowRight size={16} />
                </div>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
