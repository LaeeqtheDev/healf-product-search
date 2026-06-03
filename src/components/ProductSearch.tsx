"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AvailabilityFilter, SortOption } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useFacets } from "@/hooks/useFacets";
import { SearchBar } from "./SearchBar";
import { Filters, EMPTY_FILTERS, type FilterState } from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { LoadingGrid, ErrorState, EmptyState } from "./states";

const AVAILABILITY_VALUES: ReadonlySet<string> = new Set([
  "all",
  "in_stock",
  "out_of_stock",
]);
const SORT_VALUES: ReadonlySet<string> = new Set([
  "relevance",
  "price_asc",
  "price_desc",
  "title_asc",
]);


function buildQueryString(
  filters: FilterState,
  query: string,
  page: number,
): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (filters.vendor) params.set("vendor", filters.vendor);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.availability !== "all")
    params.set("availability", filters.availability);
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

export function ProductSearch(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  const [filters, setFilters] = useState<FilterState>(() => {
    const availabilityRaw = searchParams.get("availability") ?? "all";
    const sortRaw = searchParams.get("sort") ?? "relevance";
    return {
      q: searchParams.get("q") ?? "",
      vendor: searchParams.get("vendor") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      availability: (AVAILABILITY_VALUES.has(availabilityRaw)
        ? availabilityRaw
        : "all") as AvailabilityFilter,
      sort: (SORT_VALUES.has(sortRaw) ? sortRaw : "relevance") as SortOption,
    };
  });
  const [page, setPage] = useState<number>(() => {
    const p = Number(searchParams.get("page"));
    return Number.isInteger(p) && p > 0 ? p : 1;
  });

  // Debounce only the text query (300ms); other filters apply immediately.
  const debouncedQuery = useDebouncedValue(filters.q, 300);

  const queryString = useMemo(
    () => buildQueryString(filters, debouncedQuery, page),
    [filters, debouncedQuery, page],
  );

  // Keep the URL in sync with the active search (no scroll jump, no history spam).
  useEffect(() => {
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  }, [queryString, pathname, router]);

  const { facets } = useFacets();
  const [reloadToken, setReloadToken] = useState(0);
  const { data, isLoading, error } = useProductSearch(queryString, reloadToken);

 
  const handleQueryChange = (q: string): void => {
    setFilters((f) => ({ ...f, q }));
    setPage(1);
  };
  const handleFilterChange = (patch: Partial<FilterState>): void => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const handleReset = (): void => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const showInitialLoading = isLoading && !data;
  const products = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink">Healf</h1>
        <p className="text-sm text-sage-600">
          Search the wellness catalogue
          {facets ? ` · ${facets.totalProducts.toLocaleString()} products` : ""}
        </p>
      </header>

      <div className="mb-6">
        <SearchBar value={filters.q} onChange={handleQueryChange} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <Filters
          filters={filters}
          facets={facets}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section>
          {error ? (
            <ErrorState
              message={error}
              onRetry={() => setReloadToken((t) => t + 1)}
            />
          ) : showInitialLoading ? (
            <LoadingGrid />
          ) : products.length === 0 ? (
            <EmptyState query={debouncedQuery} />
          ) : (
            <div className="space-y-6">
              <ProductGrid products={products} dimmed={isLoading} />
              {data && (
                <Pagination
                  pagination={data.pagination}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
