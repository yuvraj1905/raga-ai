import { create } from 'zustand'
import type { Patient } from '@/shared/types'
import { MOCK_PATIENTS } from '@/shared/constants/mockData'

type ViewMode = 'grid' | 'list'

interface PatientsState {
  patients: Patient[]
  viewMode: ViewMode
  searchQuery: string
  statusFilter: string
  departmentFilter: string
  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (q: string) => void
  setStatusFilter: (s: string) => void
  setDepartmentFilter: (d: string) => void
  addPatient: (p: Patient) => void
}

export const usePatientsStore = create<PatientsState>((set) => ({
  patients: MOCK_PATIENTS,
  viewMode: 'grid',
  searchQuery: '',
  statusFilter: 'all',
  departmentFilter: 'all',
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  addPatient: (p) => set((state) => ({ patients: [p, ...state.patients] })),
}))
