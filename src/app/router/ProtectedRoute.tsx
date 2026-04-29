import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useDemoStore } from '@/features/auth/store/demoStore'
import { PageSpinner } from '@/shared/components/ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()
  const isDemoUser = useDemoStore((s) => s.isDemoUser)

  if (loading) return <PageSpinner />

  // Allow through if real Firebase user OR demo mode
  if (!user && !isDemoUser) return <Navigate to="/login" replace />

  return <>{children}</>
}
