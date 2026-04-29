import { Phone, Calendar, Stethoscope } from 'lucide-react'
import type { Patient } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'
import { Badge, statusToBadge } from '@/shared/components/ui/Badge'
import { Avatar } from '@/shared/components/ui/Avatar'

interface PatientCardProps {
  patient: Patient
  onClick: () => void
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-sky-200 hover:shadow-md hover:shadow-sky-500/5 transition-all duration-150 group"
      padding="md"
    >
      <button className="w-full text-left" onClick={onClick} aria-label={`View ${patient.name}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={patient.name} size="md" />
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                {patient.name}
              </p>
              <p className="text-xs text-slate-400">
                {patient.age} yrs · {patient.gender} · {patient.bloodType}
              </p>
            </div>
          </div>
          <Badge variant={statusToBadge(patient.status)} dot>
            {patient.status}
          </Badge>
        </div>

        <div className="mb-3 p-2.5 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-700">{patient.condition}</p>
          <p className="text-xs text-slate-400 mt-0.5">{patient.department}</p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Stethoscope size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{patient.doctor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-slate-400 flex-shrink-0" />
            <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{patient.phone}</span>
          </div>
        </div>
      </button>
    </Card>
  )
}
