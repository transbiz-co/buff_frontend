import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 mb-8">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="col-span-1">
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ))}
      </div>

      <Skeleton className="h-[400px] w-full mb-8 rounded-lg" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-9 w-28" />
            ))}
        </div>
        <div className="flex items-center gap-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-9 w-28" />
            ))}
        </div>
      </div>

      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-[500px] w-full rounded-lg" />
    </div>
  )
}
