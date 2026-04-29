import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { loginWithEmail, logout, onAuthChange } from '../services/firebase'

export function useAuth() {
  const { user, loading, setUser } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser)
    return unsubscribe
  }, [setUser])

  return { user, loading, loginWithEmail, logout }
}
