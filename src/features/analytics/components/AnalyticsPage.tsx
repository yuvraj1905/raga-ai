import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import {
  MONTHLY_TRENDS,
  DEPARTMENT_STATS,
  AGE_DISTRIBUTION,
  MOCK_PATIENTS,
} from '@/shared/constants/mockData'

const statusCounts = MOCK_PATIENTS.reduce(
  (acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  },
  {} as Record<string, number>
)

const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
const STATUS_COLORS: Record<string, string> = {
  Stable: '#10B981',
  Critical: '#F43F5E',
  Recovering: '#F59E0B',
  Discharged: '#94A3B8',
}

export function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Patient trends and department performance insights</p>
      </div>

      {/* Trends chart */}
      <Card padding="none" className="mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Patient Volume Trends</h2>
          <p className="text-xs text-slate-500 mt-0.5">Last 7 months · admissions, discharges, appointments</p>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY_TRENDS} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="admissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="discharges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#0EA5E9" strokeWidth={2} fill="url(#admissions)" />
              <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#10B981" strokeWidth={2} fill="url(#discharges)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department breakdown */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Patients by Department</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEPARTMENT_STATS} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="department" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="patients" name="Patients" radius={[0, 4, 4, 0]}>
                  {DEPARTMENT_STATS.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status distribution */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Patient Status Distribution</h2>
          </div>
          <div className="p-5 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] ?? '#94a3b8' }} />
                  <span className="text-xs text-slate-600">{s.name} ({s.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Age distribution */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Age Distribution</h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-3">
            {AGE_DISTRIBUTION.map((item) => (
              <div key={item.range} className="flex items-center gap-4">
                <span className="text-sm text-slate-600 w-12 flex-shrink-0 font-mono">{item.range}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-sky-400 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-medium text-slate-800 w-6 text-right">{item.count}</span>
                  <Badge variant="neutral">{item.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
