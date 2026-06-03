import { useEffect, useState } from "react";
import type { ApiError, ProductSearchResponse } from "@/lib/types";

interface SearchState {
  data: ProductSearchResponse | null;
  isLoading: boolean;
  error: string | null;
}

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ApiError).error?.message === "string"
  );
}


export function useProductSearch(
  queryString: string,
  reloadToken = 0,
): SearchState {
  const [state, setState] = useState<SearchState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetch(`/api/products?${queryString}`, { signal: controller.signal })
      .then(async (res) => {
        const body: unknown = await res.json();
        if (!res.ok) {
          const message = isApiError(body)
            ? body.error.message
            : `Request failed (${res.status})`;
          throw new Error(message);
        }
        return body as ProductSearchResponse;
      })
      .then((data) => {
        setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        // An abort is expected and not an error worth surfacing.
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
      });

    return () => controller.abort();
  }, [queryString, reloadToken]);

  return state;
}
