import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DarkModeState {
  isDark: boolean
  toggle: () => void
  setDark: (v: boolean) => void
}

export const useDarkMode = create<DarkModeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => set({ isDark: !get().isDark }),
      setDark: (isDark) => set({ isDark }),
    }),
    { name: 'novi-theme' }
  )
)
