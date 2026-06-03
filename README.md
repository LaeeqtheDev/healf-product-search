# Healf Product Search

## Architecture decisions

**Data layer:** CSV is parsed on first request and cached in memory for the 
process lifetime. Two concurrent cold-start requests share one parse promise 
so the file is never read twice.

**Search:** Server-side only. The client never touches the CSV. Partial, 
case-insensitive matching across title, description, and vendor with title 
matches ranked above description matches.

**Repository pattern:** All search/filter logic lives in 
`InMemoryProductRepository`. The API route only handles HTTP concerns. 
Swapping the data source (e.g. Shopify GraphQL) means writing one new class.

**Params validation:** Zod schema validates and coerces all query parameters 
before they reach the repository. Invalid inputs return 400 with structured 
error details.

## What I left out

- Fuzzy matching — substring matching covers the use case without the 
  complexity. Would revisit with user feedback.
- Auth — not in scope for a public catalogue.

## What I'd do differently with more time

Pre-compute the CSV to JSON at build time to eliminate the 2-3s cold start. 
At 500k products the in-memory approach breaks entirely — I'd move to 
Postgres with a GIN index or Typesense.