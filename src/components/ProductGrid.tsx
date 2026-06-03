import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";


export function ProductGrid({
  products,
  dimmed,
}: {
  products: Product[];
  dimmed: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 ${
        dimmed ? "opacity-50" : "opacity-100"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
