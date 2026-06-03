"use client";

import { useState } from "react";
import { SearchBar } from "./SearchBar";
import Filters from "./Filters";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";

export default function ProductSearch() {
  const [search, setSearch] = useState("");

  const products:any = [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-serif text-4xl text-ink">Healf</h1>

        <p className="text-sage-600">
          Search the wellness catalogue
        </p>
      </header>

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <Filters />
        </aside>

        <main className="space-y-6">
          {products.length === 0 ? (
            <div className="flex h-125 items-center justify-center rounded-lg border border-sage-100 bg-white">
              <p className="text-sage-600">
                Products with Product Card
              </p>
            </div>
          ) : (
            <>
              <ProductGrid
                products={products}
                dimmed={false}
              />

              <Pagination />
            </>
          )}
        </main>
      </div>
    </div>
  );
}