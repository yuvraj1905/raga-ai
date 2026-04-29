export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  condition: string
  status: 'Stable' | 'Critical' | 'Recovering' | 'Discharged'
  lastVisit: string
  nextAppointment: string | null
  doctor: string
  department: Department
  bloodType: string
  phone: string
  email: string
  admittedDate: string
  insuranceId: string
  avatar?: string
}

export type Department =
  | 'Cardiology'
  | 'Neurology'
  | 'Oncology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Emergency'
  | 'General Medicine'
  | 'Radiology'

export interface DashboardStats {
  totalPatients: number
  appointmentsToday: number
  criticalCases: number
  dischargedThisWeek: number
  bedOccupancy: number
  avgWaitTime: number
}

export interface ActivityItem {
  id: string
  type: 'admission' | 'discharge' | 'appointment' | 'critical' | 'lab'
  message: string
  patient: string
  time: string
  department: Department
}

export interface AnalyticsDataPoint {
  month: string
  admissions: number
  discharges: number
  appointments: number
}

export interface DepartmentStat {
  department: Department
  patients: number
  critical: number
  color: string
}

export interface AgeDistribution {
  range: string
  count: number
  percentage: number
}
