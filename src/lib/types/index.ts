
export type ProductStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export interface Product {
    id: string;
    title: string;
    vendor: string;
    productType: string;
    description: string;
    handle: string;
    status: ProductStatus;
    price: number;
    maxPrice: number;
    currency: string;
    available: boolean;
    totalInventory: number;
    imageUrl: string | null;
    imageAlt: string | null;
    tags: string[];
  }

  export type AvailabilityFilter = "all" | "in_stock" | "out_of_stock";



  export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "title_asc";


  export interface ProductSearchParams {
    query: string;
    vendor: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    availability: AvailabilityFilter;
    sort: SortOption;
    page: number;
    pageSize: number;
  }
  

  export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }


  export interface ProductSearchResponse {
    data: Product[];
    pagination: PaginationMeta;
    appliedParams: ProductSearchParams;
  }
  
  export interface FacetValue {
    value: string;
    count: number;
  }
  

  export interface FacetsResponse {
    vendors: FacetValue[];
    priceBounds: { min: number; max: number };
    currency: string;
    totalProducts: number;
  }
  
  export interface ApiError {
    error: { message: string; details?: unknown };
  }
  