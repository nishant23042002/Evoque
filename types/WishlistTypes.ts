import Product from "./ProductTypes";

export interface WishlistItem {
    productId: string;
    product: Product;
    slug: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    brand: string;
}

