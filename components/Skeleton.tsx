export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-primary-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-primary-100 rounded-full w-3/4" />
        <div className="h-3 bg-primary-100 rounded-full w-1/2" />
        <div className="h-5 bg-primary-100 rounded-full w-1/3" />
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden animate-pulse">
      <div className="aspect-video bg-primary-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-primary-100 rounded-full w-1/4" />
        <div className="h-4 bg-primary-100 rounded-full w-full" />
        <div className="h-4 bg-primary-100 rounded-full w-3/4" />
        <div className="h-3 bg-primary-100 rounded-full w-1/2" />
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-primary-100 rounded-full w-48 mb-2" />
      <div className="h-4 bg-primary-100 rounded-full w-32" />
    </div>
  )
}
