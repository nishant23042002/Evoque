export interface CartItem {
    productId: string; // ✅ STRING ONLY
    variantSku: string;
    size: string;
    color: {
        name: string;
        slug: string;
    };
    quantity: number;
    price: number;
    originalPrice?: number;
    name: string;
    slug: string;
    image: string;
    brand: string;
}

export interface CartState {
    items: CartItem[];
    subtotal: number;
}
