import { useEffect, useRef } from 'react'
import { Users, Calendar, AlertTriangle, TrendingUp, Bed, Clock } from 'lucide-react'
import { StatCard } from '@/shared/components/ui/StatCard'
import { Card } from '@/shared/components/ui/Card'
import { Badge, statusToBadge } from '@/shared/components/ui/Badge'
import { Avatar } from '@/shared/components/ui/Avatar'
import { DASHBOARD_STATS, RECENT_ACTIVITY, MOCK_PATIENTS } from '@/shared/constants/mockData'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { NotificationPanel } from './NotificationPanel'

const activityIcons: Record<string, string> = {
  admission: '🏥',
  discharge: '🏠',
  appointment: '📅',
  critical: '🚨',
  lab: '🧪',
}

export function DashboardPage() {
  const { user } = useAuth()
  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Doctor'
  const { permission, showNotification } = useNotifications()
  const briefFired = useRef(false)

  const criticalPatients = MOCK_PATIENTS.filter((p) => p.status === 'Critical').slice(0, 4)

  // Morning brief: notify about critical patients 4 seconds after the dashboard loads.
  // Only fires once per session so it doesn't repeat on re-renders.
  useEffect(() => {
    if (permission !== 'granted' || briefFired.current) return
    briefFired.current = true
    const count = MOCK_PATIENTS.filter((p) => p.status === 'Critical').length
    const timer = setTimeout(() => {
      showNotification(
        `${count} Critical Patient${count !== 1 ? 's' : ''} Active`,
        'Review the critical cases dashboard for immediate action.',
        'morning-brief',
      )
    }, 4000)
    return () => clearTimeout(timer)
  }, [permission, showNotification])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, {displayName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s what&apos;s happening today,{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <NotificationPanel />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Patients"
          value={DASHBOARD_STATS.totalPatients}
          icon={<Users size={18} />}
          trend={{ value: 12, label: 'vs last month' }}
          accent="text-sky-500"
        />
        <StatCard
          label="Appointments Today"
          value={DASHBOARD_STATS.appointmentsToday}
          icon={<Calendar size={18} />}
          trend={{ value: 5, label: 'vs yesterday' }}
          accent="text-violet-500"
        />
        <StatCard
          label="Critical Cases"
          value={DASHBOARD_STATS.criticalCases}
          icon={<AlertTriangle size={18} />}
          trend={{ value: -2, label: 'vs last week' }}
          accent="text-rose-500"
        />
        <StatCard
          label="Discharged This Week"
          value={DASHBOARD_STATS.dischargedThisWeek}
          icon={<TrendingUp size={18} />}
          accent="text-emerald-500"
        />
        <StatCard
          label="Bed Occupancy"
          value={DASHBOARD_STATS.bedOccupancy}
          suffix="%"
          icon={<Bed size={18} />}
          accent="text-amber-500"
        />
        <StatCard
          label="Avg. Wait Time"
          value={DASHBOARD_STATS.avgWaitTime}
          suffix="min"
          icon={<Clock size={18} />}
          accent="text-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-3" padding="none">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
            <span className="text-xs text-slate-400">Live</span>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-xl w-8 text-center flex-shrink-0">
                  {activityIcons[item.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.patient}</p>
                  <p className="text-xs text-slate-500">{item.message} · {item.department}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Critical Patients */}
        <Card className="lg:col-span-2" padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Critical Patients</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {criticalPatients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={patient.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{patient.name}</p>
                  <p className="text-xs text-slate-500 truncate">{patient.condition}</p>
                </div>
                <Badge variant={statusToBadge(patient.status)} dot>
                  {patient.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-50">
            <a href="/patients" className="text-xs text-sky-600 font-medium hover:text-sky-700">
              View all patients →
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
