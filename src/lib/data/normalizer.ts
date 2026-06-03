import type { Product, ProductStatus } from "@/lib/types";
export type RawRow = Record<string, string | undefined>;

const VALID_STATUSES: ReadonlySet<string> = new Set([
  "ACTIVE",
  "ARCHIVED",
  "DRAFT",
]);


interface RawPriceRange {
  min_variant_price?: { amount?: number | string; currency_code?: string };
  max_variant_price?: { amount?: number | string; currency_code?: string };
}


interface RawImage {
  url?: string | null;
  alt_text?: string | null;
}

function parseJsonObject<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as T) : null;
  } catch {
    return null;
  }
}

function toNumber(value: number | string | undefined | null): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}


function toPlainText(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function toStatus(value: string | undefined): ProductStatus | null {
  if (value && VALID_STATUSES.has(value)) return value as ProductStatus;
  return null;
}


export function rawRowToProduct(row: RawRow): Product | null {
  const id = row.ID?.trim();
  const title = row.TITLE?.trim();
  if (!id || !title) return null;

  const status = toStatus(row.STATUS);
  if (status !== "ACTIVE") return null;

  const priceRange = parseJsonObject<RawPriceRange>(row.PRICE_RANGE_V2);
  const minPrice = toNumber(priceRange?.min_variant_price?.amount) ?? 0;
  const maxPrice = toNumber(priceRange?.max_variant_price?.amount) ?? minPrice;
  const currency =
    priceRange?.min_variant_price?.currency_code ??
    priceRange?.max_variant_price?.currency_code ??
    "GBP";

  const image = parseJsonObject<RawImage>(row.FEATURED_IMAGE);
  const totalInventory = toNumber(row.TOTAL_INVENTORY) ?? 0;

  return {
    id,
    title,
    vendor: row.VENDOR?.trim() || "Unknown",
    productType: row.PRODUCT_TYPE?.trim() || "",
    description: toPlainText(row.DESCRIPTION),
    handle: row.HANDLE?.trim() || "",
    status,
    price: minPrice,
    maxPrice,
    currency,
    available: totalInventory > 0,
    totalInventory,
    imageUrl: image?.url ?? null,
    imageAlt: image?.alt_text ?? null,
    tags: parseTags(row.TAGS),
  };
}
