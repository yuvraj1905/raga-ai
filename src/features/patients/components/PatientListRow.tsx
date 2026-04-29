import type { Patient } from '@/shared/types'
import { Badge, statusToBadge } from '@/shared/components/ui/Badge'
import { Avatar } from '@/shared/components/ui/Avatar'

interface PatientListRowProps {
  patient: Patient
  onClick: () => void
}

export function PatientListRow({ patient, onClick }: PatientListRowProps) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <button
      className="w-full text-left px-5 py-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:grid sm:grid-cols-[2fr,2fr,1.5fr,1fr,1fr] gap-2 sm:gap-4 sm:items-center cursor-pointer"
      onClick={onClick}
      aria-label={`View ${patient.name}`}
    >
      <div className="flex items-center gap-3">
        <Avatar name={patient.name} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{patient.name}</p>
          <p className="text-xs text-slate-400">
            {patient.age} · {patient.gender}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-700 truncate">{patient.condition}</p>
        <p className="text-xs text-slate-400 truncate">{patient.department}</p>
      </div>

      <p className="text-sm text-slate-600 truncate">{patient.doctor}</p>

      <p className="text-sm text-slate-500">{formatDate(patient.lastVisit)}</p>

      <Badge variant={statusToBadge(patient.status)} dot>
        {patient.status}
      </Badge>
    </button>
  )
}
