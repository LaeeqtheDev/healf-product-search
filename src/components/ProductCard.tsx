import type { Product } from "@/lib/types";
import { formatPriceRange } from "@/lib/format";

export function ProductCard({ product }: { product: Product }): React.ReactElement {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-sage-100 bg-white transition hover:border-sage-600/40 hover:shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-sage-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-sage-600">
            No image
          </div>
        )}
        {!product.available && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-medium text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] uppercase tracking-wide text-sage-600">
          {product.vendor}
        </p>
        <h3 className="mb-2 mt-0.5 line-clamp-2 text-sm font-medium text-ink">
          {product.title}
        </h3>
        <p className="mt-auto font-serif text-base text-ink">
          {formatPriceRange(product.price, product.maxPrice, product.currency)}
        </p>
      </div>
    </article>
  );
}
