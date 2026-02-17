import { Variant } from "@/types/ProductTypes";
import Product from "@/types/ProductTypes";

/* ---------------- PRIMARY ---------------- */
export function getPrimaryImageFromVariant(variant?: Variant): string {
    if (!variant?.color?.images?.length)
        return "/images/placeholder-product.jpg";

    const primary =
        variant.color.images.find(img => img.isPrimary) ||
        variant.color.images.sort((a, b) => a.order - b.order)[0];

    return primary?.url || "/images/placeholder-product.jpg";
}

/* ---------------- SECONDARY / HOVER ---------------- */
export function getSecondaryImageFromVariant(
    variant?: Variant
): string | null {
    if (!variant?.color?.images?.length) return null;

    const images = variant.color.images;

    // 1. Prefer explicit hover image
    const hover = images
        .filter(img => img.isHover)
        .sort((a, b) => a.order - b.order)[0];

    if (hover) return hover.url;

    // 2. Fallback → first non-primary
    const nonPrimary = images.find(img => !img.isPrimary);
    if (nonPrimary) return nonPrimary.url;

    // 3. Fallback → second image
    if (images.length > 1) return images[1].url;

    return null;
}

/* ---------------- PRODUCT ---------------- */
export function getPrimaryImageFromProduct(product: Product): string {
    return (
        product.thumbnail ||
        getPrimaryImageFromVariant(product.variants?.[0])
    );
}
