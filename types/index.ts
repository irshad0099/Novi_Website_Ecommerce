export type Product = {
  id: number
  slug: string
  name: string
  nameEn: string
  category: Category
  price: number
  comparePrice?: number
  rating: number
  reviewCount: number
  stock: number
  sold: number
  sku: string
  tags: string[]
  badge?: { label: string; color: 'gold' | 'red' | 'green' | 'blue' | 'purple' }
  images: string[]
  description: string
  features: string[]
  specs: Record<string, string>
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
}

export type Category = {
  slug: string
  name: string
  nameEn: string
  icon: string
}

export type CartItem = Product & { qty: number }

export type Order = {
  id: string
  items: CartItem[]
  customer: {
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode?: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
}
