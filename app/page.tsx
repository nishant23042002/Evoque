"use client"

import Container from "@/components/Container";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import { useEffect, useState } from "react";
import LoginModalUI from "@/components/Header/LoginModal";
import Product from "@/types/ProductTypes";
import Footer from "@/components/Footer/Footer";


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





export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  const [topBanners, setTopBanners] = useState<Banner[]>([]);
  const [bottomBanners, setBottomBanners] = useState<Banner[]>([]);



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
    <Container className="bg-(--linen-50)">
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
        <LoginModalUI />

      </div>
      <Footer /> 
    </Container>
  );

}
