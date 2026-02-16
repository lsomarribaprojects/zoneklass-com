export default function CourseDetailLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-6" />

      {/* Hero card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-border-light dark:border-slate-700 mb-8">
        <div className="h-56 sm:h-72 bg-gray-200 dark:bg-slate-700" />
        <div className="p-6 sm:p-8 space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-4 pt-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-12 w-full bg-gray-200 dark:bg-slate-700 rounded-xl mt-4" />
        </div>
      </div>

      {/* Modules skeleton */}
      <div className="h-6 w-48 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 p-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/4 bg-gray-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
