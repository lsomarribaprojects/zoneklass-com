export default function ComunidadLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-xl" />
      </div>

      {/* Post skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-border-light dark:border-slate-700 p-5 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="flex gap-4 mt-4">
            <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
