import { create } from 'zustand'
import type { Product } from '@/types'

interface CompareState {
  items: Product[]
  toggle: (product: Product) => void
  remove: (id: number) => void
  clear: () => void
  has: (id: number) => boolean
}

export const useCompare = create<CompareState>((set, get) => ({
  items: [],
  toggle: (product) => {
    const exists = get().items.find(p => p.id === product.id)
    if (exists) {
      set(s => ({ items: s.items.filter(p => p.id !== product.id) }))
    } else if (get().items.length < 3) {
      set(s => ({ items: [...s.items, product] }))
    }
  },
  remove: (id) => set(s => ({ items: s.items.filter(p => p.id !== id) })),
  clear: () => set({ items: [] }),
  has: (id) => !!get().items.find(p => p.id === id),
}))
