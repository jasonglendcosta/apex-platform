'use client'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-white/5 rounded animate-pulse ${className}`}
    />
  )
}

export function UnitCardSkeleton() {
  return (
    <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-4">
      {/* Status banner */}
      <div className="h-1 bg-white/5 rounded-full mb-4" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Skeleton className="h-9 rounded-lg" />
        <Skeleton className="h-9 rounded-lg" />
      </div>

      {/* Price */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-3 w-10 mb-1" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function UnitGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <UnitCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CustomerRowSkeleton() {
  return (
    <div className="bg-[#12121a] rounded-xl border border-white/5 p-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function CustomerListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#1a1a24] rounded-xl p-5 border border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-7 w-24" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#1a1a24] rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-white/10">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 border-b border-white/5 last:border-b-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 w-full flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
