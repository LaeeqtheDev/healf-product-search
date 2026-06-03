import { NextResponse } from "next/server";
import { getProductRepository } from "@/lib/data/product-repository";
import {ApiError, FacetsResponse} from "@/lib/types";

export async function GET(): Promise<NextResponse<FacetsResponse | ApiError>>{
    try {
        const repository = await getProductRepository();
        const facets = await repository.getFacets();

        return NextResponse.json<FacetsResponse>(facets, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-max-age=3600, stale-while-revalidate=86400", // Cache for 1 hour
            }
        })
        
    } catch (error) {
        console.error("/api/products/facets error:", error);
        return NextResponse.json<ApiError>(
            {error: {message: "Failed to load Facets"}},
            {status: 500}
,        )
    }
}