export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-sage-100 bg-white p-3">
          <div className="mb-3 aspect-square w-full rounded-md bg-sage-50" />
          <div className="mb-2 h-3 w-3/4 rounded bg-sage-50" />
          <div className="h-3 w-1/2 rounded bg-sage-50" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <p className="mb-1 font-medium text-red-800">Couldn&apos;t load products</p>
      <p className="mb-4 text-sm text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
      >
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-sage-100 bg-white p-12 text-center">
      <p className="mb-1 font-serif text-xl text-ink">No products found</p>
      <p className="text-sm text-sage-600">
        {query
          ? `Nothing matched \u201c${query}\u201d. Try a different term or clear your filters.`
          : "No products match the current filters. Try clearing them."}
      </p>
    </div>
  );
}