export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Greeting skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded-lg mt-2" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border-light dark:border-slate-700"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-slate-700 mb-3" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-8 w-12 bg-gray-200 dark:bg-slate-700 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Courses skeleton */}
      <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-border-light dark:border-slate-700 overflow-hidden"
          >
            <div className="h-40 bg-gray-200 dark:bg-slate-700" />
            <div className="p-4">
              <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded mt-2" />
              <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}