# Healf Product Search

A Next.js product search and filtering experience backed by a 4,607-product CSV dataset.

**Live demo:** https://healf-product-search.vercel.app

---

## Architecture decisions

### Data layer
The CSV is parsed on first request and cached in memory for the process lifetime via a module-level singleton promise. Two concurrent cold-start requests share the same promise — the file is never read twice. This is a deliberate trade-off: simple to reason about, zero infrastructure, acceptable for a catalogue this size.

### Search
All search logic runs server-side. The client never loads or queries the CSV directly. Search supports partial, case-insensitive matching across title, description, and vendor. Results are ranked by relevance — title matches score higher than description matches — so searching "magnesium" surfaces "Magnesium Glycinate" above products that only mention it in their description.

### Repository pattern
All search, filter, sort, and pagination logic lives in `InMemoryProductRepository`. The API route only handles HTTP concerns: parsing and validating params, setting cache headers, and mapping errors to status codes. Swapping the data source for Shopify's GraphQL API means implementing one new class that satisfies the `ProductRepository` interface — no changes to the route or frontend.

### Params validation
A Zod schema validates and coerces every query parameter before it reaches the repository. Invalid inputs return a structured 400 with field-level error details. Min/max price is automatically swapped if given in the wrong order.

### Caching
- **Server:** The parsed product catalogue is cached in memory for the process lifetime. The `/api/products/facets` route sets `Cache-Control: s-maxage=3600` since facets rarely change.
- **Products route:** `s-maxage=60, stale-while-revalidate=300` — results stay fresh enough for a product catalogue without hammering the server.
- **Frontend:** React state acts as a client-side cache. Facets are fetched once on mount and never re-fetched.

---

## What I left out

- **Fuzzy matching** — substring matching covers the use case without the added complexity and bundle size of a library like Fuse.js. Would revisit based on user feedback on search quality.
- **Auth** — not in scope for a public catalogue.
- **Cursor-based pagination** — page-based pagination is simpler and sufficient here. Cursor-based would matter if the dataset were changing in real time.

---

## What breaks at 500,000 products

The in-memory approach has three failure points at scale:

1. **Memory** — 500k products at ~1KB each is 500MB per process instance. Not viable.
2. **Cold start** — parsing a 500MB CSV on first request would time out on serverless.
3. **Search performance** — linear scan across 500k products for every request becomes a bottleneck.

The fix: move to Postgres with a `tsvector` GIN index for full-text search, or Typesense/Algolia for relevance-ranked search. The repository pattern means this is a one-class change.

---

## What I'd do differently with more time

Pre-compute the CSV to JSON at build time to eliminate the 2-3s cold start on first request. The data doesn't change between deployments so there's no reason to parse it at runtime.