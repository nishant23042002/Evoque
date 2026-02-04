import { useEffect, useState } from "react";
import Product from "@/types/ProductTypes";

export function useProductPageData(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [sameCategory, setSameCategory] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        let timer: NodeJS.Timeout;

        const fetchAll = async () => {
            try {
                const productRes = await fetch(`/api/products/${slug}`);
                const productData = await productRes.json();
                setProduct(productData);

                const [recRes, sameRes] = await Promise.all([
                    fetch(`/api/products/${slug}/recommendations`),
                    fetch(`/api/products/${slug}/same-category`),
                ]);

                const recData = await recRes.json();
                const sameData = await sameRes.json();

                setRecommendations(recData.recommendations || []);
                setSameCategory(sameData.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                timer = setTimeout(() => setLoading(false), 800);
            }
        };

        fetchAll();
        return () => clearTimeout(timer);
    }, [slug]);

    return { product, recommendations, sameCategory, loading };
}
