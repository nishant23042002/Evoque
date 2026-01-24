"use client"

import Container from "@/components/Container";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import { useEffect, useState } from "react";
import LoginModalUI from "@/components/Header/LoginModal";



/* ---------------- TYPES ---------------- */

interface BannerImage {
  url: string;
  width: number;
}

interface Banner {
  _id: string;
  title?: string;
  desktopImages: BannerImage[];
  mobileImages: BannerImage[];
  redirectUrl: string;
  order: number;
  isActive: boolean;
}

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
  isActive: string,
  isFeatured: string,
  isBestSeller: string,
  isNewArrival: string
}



export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  const [topBanners, setTopBanners] = useState<Banner[]>([]);
  const [bottomBanners, setBottomBanners] = useState<Banner[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);


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

  /* Fetch Banners */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        const data: Banner[] = await res.json();

        // Filter active banners
        const activeBanners = data.filter((b) => b.isActive);

        // Banana Club style: top banners order < 100, bottom banners order >= 100
        const top = activeBanners
          .filter((b) => b.order < 100)
          .slice(0, 2); // only take first 2
        const bottom = activeBanners
          .slice(2, 4); // only take first 2

        setTopBanners(top);
        setBottomBanners(bottom);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };

    fetchBanners();
  }, []);



  return (
    <Container className="bg-(--linen-100)">
      <div className="flex flex-col">
        {/* 🔥 Top Hero Banner Section */}
        {topBanners.length > 0 && (
          <section className="w-full">
            <BannerSlider banners={topBanners} />
          </section>
        )}

        {/* 🔥 Featured Categories */}
        <section className="w-full">
          <FeaturedCategories />
        </section>

        {/* 🔥 Mid / Bottom Banner Section */}
        {bottomBanners.length > 0 && (
          <section className="w-full">
            <BannerSlider banners={bottomBanners} />
          </section>
        )}

        {/* 🔥 Product Grid */}
        <section className="w-full">
          <ProductMasonryGrid products={items} />
        </section>
        <LoginModalUI
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
        />

      </div>
    </Container>
  );

}
