"use client"

import Container from "@/components/Container";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import { useEffect, useState } from "react";



const topBanners = [
  "/images/hero-banner1.jpg",
  "/images/hero-banner3.png",
];

const bottomBanners = [
  "/images/hero-banner2.png",
  "/images/banner4.png",
];


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

export interface Product {
  _id: string;
  productName: string;
  slug: string;
  brand: string;
  pricing: Pricing;
  rating: number;
  variants: Variant[];
  subCategory?: {
    slug: string;
  };
}

export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setItems(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);


  return (
    <Container className="bg-[#eceae3]
">
      <div className="gap-5">
        {/* Banner */}
        <BannerSlider banners={topBanners} />

        <FeaturedCategories />

        <BannerSlider banners={bottomBanners} />

        <ProductMasonryGrid products={items} />

      </div>
    </Container>
  )
}
