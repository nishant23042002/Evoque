
export interface VariantImage {
    url: string;
    isPrimary?: boolean;
}

export interface VariantColor {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}

export interface SizeVariant {
    size: string;
    variantSku: string;
    stock: number;
    isAvailable: boolean;
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
    categoryPageBanner?: string;
    isTrending: boolean;
    isFeatured: boolean;
    isActive: boolean;
    subCategories: SubCategory[];
    leftMenuCategoryImage: string;
}

export interface Product {
    _id: string;
    productName: string;
    slug: string;
    brand: string;
    rating: number;
    category: Category;
    subCategory: { name: string, slug: string };
    pricing: {
        price: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    variants: Variant[];
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
    sku: string;
    reviews: string[];
    description?: string;
    tags?: string[];
    search?: {
        keywords?: string[];
        synonyms?: string[];
    };
    attributes?: {
        fabric?: string;
        pattern?: string;
        fitType?: string;
    };
}

export interface ColorVariant {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
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