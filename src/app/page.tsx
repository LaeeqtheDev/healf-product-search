import ProductSearch from "@/components/ProductSearch";
import { Suspense } from "react";

export default function Home() {
  return (
  <Suspense fallback={
    <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-sage-600">
      Loading…
    </div>
  }>
    <ProductSearch/>

  </Suspense>
  );
}
