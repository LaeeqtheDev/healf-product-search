import type { AvailabilityFilter, SortOption } from "@/lib/types";

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  title_asc: "Name: A–Z",
};

const AVAILABILITY_LABELS: Record<AvailabilityFilter, string> = {
  all: "All",
  in_stock: "In stock",
  out_of_stock: "Out of stock",
};

const fieldClass =
  "w-full rounded-md border border-sage-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-sage-600 focus:ring-2 focus:ring-sage-600/20";

export default function Filters() {
  return (
    <aside className="space-y-5 rounded-lg border border-sage-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Filters</h2>

        <button
          type="button"
          className="text-xs text-sage-600 underline-offset-2 hover:text-ink hover:underline"
        >
          Clear all
        </button>
      </div>

      <Field label="Sort By">
        <select className={fieldClass} defaultValue="relevance">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Brand">
        <select className={fieldClass} defaultValue="">
          <option value="">All Brands</option>
          <option value="thorne">Thorne</option>
          <option value="nordic-naturals">Nordic Naturals</option>
          <option value="healf">Healf</option>
        </select>
      </Field>

      <Field label="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className={fieldClass}
            aria-label="Minimum price"
          />

          <span className="text-sage-600">–</span>

          <input
            type="number"
            placeholder="Max"
            className={fieldClass}
            aria-label="Maximum price"
          />
        </div>
      </Field>

      <Field label="Availability">
        <div className="flex flex-col gap-1.5">
          {(Object.keys(AVAILABILITY_LABELS) as AvailabilityFilter[]).map(
            (option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="radio"
                  name="availability"
                  defaultChecked={option === "all"}
                  className="accent-sage-600"
                />
                {AVAILABILITY_LABELS[option]}
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