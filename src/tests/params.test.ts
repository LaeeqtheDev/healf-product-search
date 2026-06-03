import {describe, expect, it} from 'vitest';
import { parseSearchParams } from '@/lib/api/params';

function parse(Object: Record<string, string>){
    return parseSearchParams(new URLSearchParams(Object))
}


describe("parseSearchParams", () => {
    it("applies default values for empty strings", () => {
        const result = parse({})
        expect(result.ok).toBe(true)
        if(result.ok){
            expect(result.params).toMatchObject({
                query: "",
                vendor: null,
                availability: "all",
                sort: "relevance",
                page: 1,
                pageSize: 24,
            })
        }
    });


    it("coerces numeric strings", () => {
        const result = parse({ minPrice: "10", maxPrice: "50", page: "3" });
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.params.minPrice).toBe(10);
          expect(result.params.maxPrice).toBe(50);
          expect(result.params.page).toBe(3);
        }
      });


  it("rejects invalid page values", () => {
    expect(parse({ page: "-1" }).ok).toBe(false);
    expect(parse({ page: "abc" }).ok).toBe(false);
    expect(parse({ page: "0" }).ok).toBe(false);
  });

  it("rejects invalid enum values", () => {
    expect(parse({sort: "cheapest"}).ok).toBe(false);
    expect(parse({availability: "maybe"}).ok).toBe(false);
  });

  
  it("caps pageSize at 100", () => {
    expect(parse({ pageSize: "5000" }).ok).toBe(false);
  });

  it("swaps min/max price when given backwards", () => {
    const result = parse({ minPrice: "100", maxPrice: "10" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.params.minPrice).toBe(10);
      expect(result.params.maxPrice).toBe(100);
    }
  });


})