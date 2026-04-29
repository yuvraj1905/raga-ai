import { useState } from 'react'
import { LayoutGrid, List, Search, Plus, SlidersHorizontal } from 'lucide-react'
import { usePatients } from '../hooks/usePatients'
import { PatientCard } from './PatientCard'
import { PatientListRow } from './PatientListRow'
import { PatientDetailModal } from './PatientDetailModal'
import { AddPatientModal } from './AddPatientModal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { Badge, statusToBadge } from '@/shared/components/ui/Badge'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { useNotifications } from '@/shared/hooks/useNotifications'
import type { Patient } from '@/shared/types'

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Stable', label: 'Stable' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Recovering', label: 'Recovering' },
  { value: 'Discharged', label: 'Discharged' },
]

const deptOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Radiology', label: 'Radiology' },
]

export function PatientsPage() {
  const {
    filteredPatients,
    viewMode,
    searchQuery,
    statusFilter,
    departmentFilter,
    setViewMode,
    setSearchQuery,
    setStatusFilter,
    setDepartmentFilter,
    addPatient,
  } = usePatients()

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const { notifyNewPatient } = useNotifications()

  function handleAddPatient(p: Patient) {
    addPatient(p)
    notifyNewPatient(p.name)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search patients, conditions, doctors…"
            icon={<Search size={15} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={deptOptions}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active filters */}
      {(statusFilter !== 'all' || departmentFilter !== 'all') && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <span className="text-xs text-slate-500">Active filters:</span>
          {statusFilter !== 'all' && (
            <Badge variant={statusToBadge(statusFilter)}>
              {statusFilter}
            </Badge>
          )}
          {departmentFilter !== 'all' && (
            <Badge variant="info">{departmentFilter}</Badge>
          )}
          <button
            onClick={() => { setStatusFilter('all'); setDepartmentFilter('all') }}
            className="text-xs text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Patients grid/list */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => setSelectedPatient(patient)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr,2fr,1.5fr,1fr,1fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <span>Patient</span>
            <span>Condition</span>
            <span>Doctor</span>
            <span>Last Visit</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-slate-50">
            {filteredPatients.map((patient) => (
              <PatientListRow
                key={patient.id}
                patient={patient}
                onClick={() => setSelectedPatient(patient)}
              />
            ))}
          </div>
        </div>
      )}

      <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      <AddPatientModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddPatient}
      />
    </div>
  )
}
