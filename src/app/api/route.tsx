
import { NextResponse } from "next/server";
import { parseSearchParams } from "@/lib/api/params";
import { getProductRepository } from "@/lib/data/product-repository";
import type { ApiError, ProductSearchResponse } from "@/lib/types";


export async function GET(request: Request,): Promise<NextResponse<ProductSearchResponse | ApiError>> {
  const { searchParams } = new URL(request.url);

  const parsed = parseSearchParams(searchParams);
  if (!parsed.ok) {
    return NextResponse.json<ApiError>(
      { error: { message: "Invalid query parameters", details: parsed.issues } },
      { status: 400 },
    );
  }

  try {
    const repository = await getProductRepository();
    const result = await repository.search(parsed.params);

    return NextResponse.json<ProductSearchResponse>(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[/api/products] search failed:", err);
    return NextResponse.json<ApiError>(
      { error: { message: "Failed to load products" } },
      { status: 500 },
    );
  }
}
