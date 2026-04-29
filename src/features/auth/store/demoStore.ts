import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DemoState {
  isDemoUser: boolean
  setDemoUser: (v: boolean) => void
}

// persisted so page refresh doesn't log them out
export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoUser: false,
      setDemoUser: (isDemoUser) => set({ isDemoUser }),
    }),
    { name: 'raga-ai-demo' }
  )
)
