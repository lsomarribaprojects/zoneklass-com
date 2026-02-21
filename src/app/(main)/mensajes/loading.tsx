export default function MensajesLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-36 bg-gray-200 dark:bg-slate-700 rounded-lg" />
      </div>

      {/* Message list skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border-light dark:border-slate-700 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 border-b border-border-light dark:border-slate-700 last:border-0"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded mt-1" />
            </div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}