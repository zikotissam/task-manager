export default function TaskSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex gap-2">
                <div className="h-5 w-14 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-5 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
