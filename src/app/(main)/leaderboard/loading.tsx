export default function LeaderboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        <div className="h-4 w-72 bg-gray-200 dark:bg-slate-700 rounded-lg mt-2" />
      </div>

      {/* Top 3 podium skeleton */}
      <div className="flex justify-center gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded mt-2" />
            <div className="h-3 w-14 bg-gray-200 dark:bg-slate-700 rounded mt-1" />
          </div>
        ))}
      </div>

      {/* Leaderboard rows skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border-light dark:border-slate-700 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-border-light dark:border-slate-700 last:border-0"
          >
            <div className="h-6 w-6 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
