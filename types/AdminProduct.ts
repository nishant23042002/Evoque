export interface VariantImage {
  url: string
  publicId: string
  isPrimary: boolean
  isHover: boolean
  order: number
}

export interface VariantSize {
  size: string
  stock: number
}

export interface ColorVariant {
  colorName: string
  colorSlug: string
  images: VariantImage[]
  sizes: VariantSize[]
}

export interface ImageType {
  id: string;
  url: string;
  publicId?: string;
  isPrimary: boolean;
  isHover: boolean;
  order: number;
}

export interface SizeType {
  size: string;
  stock: number;
  variantSku?: string;
  isAvailable: boolean;
}

export interface VariantType {
  color: {
    name: string;
    slug: string;
    hex?: string;
    images: ImageType[];
  };
  sizes: SizeType[];
  pricing: {
    price: number;
    originalPrice: number;
    discountPercentage: number;
  };
  totalStock: number;
}

export interface AdminProduct {
  productName: string
  slug: string
  brand: string
  categorySlug: string
  subCategorySlug: string

  pricing: {
    price: number
    originalPrice: number
    discountPercentage: number
    currency: string
    taxInclusive: boolean
  }

  thumbnail: string

  variants: VariantType[]

  description: string

  isActive: boolean
  isFeatured: boolean
}