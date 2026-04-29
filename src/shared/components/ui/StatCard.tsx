import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; label: string }
  accent?: string
  suffix?: string
}

export function StatCard({ label, value, icon, trend, accent = 'text-sky-500', suffix }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl bg-slate-50 ${accent}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900 font-mono">{value}</span>
          {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
      {trend && (
        <p className="text-xs text-slate-400">{trend.label}</p>
      )}
    </Card>
  )
}
