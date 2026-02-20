"use client"

import Container from "@/components/Container";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";
import ProductMasonryGrid from "@/components/Main/ProductMasonryGrid";
import { useEffect, useState } from "react";
import LoginModalUI from "@/components/Header/LoginModal";
import Product, { Category } from "@/types/ProductTypes";
import Footer from "@/components/Footer/Footer";
import axios from "axios";
import LayerLogo from "@/components/FlashLogo/LayerLogo";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";


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
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const categoryFromUrl = searchParams.get("category") || "all";

  const [page, setPage] = useState(pageFromUrl);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);

  const LIMIT = 20;



  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newPage = Number(searchParams.get("page")) || 1;
    const newCategory = searchParams.get("category") || "all";

    setPage(newPage);
    setActiveCategory(newCategory);
  }, [searchParams]);

  useEffect(() => {
    const cat = searchParams.get("category");
    setActiveCategory(cat ?? "all");
  }, [searchParams]);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get<Category[]>("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);



  useEffect(() => {
    const fetchProducts = async () => {
      let url = `/api/products?page=${page}&limit=${LIMIT}`;

      if (activeCategory !== "all") {
        url += `&category=${activeCategory}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setItems(data.products);
      setTotalPages(Math.ceil(data.total / LIMIT));
    };

    fetchProducts();
  }, [page, activeCategory]);




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

  /* ---------------- HELPERS ---------------- */
  const changePage = (p: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", String(p));
    router.push(`/?${query.toString()}`, { scroll: false });

  };

  const changeCategory = (slug: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (slug === "all") {
      query.delete("category");
    } else {
      query.set("category", slug);
    }

    query.set("page", "1"); // reset page when category changes

    router.push(`/?${query.toString()}`, { scroll: false });
    // no scroll:false here → we WANT scroll to top
  };



  if (loading) {
    return (
      <div className="flex flex-nowrap items-center justify-center h-[70vh]">
        <LayerLogo />
      </div>
    );
  }


  return (
    <Container>
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
          <div className="mx-1 select-none justify-between flex flex-col">
            <div className="flex justify-between pt-6 items-center">
              <h1 className="text-2xl sm:text-4xl tracking-wider uppercase font-bold">
                View All
              </h1>
              <p className="font-light text-lg">[ {items.length ?? 0} ]</p>
            </div>
            <div>
              <div className="w-full h-11 py-0.5 overflow-y-hidden scroll-smooth overflow-x-auto hover-scrollbar">

                <div className="flex min-w-max">

                  {/* VIEW ALL */}
                  <button
                    onClick={() => {
                      changeCategory("all")
                    }}
                    className={`
                          px-4 py-1 mr-1 cursor-pointer text-sm font-light tracking-normal uppercase
                          border hover:border-black
                          ${activeCategory === "all"
                        ? "bg-black text-white"
                        : "text-black"}
                      `}
                  >
                    View All
                  </button>

                  {/* CATEGORY LOOP */}
                  {categories.map((item) => {
                    const isActive = activeCategory === item.slug;

                    return (
                      <button
                        key={item._id}
                        onClick={() => changeCategory(item.slug)}
                        className={`cursor-pointer
                              px-4 py-1 mx-1 text-sm font-light tracking-widest uppercase
                              whitespace-nowrap
                              border border-(--border-light) hover:border-black
                              ${isActive
                            ? "bg-black text-white"
                            : "text-black"}
                        `}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <ProductMasonryGrid products={items} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={changePage}
          />


        </section>
        <LoginModalUI />

      </div>
      <Footer />
    </Container>
  );

}
