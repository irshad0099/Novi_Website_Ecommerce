'use client'
import { useEffect } from 'react'
import { useRecentlyViewed } from '@/store/recentlyViewed'
import type { Product } from '@/types'

export default function RecentlyViewedTracker({ product }: { product: Product }) {
  const add = useRecentlyViewed(s => s.add)
  useEffect(() => { add(product) }, [product.id])
  return null
}
