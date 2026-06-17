export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden animate-pulse h-full flex flex-col">
      <div className="aspect-square bg-primary-100" />
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="h-2.5 bg-primary-100 rounded-full w-1/3" />
        <div className="h-3.5 bg-primary-100 rounded-full w-4/5" />
        <div className="h-3 bg-primary-100 rounded-full w-2/3" />
        <div className="h-4 bg-primary-100 rounded-full w-1/2 mt-1" />
        <div className="h-10 bg-primary-100 rounded-xl mt-auto" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
