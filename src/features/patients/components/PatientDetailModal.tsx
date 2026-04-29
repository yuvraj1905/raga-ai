import { Phone, Mail, Calendar, Stethoscope, Droplets, Building2, ShieldCheck, User } from 'lucide-react'
import type { Patient } from '@/shared/types'
import { Modal } from '@/shared/components/ui/Modal'
import { Badge, statusToBadge } from '@/shared/components/ui/Badge'
import { Avatar } from '@/shared/components/ui/Avatar'

interface PatientDetailModalProps {
  patient: Patient | null
  onClose: () => void
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400 w-5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value}</p>
      </div>
    </div>
  )
}

export function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  if (!patient) return null

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Modal open={!!patient} onClose={onClose} title="Patient Details" size="lg">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <Avatar name={patient.name} size="lg" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{patient.name}</h3>
            <p className="text-sm text-slate-500">
              {patient.age} years · {patient.gender} · {patient.bloodType}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {patient.id.toUpperCase()}</p>
          </div>
          <Badge variant={statusToBadge(patient.status)} dot>
            {patient.status}
          </Badge>
        </div>

        {/* Condition highlight */}
        <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1">Primary Condition</p>
          <p className="text-sm font-semibold text-slate-900">{patient.condition}</p>
          <p className="text-xs text-slate-500 mt-0.5">{patient.department}</p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={<Stethoscope size={16} />} label="Attending Doctor" value={patient.doctor} />
          <InfoRow icon={<Building2 size={16} />} label="Department" value={patient.department} />
          <InfoRow icon={<Phone size={16} />} label="Phone" value={patient.phone} />
          <InfoRow icon={<Mail size={16} />} label="Email" value={patient.email} />
          <InfoRow icon={<Calendar size={16} />} label="Last Visit" value={formatDate(patient.lastVisit)} />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Next Appointment"
            value={patient.nextAppointment ? formatDate(patient.nextAppointment) : 'Not scheduled'}
          />
          <InfoRow icon={<User size={16} />} label="Admitted Date" value={formatDate(patient.admittedDate)} />
          <InfoRow icon={<Droplets size={16} />} label="Blood Type" value={patient.bloodType} />
          <InfoRow icon={<ShieldCheck size={16} />} label="Insurance ID" value={patient.insuranceId} />
        </div>
      </div>
    </Modal>
  )
}
