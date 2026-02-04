import { useMemo } from "react";
import Product from "@/types/ProductTypes";
import { sizeScaleMap } from "@/constants/productSizes";

export function useProductVariants(
    product: Product | null,
    selectedColor: string | null
) {
    const activeVariant = useMemo(() => {
        if (!product) return null;
        return (
            product.variants.find(v => v.color.slug === selectedColor) ??
            product.variants[0]
        );
    }, [product, selectedColor]);

    const images = activeVariant?.color.images.map(i => i.url) ?? [];

    const colorVariants = useMemo(() => {
        if (!product) return [];
        return product.variants.map(v => ({
            slug: v.color.slug,
            name: v.color.name,
            image:
                v.color.images.find(img => img.isPrimary)?.url ||
                v.color.images[0]?.url,
        }));
    }, [product]);

    const sizes = useMemo(() => {
        if (!product || !activeVariant) return [];

        const scale = sizeScaleMap[product.category.sizeType.type] || [];
        const map = new Map(activeVariant.sizes.map(s => [s.size, s]));

        return scale.map(size => {
            const variant = map.get(size);
            return {
                size,
                variant,
                exists: !!variant,
                inStock: variant ? variant.stock > 0 : false,
                isAvailable: variant ? variant.isAvailable : false,
            };
        });
    }, [product, activeVariant]);

    return { activeVariant, images, colorVariants, sizes };
}
