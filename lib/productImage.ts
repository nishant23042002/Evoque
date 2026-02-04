import { Variant } from "@/types/ProductTypes";
import Product from "@/types/ProductTypes";

export function getPrimaryImageFromVariant(variant?: Variant): string {
    if (!variant) return "/images/placeholder-product.jpg";

    return (
        variant.color.images.find(img => img.isPrimary)?.url ||
        variant.color.images[0]?.url ||
        "/images/placeholder-product.jpg"
    );
}

export function getSecondaryImageFromVariant(variant?: Variant): string | null {
    if (!variant) return null;

    return (
        variant.color.images.find(img => !img.isPrimary)?.url ||
        variant.color.images[1]?.url ||
        null
    );
}

export function getPrimaryImageFromProduct(product: Product): string {
    return (
        product.thumbnail ||
        getPrimaryImageFromVariant(product.variants?.[0])
    );
}
