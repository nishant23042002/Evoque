"use client";

import { useEffect, useState } from "react";
import { SearchProduct } from "@/types/ProductTypes";

export function useProductSearch(query: string) {
    const [products, setProducts] = useState<SearchProduct[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setProducts([]);
            return;
        }

        const controller = new AbortController();

        async function fetchProducts() {
            setLoading(true);

            try {
                const res = await fetch(
                    `/api/products/search?q=${encodeURIComponent(query)}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    setProducts([]);
                    return;
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }

            } catch (err: unknown) {
                // 🔥 Ignore AbortError (normal behavior)
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();

        return () => {
            controller.abort();
        };
    }, [query]);

    return { products, loading };
}