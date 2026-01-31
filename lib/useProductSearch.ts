"use client";

import { useEffect, useState } from "react";
import Product from "@/types/ProductTypes";

export function useProductSearch(query: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setProducts([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/products/search?q=${encodeURIComponent(query)}`
                );
                const data = await res.json();
                setProducts(data.products || []);
            } catch (err) {
                console.error("Search failed", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { products, loading };
}
