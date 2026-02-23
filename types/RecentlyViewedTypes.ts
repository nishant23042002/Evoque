
export interface RecentlyViewedItem {
    productId: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discountedPrice: number;
    brand: string;
    color?: string;
    viewedAt: number;
};
