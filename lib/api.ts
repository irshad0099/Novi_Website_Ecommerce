const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Token helpers (browser-only) ─────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('nada-auth')
    if (!raw) return null
    return JSON.parse(raw)?.state?.token ?? null
  } catch { return null }
}

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('nada-auth')
    if (!raw) return null
    return JSON.parse(raw)?.state?.refreshToken ?? null
  } catch { return null }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh()
    if (refreshed) return request<T>(path, options, false)
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.message || 'حدث خطأ ما', res.status, data)
  return data as T
}

async function tryRefresh(): Promise<boolean> {
  const rt = getRefreshToken()
  if (!rt) return false
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.token) {
      const raw = localStorage.getItem('nada-auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.state.token = data.token
        localStorage.setItem('nada-auth', JSON.stringify(parsed))
      }
      return true
    }
    return false
  } catch { return false }
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

// ── Convenience methods ───────────────────────────────────────────────────────
const get  = <T>(path: string) => request<T>(path, { method: 'GET' })
const post = <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) })
const put  = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',  body: JSON.stringify(body) })
const del  = <T>(path: string) => request<T>(path, { method: 'DELETE' })

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  success: boolean
  token: string
  refreshToken: string
  user: UserProfile
}

export const auth = {
  register: (body: { firstName: string; lastName: string; email: string; password: string; phone?: string }) =>
    post<AuthResponse>('/auth/register', body),

  login: (body: { email: string; password: string }) =>
    post<AuthResponse>('/auth/login', body),

  me: () => get<{ success: boolean; user: UserProfile }>('/auth/me'),

  logout: () => post<{ success: boolean; message: string }>('/auth/logout', {}),

  refresh: (refreshToken: string) =>
    post<{ success: boolean; token: string }>('/auth/refresh', { refreshToken }),
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
export interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  gender?: string
  birthday?: string
  role: string
  avatar?: string
  addresses?: Address[]
  wishlist?: WishlistItem[]
  createdAt?: string
}

export interface Address {
  _id: string
  label: string
  name: string
  phone: string
  address: string
  city: string
  postal?: string
  isDefault: boolean
}

export interface WishlistItem {
  _id: string
  slug: string
  name: string
  price: number
  images: string[]
  rating: number
}

export const users = {
  getProfile: () => get<{ success: boolean; user: UserProfile }>('/users/profile'),

  updateProfile: (body: Partial<UserProfile>) =>
    put<{ success: boolean; user: UserProfile }>('/users/profile', body),

  updatePassword: (body: { currentPassword: string; newPassword: string }) =>
    put<{ success: boolean; message: string }>('/users/password', body),

  getWishlist: () => get<{ success: boolean; wishlist: WishlistItem[] }>('/users/wishlist'),

  toggleWishlist: (productId: string) =>
    post<{ success: boolean; inWishlist: boolean; message: string }>(`/users/wishlist/${productId}`, {}),

  getAddresses: () => get<{ success: boolean; addresses: Address[] }>('/users/addresses'),

  addAddress: (body: Omit<Address, '_id'>) =>
    post<{ success: boolean; addresses: Address[] }>('/users/addresses', body),

  updateAddress: (id: string, body: Partial<Address>) =>
    put<{ success: boolean; addresses: Address[] }>(`/users/addresses/${id}`, body),

  deleteAddress: (id: string) =>
    del<{ success: boolean; addresses: Address[] }>(`/users/addresses/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export interface ApiProduct {
  _id: string
  slug: string
  name: string
  nameEn: string
  category: string
  price: number
  comparePrice?: number
  rating: number
  reviewCount: number
  stock: number
  sold: number
  images: string[]
  description: string
  features: string[]
  specs: Record<string, string>
  badge?: { label: string; color: string }
  isBestSeller: boolean
  isFeatured: boolean
  isNew: boolean
}

export interface ProductsResponse {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  products: ApiProduct[]
}

export const products = {
  list: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return get<ProductsResponse>(`/products${qs ? `?${qs}` : ''}`)
  },
  get: (slug: string) => get<{ success: boolean; product: ApiProduct }>(`/products/${slug}`),
  featured:    () => get<{ success: boolean; products: ApiProduct[] }>('/products/featured'),
  bestsellers: () => get<{ success: boolean; products: ApiProduct[] }>('/products/bestsellers'),
  newArrivals: () => get<{ success: boolean; products: ApiProduct[] }>('/products/new-arrivals'),
  byCategory:  (slug: string, params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return get<ProductsResponse>(`/products/category/${slug}${qs ? `?${qs}` : ''}`)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export interface OrderItem {
  productId: string
  name: string
  price: number
  qty: number
  image: string
}

export interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  shippingAddress: { address: string; city: string; postal?: string; notes?: string }
  paymentMethod: string
  couponCode?: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: string
  statusHistory: { status: string; note?: string; timestamp: string }[]
  createdAt: string
  isPaid: boolean
  guestInfo?: { firstName: string; lastName: string; phone: string; email?: string }
}

export interface CreateOrderBody {
  items: { productId: string; qty: number }[]
  shippingAddress: { address: string; city: string; postal?: string; notes?: string }
  paymentMethod: string
  couponCode?: string
  guestInfo?: { firstName: string; lastName: string; phone: string; email?: string }
}

export const orders = {
  create: (body: CreateOrderBody) =>
    post<{ success: boolean; order: Order }>('/orders', body),

  list: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return get<{ success: boolean; orders: Order[]; total: number; pages: number }>(`/orders${qs ? `?${qs}` : ''}`)
  },

  get: (id: string) => get<{ success: boolean; order: Order }>(`/orders/${id}`),

  cancel: (id: string, reason?: string) =>
    put<{ success: boolean; order: Order }>(`/orders/${id}/cancel`, { cancelReason: reason }),

  stats: () => get<{ success: boolean; stats: Record<string, number> }>('/orders/stats'),
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────────────────────────────
export const coupons = {
  validate: (code: string, orderAmount: number) =>
    post<{
      success: boolean
      valid: boolean
      discountType?: 'percentage' | 'fixed'
      discountValue?: number
      message: string
      discountAmount?: number
    }>('/coupons/validate', { code, orderAmount }),
}
