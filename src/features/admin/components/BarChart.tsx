'use client'

interface DataPoint {
  label: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  height?: number
  color?: string
}

export function BarChart({ data, height = 200, color = 'bg-primary-500' }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="w-full">
      <div className="flex items-end gap-[2px] w-full" style={{ height: `${height}px` }}>
        {data.map((point, i) => {
          const barHeight = (point.value / maxValue) * 100
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end group relative"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-slate-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {point.value}
              </div>
              <div
                className={`w-full ${color} rounded-t-sm transition-all duration-300 hover:opacity-80`}
                style={{ height: `${Math.max(barHeight, 1)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-[2px] mt-2 overflow-hidden">
        {data.map((point, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[9px] text-foreground-muted truncate"
          >
            {point.label}
          </div>
        ))}
      </div>
    </div>
  )
}
