import {z} from 'zod'
import { ProductSearchParams } from '../types';

const MAX_PAGE_SIZE=100;
const DefaultPageSize=20;

export const SearchParamsSchema = z.object({
    q: z.string().trim().default(""),
    vendor: z.string().trim().optional().transform((v) => (v && v.length > 0 ? v : null)),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    availability: z.enum(["in_stock", "out_of_stock", "all"]).default("all"),
    sort: z.enum(["relevance", "price_asc", "price_desc","title_asc"]).default("relevance"),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(DefaultPageSize),
})



export type ParseResult =
  | { ok: true; params: ProductSearchParams }
  | { ok: false; issues: z.ZodIssue[] };


  export function parseSearchParams( search: URLSearchParams): ParseResult {
    const raw = Object.fromEntries(search.entries());
    const result = SearchParamsSchema.safeParse(raw);

    if(!result.success){
        return {ok: false, issues: result.error.issues}
    }

    const v =result.data;

    let { minPrice, maxPrice } = v;
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  return {
    ok: true,
    params: {
      query: v.q,
      vendor: v.vendor ?? null,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null,
      availability: v.availability,
      sort: v.sort,
      page: v.page,
      pageSize: v.pageSize,
    },
  };
}