import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { onAuthChange } from '@/features/auth/services/firebase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser)
    return unsubscribe
  }, [setUser])

  return <>{children}</>
}
