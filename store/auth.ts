'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth as authApi, users as usersApi, type UserProfile, type AuthResponse } from '@/lib/api'

type AuthStore = {
  user: UserProfile | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean

  // Derived
  isAuthenticated: () => boolean
  isAdmin: () => boolean

  // Actions
  login:    (email: string, password: string) => Promise<void>
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<void>
  logout:   () => Promise<void>
  fetchMe:  () => Promise<void>
  updateUser: (data: Partial<UserProfile>) => void
  setFromResponse: (res: AuthResponse) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:         null,
      token:        null,
      refreshToken: null,
      isLoading:    false,

      isAuthenticated: () => !!get().token && !!get().user,
      isAdmin:         () => get().user?.role === 'admin',

      setFromResponse: (res: AuthResponse) => {
        set({ user: res.user, token: res.token, refreshToken: res.refreshToken, isLoading: false })
      },

      login: async (email, password) => {
        set({ isLoading: true })
        const res = await authApi.login({ email, password })
        get().setFromResponse(res)
      },

      register: async (data) => {
        set({ isLoading: true })
        const res = await authApi.register(data)
        get().setFromResponse(res)
      },

      logout: async () => {
        try { await authApi.logout() } catch { /* ignore */ }
        set({ user: null, token: null, refreshToken: null })
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me()
          set({ user: res.user })
        } catch {
          set({ user: null, token: null, refreshToken: null })
        }
      },

      updateUser: (data) => {
        const current = get().user
        if (current) set({ user: { ...current, ...data } })
      },
    }),
    {
      name: 'nada-auth',
      partialize: (s) => ({ user: s.user, token: s.token, refreshToken: s.refreshToken }),
    }
  )
)
