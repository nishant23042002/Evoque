// types/Product.ts
import { ObjectId } from "mongoose";



interface VariantImage {
    url: string;
    isPrimary?: boolean;
}

interface VariantColor {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}

interface SizeVariant {
    size: string;
    stock: number;
    isAvailable?: boolean;
}

interface Variant {
    color: VariantColor;
    sizes?: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    totalStock?: number;
}

interface Pricing {
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency: string;
}


export default interface ProductType {
    _id?: ObjectId;
    productName: string;
    slug: string;
    sku?: string;
    brand?: string;
    category?: ObjectId;
    subCategory?: {
        name: string;
        slug: string;
        image?: string;
    };
    fit?: string;
    variants?: Variant[];
    pricing?: Pricing;
    isActive?: boolean;
    tags?: string[];
    // Add any other fields you need
}
