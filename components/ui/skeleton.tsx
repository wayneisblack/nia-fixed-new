export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

/** A row of skeleton "stat card" placeholders, matching the dashboard's stat grid. */
export function SkeletonStatGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel-strong rounded-[1.75rem] p-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-9 w-16" />
          <Skeleton className="mt-2 h-3 w-36" />
        </div>
      ))}
    </div>
  );
}

/** A stack of skeleton list-row placeholders, matching card-style list items. */
export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[1.5rem] border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="mt-2 h-3.5 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
