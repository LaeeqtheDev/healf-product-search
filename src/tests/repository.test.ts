import { describe, it, expect } from "vitest";
import { InMemoryProductRepository } from "@/lib/data/in-memory-product-repository";
import type { ProductSearchParams } from "@/lib/types";
import { FIXTURE } from "./fixtures";

const repo = new InMemoryProductRepository(FIXTURE);

function params(overrides: Partial<ProductSearchParams> = {}): ProductSearchParams {
    return {
        query: "",
        vendor: null,
        minPrice: null,
        maxPrice: null,
        availability: "all",
        sort: "relevance",
        page: 1,
        pageSize: 24,
        ...overrides,
    };
}

describe("search", () => {
    it("matches title case-intensively and partially", async () => {
        const res = await repo.search(params({ query: "magn" }));
        const titles = res.data.map((p) => p.title);

        expect(titles).toContain("Magnesium Glycinate")
        expect(titles).toContain("Daily Greens");
        expect(res.pagination.totalItems).toBe(2);
    });

    it("ranks the title matches above description", async () => {
        const res = await repo.search(params({ query: "magnesium" }));
        expect(res.data[0]?.title).toBe("Magnesium Glycinate");
    });

    it("uses AND semantics across multiple words", async () => {
        const res = await repo.search(params({ query: "vitamin c" }));
        expect(res.data.map((p) => p.id)).toEqual(["3"])
    })

    it("returns everything for empty query", async () => {
        const res = await repo.search(params({ query: "" }));
        expect(res.pagination.totalItems).toBe(FIXTURE.length);
    });

});



describe("filters", () => {
    it("filters by vendor", async () => {
        const res = await repo.search(params({ vendor: "Thorne" }));
        expect(res.data.every((p) => p.vendor === "Thorne")).toBe(true);
        expect(res.pagination.totalItems).toBe(2);
    });

    it("filters by price range", async () => {
        const res = await repo.search(params({ minPrice: 10, maxPrice: 30 }));
        expect(res.data.map((p) => p.id).sort()).toEqual(["1", "2"]);
    });

    it("filters by availability", async () => {
        const inStock = await repo.search(params({ availability: "in_stock" }));
        expect(inStock.data.every((p) => p.available)).toBe(true);
        const oos = await repo.search(params({ availability: "out_of_stock" }));
        expect(oos.data.map((p) => p.id)).toEqual(["4"]);
    });
});



describe("sort", () => {
    it("sorts price ascending and descending", async () => {
        const asc = await repo.search(params({ sort: "price_asc" }));
        expect(asc.data.map((p) => p.price)).toEqual([8, 12, 20, 35, 45]);
        const desc = await repo.search(params({ sort: "price_desc" }));
        expect(desc.data.map((p) => p.price)).toEqual([45, 35, 20, 12, 8]);
    });

    it("sorts by title A-Z", async () => {
        const res = await repo.search(params({ sort: "title_asc" }));
        expect(res.data[0]?.title).toBe("Daily Greens");
    });
});

describe("facets", () => {
    it("reports vendor counts and price bounds", async () => {
      const facets = await repo.getFacets();
      expect(facets.totalProducts).toBe(5);
      expect(facets.priceBounds).toEqual({ min: 8, max: 45 });
      const thorne = facets.vendors.find((v) => v.value === "Thorne");
      expect(thorne?.count).toBe(2);
    });
  });



  describe("pagination", () => {
    it("paginates and reports honest metadata", async () => {
      const res = await repo.search(params({ pageSize: 2, page: 1 }));
      expect(res.data).toHaveLength(2);
      expect(res.pagination).toMatchObject({
        page: 1,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });
  
    it("clamps out-of-range pages to the last page", async () => {
      const res = await repo.search(params({ pageSize: 2, page: 99 }));
      expect(res.pagination.page).toBe(3);
      expect(res.data).toHaveLength(1);
    });
  });
  
