import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface RecentlyViewedState {
  items: Product[]
  add: (product: Product) => void
  clear: () => void
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((state) => {
          const filtered = state.items.filter((p) => p.id !== product.id)
          return { items: [product, ...filtered].slice(0, 8) }
        }),
      clear: () => set({ items: [] }),
    }),
    { name: 'nada-recently-viewed' }
  )
)
