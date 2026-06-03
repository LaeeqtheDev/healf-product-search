import type {
    FacetValue, FacetsResponse, Product, ProductSearchParams, ProductSearchResponse} from "@/lib/types";
  import type { ProductRepository } from "./product-repository";
  import {
    scoreProduct,toIndexed, tokenize,type IndexedProduct} from "@/lib/search/search";

  interface ScoredProduct {
    product: Product;
    score: number;
  }
  

  export class InMemoryProductRepository implements ProductRepository {
    private readonly index: readonly IndexedProduct[];
    private readonly facets: FacetsResponse;
  
    constructor(products: readonly Product[]) {
      this.index = products.map(toIndexed);
      this.facets = this.buildFacets(products);
    }
  
    async search(params: ProductSearchParams): Promise<ProductSearchResponse> {
      const tokens = tokenize(params.query);

      const matched: ScoredProduct[] = [];
      for (const item of this.index) {
        const score = scoreProduct(item, tokens);
        if (score === 0) continue; // failed the text query
        if (!this.passesFilters(item.product, params)) continue;
        matched.push({ product: item.product, score });
      }
  
      this.sort(matched, params.sort);
  

      const totalItems = matched.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));
      const page = Math.min(Math.max(1, params.page), totalPages);
      const start = (page - 1) * params.pageSize;
      const data = matched
        .slice(start, start + params.pageSize)
        .map((m) => m.product);
  
      return {
        data,
        pagination: {
          page,
          pageSize: params.pageSize,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        appliedParams: { ...params, page },
      };
    }
  
    async getFacets(): Promise<FacetsResponse> {
      return this.facets;
    }
  
    private passesFilters(product: Product, params: ProductSearchParams): boolean {
      if (params.vendor && product.vendor !== params.vendor) return false;
      if (params.minPrice !== null && product.price < params.minPrice) return false;
      if (params.maxPrice !== null && product.price > params.maxPrice) return false;
      if (params.availability === "in_stock" && !product.available) return false;
      if (params.availability === "out_of_stock" && product.available) return false;
      return true;
    }
  
    private sort(items: ScoredProduct[], sort: ProductSearchParams["sort"]): void {
      switch (sort) {
        case "price_asc":
          items.sort((a, b) => a.product.price - b.product.price);
          break;
        case "price_desc":
          items.sort((a, b) => b.product.price - a.product.price);
          break;
        case "title_asc":
          items.sort((a, b) => a.product.title.localeCompare(b.product.title));
          break;
        case "relevance":
        default:
          items.sort(
            (a, b) =>
              b.score - a.score || a.product.title.localeCompare(b.product.title),
          );
          break;
      }
    }
  
    private buildFacets(products: readonly Product[]): FacetsResponse {
      const vendorCounts = new Map<string, number>();
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      let currency = "GBP";
  
      for (const p of products) {
        vendorCounts.set(p.vendor, (vendorCounts.get(p.vendor) ?? 0) + 1);
        if (p.price < min) min = p.price;
        if (p.price > max) max = p.price;
        currency = p.currency;
      }
  
      const vendors: FacetValue[] = [...vendorCounts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  
      return {
        vendors,
        priceBounds: {
          min: Number.isFinite(min) ? min : 0,
          max: Number.isFinite(max) ? max : 0,
        },
        currency,
        totalProducts: products.length,
      };
    }
  }
  