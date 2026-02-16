export default function CursosLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-56 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse mt-2" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 h-11 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-11 w-48 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-11 w-44 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-slate-700" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-2/3 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="pt-3 border-t border-border-light dark:border-slate-700">
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
