import { useMemo } from 'react'
import { usePatientsStore } from '../store/patientsStore'

export function usePatients() {
  const store = usePatientsStore()

  const filtered = useMemo(() => {
    let result = store.patients

    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.doctor.toLowerCase().includes(q)
      )
    }

    if (store.statusFilter !== 'all') {
      result = result.filter((p) => p.status === store.statusFilter)
    }

    if (store.departmentFilter !== 'all') {
      result = result.filter((p) => p.department === store.departmentFilter)
    }

    return result
  }, [store.patients, store.searchQuery, store.statusFilter, store.departmentFilter])

  return { ...store, filteredPatients: filtered }
}
