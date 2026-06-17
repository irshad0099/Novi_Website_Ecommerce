import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

type WishlistStore = {
  items: Product[]
  toggle: (product: Product) => void
  has: (id: number | string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) =>
        set(s =>
          s.items.some(i => i.id === product.id)
            ? { items: s.items.filter(i => i.id !== product.id) }
            : { items: [...s.items, product] }
        ),

      has: (id) => get().items.some(i => String(i.id) === String(id)),

      clear: () => set({ items: [] }),
    }),
    { name: 'novi-wishlist' }
  )
)
