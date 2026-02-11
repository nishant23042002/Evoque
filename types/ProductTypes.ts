
export interface VariantImage {
    url: string;
    isPrimary?: boolean;
}

export interface SizeVariant {
    size: string;
    variantSku: string;
    stock: number;
    isAvailable: boolean;
}

export interface ColorVariant {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}
export interface Pricing {
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency?: string;
}

export interface Variant {
    color: ColorVariant;
    sizes: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    totalStock: number;
}

export interface SubCategory {
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
    priority?: number;
    isFeatured?: boolean;
}

export interface SearchSubCategory {
    name: string;
    slug: string;
    isActive: boolean;
    categorySlug: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    sizeType: {
        type: string;
        label: string;
        chartImage: string;
    };
    categoryPageBanner?: string;
    isTrending: boolean;
    isFeatured: boolean;
    isActive: boolean;
    subCategories: SubCategory[];
    leftMenuCategoryImage: string;
}

export default interface Product {
    _id: string;
    attributes?: {
        sleeve?: string;
        pattern?: string;
        occasion: string[];
        fabric?: string;
        fitType?: string;
        season?: string[];
    };
    productName: string;
    slug: string;
    sku: string;
    brand: string;
    category: Category;
    thumbnail: string;
    subCategory: { name: string, slug: string };
    fit?: string;
    variants: Variant[];
    styleTags?: string[];
    stylePairs?: Product[];
    relatedProducts?: Product[];

    pricing: {
        price: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    rating: number;
    details: {
        material: string;
        fabricWeight: string;
        stretch: string;
        washCare: string[];
        fitType: string;
        rise: string;
        closure: string;
    };
    sizeChart: string;
    reviews: string[];
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    shipping?: {
        weight?: string;
        dimensions?: string;
        codAvailable?: boolean;
        returnDays?: number;
    }
    description?: string;
    tags?: string[];
    badges?: string[];
    merchandising?: {
        priority?: number;
        collection?: string;
        displayOrder?: number;
    };
    search?: {
        keywords?: string[];
        synonyms?: string[];
        popularityScore?: number;
    };
    analytics?: {
        views?: number;
        cartAdds?: number;
        purchases?: number;
    },
    isActive?: boolean,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean,
    launchDate?: string,
    createdAt: string
}

export interface BannerImage {
    url: string;
    width: number;
}

export interface Banner {
    _id: string;
    title?: string;
    desktopImages: BannerImage[];
    mobileImages: BannerImage[];
    redirectUrl: string;
}