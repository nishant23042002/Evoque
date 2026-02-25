// types/AdminProduct.ts

export interface AdminProduct {
  _id: string;
  productName: string;
  slug: string;
  brand: string;
  thumbnail: string;
  totalStock: number;
  isActive: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  pricing: {
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
  };
  category?: {
    name: string;
    slug: string;
  };
  subCategory: {
    name: string
  }
}