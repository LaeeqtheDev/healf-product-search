import type {
  AvailabilityFilter,
  FacetsResponse,
  SortOption,
} from "@/lib/types";

/**
 * UI filter state. Prices are kept as strings because that's what the inputs
 * hold (and "" cleanly means "unset"); they're converted to numbers only when
 * the query string is built. Keeping this as the single shape passed around
 * makes URL-sync and reset trivial.
 */
export interface FilterState {
  q: string;
  vendor: string; // "" = all vendors
  minPrice: string;
  maxPrice: string;
  availability: AvailabilityFilter;
  sort: SortOption;
}

export const EMPTY_FILTERS: FilterState = {
  q: "",
  vendor: "",
  minPrice: "",
  maxPrice: "",
  availability: "all",
  sort: "relevance",
};

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  title_asc: "Name: Aâ€“Z",
};

const AVAILABILITY_LABELS: Record<AvailabilityFilter, string> = {
  all: "All",
  in_stock: "In stock",
  out_of_stock: "Out of stock",
};

const fieldClass =
  "w-full rounded-md border border-sage-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-sage-600 focus:ring-2 focus:ring-sage-600/20";

export function Filters({filters,facets,onChange,onReset,}: {filters: FilterState;facets: FacetsResponse | null; onChange: (patch: Partial<FilterState>) => void;onReset: () => void;}){
  return (
    <aside className="space-y-5 rounded-lg border border-sage-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Filters</h2>
        <button
          onClick={onReset}
          className="text-xs text-sage-600 underline-offset-2 hover:text-ink hover:underline"
        >
          Clear all
        </button>
      </div>

      <Field label="Sort by">
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className={fieldClass}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <option key={opt} value={opt}>
              {SORT_LABELS[opt]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Brand">
        <select
          value={filters.vendor}
          onChange={(e) => onChange({ vendor: e.target.value })}
          className={fieldClass}
        >
          <option value="">All brands</option>
          {facets?.vendors.map((v) => (
            <option key={v.value} value={v.value}>
              {v.value} ({v.count})
            </option>
          ))}
        </select>
      </Field>

      <Field label="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={facets ? String(Math.floor(facets.priceBounds.min)) : "Min"}
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className={fieldClass}
            aria-label="Minimum price"
          />
          <span className="text-sage-600">â€“</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={facets ? String(Math.ceil(facets.priceBounds.max)) : "Max"}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className={fieldClass}
            aria-label="Maximum price"
          />
        </div>
      </Field>

      <Field label="Availability">
        <div className="flex flex-col gap-1.5">
          {(Object.keys(AVAILABILITY_LABELS) as AvailabilityFilter[]).map(
            (opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === opt}
                  onChange={() => onChange({ availability: opt })}
                  className="accent-sage-600"
                />
                {AVAILABILITY_LABELS[opt]}
              </label>
            ),
          )}
        </div>
      </Field>
    </aside>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-sage-600">
        {label}
      </label>
      {children}
    </div>
  );
}
