import type { PaginationMeta } from "@/lib/types";


export function Pagination({pagination,onPageChange}: {pagination: PaginationMeta;onPageChange: (page: number) => void;}) {
  const { page, totalPages, hasNextPage, hasPreviousPage, totalItems } =
    pagination;

  if (totalItems === 0) return null;

  return (
    <nav
      className="flex items-center justify-between gap-4 pt-2"
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
        className="rounded-md border border-sage-100 bg-white px-4 py-2 text-sm font-medium text-ink transition enabled:hover:border-sage-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        â† Previous
      </button>

      <span className="text-sm text-sage-600">
        Page <span className="font-medium text-ink">{page}</span> of{" "}
        <span className="font-medium text-ink">{totalPages}</span>
        <span className="ml-2 hidden sm:inline">Â· {totalItems} results</span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="rounded-md border border-sage-100 bg-white px-4 py-2 text-sm font-medium text-ink transition enabled:hover:border-sage-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next â†’
      </button>
    </nav>
  );
}
