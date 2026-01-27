import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/types/ProductTypes";

interface ProductsResponse {
    products: Product[];
}

export function useProducts(category: string) {
    return useQuery<Product[]>({
        queryKey: ["products", category],
        queryFn: async () => {
            const { data } = await axios.get<ProductsResponse>("/api/products", {
                params: {
                    category: category !== "all" ? category : undefined,
                },
            });

            return data.products; // ✅ ARRAY GUARANTEED
        },
        placeholderData: (previousData) => previousData,
    });
}
