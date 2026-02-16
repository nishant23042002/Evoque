"use client"

import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import Product from "@/types/ProductTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const NewArrivals = () => {
    const { data, isLoading } = useQuery<{ products: Product[] }>({
        queryKey: ["new-arrivals"],
        queryFn: async () => {
            const res = await axios.get("/api/products?newArrival=true");
            return res.data;
        },
    });

    if (isLoading) return <p>Loading...</p>;


    return (
        <div>
            <div className="mx-3 py-6 text-5xl flex max-lg:flex-col pb-2  lg:justify-between lg:items-center text-(--linen-800) font-semibold tracking-tight">
                <h1 className="text-2xl uppercase sm:text-5xl tracking-wider font-bold">
                    New Arrivals
                </h1>
            </div>
            <ProductMasonryGrid
                products={data?.products ?? []}
                showHeading={false}
            />
        </div>
    )
}

export default NewArrivals;