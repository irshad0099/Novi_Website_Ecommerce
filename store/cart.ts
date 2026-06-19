'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/types'

const COUPONS: Record<string, number> = {
  NOVI10: 10,
  NOVI15: 15,
  NOVI20: 20,
  WELCOME5: 5,
  FIRST50: 50,
}

type CartStore = {
  items: CartItem[]
  couponCode: string
  couponPct: number

  addItem: (p: Product, qty?: number) => void
  removeItem: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void

  subtotal: () => number
  shipping: () => number
  discount: () => number
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponPct: 0,

      addItem: (p, qty = 1) =>
        set(s => {
          const ex = s.items.find(i => i.id === p.id)
          return ex
            ? { items: s.items.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i) }
            : { items: [...s.items, { ...p, qty }] }
        }),

      removeItem: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set(s => ({ items: s.items.map(i => i.id === id ? { ...i, qty } : i) }))
      },

      clearCart: () => set({ items: [], couponCode: '', couponPct: 0 }),

      applyCoupon: code => {
        const key = code.trim().toUpperCase()
        if (COUPONS[key]) {
          set({ couponCode: key, couponPct: COUPONS[key] })
          return true
        }
        return false
      },

      removeCoupon: () => set({ couponCode: '', couponPct: 0 }),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      shipping: () => get().subtotal() >= 150 ? 0 : 20,
      discount: () => (get().subtotal() * get().couponPct) / 100,
      total: () => get().subtotal() + get().shipping() - get().discount(),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: 'nada-alhareer-cart' }
  )
)
