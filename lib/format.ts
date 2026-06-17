// Arabic-Indic numeral conversion
const AR = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']

export function toArabicNumerals(n: number | string): string {
  return String(n).replace(/\d/g, d => AR[+d])
}

export function formatPrice(price: number): string {
  const formatted = price.toFixed(2)
  return toArabicNumerals(formatted) + ' ر.س'
}

export function formatCount(n: number): string {
  return toArabicNumerals(n.toLocaleString('en'))
}

export function formatDiscount(original: number, sale: number): string {
  const pct = Math.round((1 - sale / original) * 100)
  return '-' + toArabicNumerals(pct) + '٪'
}
