import type { FacetsResponse, ProductSearchParams, ProductSearchResponse } from "@/lib/types";
import { getProducts } from "./csv-loader";
import { InMemoryProductRepository } from "./in-memory-product-repository";


export interface ProductRepository {
  search(params: ProductSearchParams): Promise<ProductSearchResponse>;
  getFacets(): Promise<FacetsResponse>;
}

let repositoryPromise: Promise<ProductRepository> | null = null;


export function getProductRepository(): Promise<ProductRepository> {
  if (!repositoryPromise) {
    repositoryPromise = getProducts()
      .then((products) => new InMemoryProductRepository(products))
      .catch((err) => {
        repositoryPromise = null;
        throw err;
      });
  }
  return repositoryPromise;
}
