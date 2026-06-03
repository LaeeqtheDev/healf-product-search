import { FacetsResponse } from "@/lib/types";
import { use, useEffect, useState } from "react";

export function useFacets(): {facets: FacetsResponse | null; error: boolean}{
    const [facets, setFacets] = useState<FacetsResponse | null>(null)
    const [error, setError] = useState(false);


    useEffect(() => {
        let active = true;
        fetch("/api/products/facets").then((res) => {
            if(!res.ok){
                throw new Error("Failed to fetch facets")
            }
            return res.json() as Promise<FacetsResponse>
        }).then((data) => {
            if(active){
                setFacets(data)
            }
        }).catch((err) => {
            if(active) setError(true)
        });
    return () => {
        active = false;
    }
    },[])


    return {facets, error}
}