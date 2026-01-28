import Product from "@/types/ProductTypes";

export interface WishlistItem {
    productId: string;
    product: Product;
    slug: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number,
    brand: string;
    size?: string;
    color?: string
    variantSku?: string;
}