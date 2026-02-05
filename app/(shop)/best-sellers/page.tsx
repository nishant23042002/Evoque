"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import LayerLogo from "@/components/FlashLogo/LayerLogo";
import Product from "@/types/ProductTypes";

export default function BestSellersPage() {
    const { data, isLoading } = useQuery<{ products: Product[] }>({
        queryKey: ["best-sellers"],
        queryFn: async () => {
            const { data } = await axios.get("/api/products/best-sellers");
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <LayerLogo />
            </div>
        );
    }

    if (!data?.products.length) {
        return (
            <p className="text-center text-sm text-muted">
                No best sellers yet
            </p>
        );
    }

    return (
        <section className="px-1 sm:px-2">
            <h1 className="text-xl font-bold mb-1 sm:mb-2">Best Sellers</h1>
            <ProductMasonryGrid
                products={data.products}
                showHeading={false}
            />
        </section>
    );
}
