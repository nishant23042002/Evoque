"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CometLogoLoader from "../FlashLogo/LayerLogo";

/* =====================
   TYPES
===================== */

interface VariantImage {
  url: string;
  isPrimary?: boolean;
}

interface Variant {
  color: {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
  };
  pricing: {
    price: number;
  };
}

interface Product {
  _id: string;
  productName: string;
  slug: string;
  category: { name: string; slug: string };
  subCategory: { name: string; slug: string };
  variants: Variant[];
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
interface SearchSubCategory {
  name: string;
  slug: string;
  isActive: boolean;
  categorySlug: string;
}


interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  isTrending: boolean;
  isFeatured: boolean;
  isActive: boolean;
  subCategories: SubCategory[];
  // you can add other fields like merchandising, seo, categoryPageBanner, createdAt, updatedAt, etc.
}

interface SubCategory {
  name: string;
  slug: string;
  isActive: boolean;
  priority?: number;
  isFeatured?: boolean;
}

const getPrimaryImage = (variant: Variant) =>
  variant.color.images.find(i => i.isPrimary)?.url ||
  variant.color.images[0]?.url;

/* =====================
   COMPONENT
===================== */

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [popularCategory, setPopularCategory] = useState<SearchSubCategory[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();

        const activeSubCategories: SearchSubCategory[] = data
          .filter((category) => category.isTrending) // ✅ only trending categories
          .flatMap((category) =>
            category.subCategories
              .filter((sub) => sub.isActive)
              .map((sub) => ({
                name: sub.name,
                slug: sub.slug,
                isActive: sub.isActive,
                categorySlug: category.slug,
              }))
          );


        setPopularCategory(activeSubCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);
  /* ---------------------
     Fetch Products
  --------------------- */
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${query}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  /* ---------------------
     Text Search Filter
  --------------------- */
  const filteredProducts = useMemo(() => {
    if (!query) return [];

    const searchText = query.toLowerCase();

    return products.filter(p => {
      const searchableText = [
        p.productName,
        p.category?.name,
        p.subCategory?.name,
        ...(p.tags || []),
        ...(p.search?.keywords || []),
        ...(p.search?.synonyms || []),
        p.attributes?.fabric,
        p.attributes?.pattern,
        p.attributes?.fitType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchText);
    });
  }, [products, query]);

  /* ---------------------
     Body scroll lock
  --------------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const announcements = ["Free Shipping on Orders Above ₹999"];
  const repeatedAnnouncements = Array(5).fill(announcements[0]);

  return (
    <>
      {/* Search Icon */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="cursor-pointer text-slate-800 hover:text-brand-red transition-colors"
      >
        <Search strokeWidth={2.2} size={20} />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[90%] sm:w-100 bg-[#E8E6DF] z-50 shadow-lg transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-[101%]"
        )}
      >
        {/* Header */}
        <div className="relative w-full overflow-hidden bg-brand-red text-white">
          <div className="marquee flex w-max items-center gap-6 py-1.75">
            {repeatedAnnouncements.map((text, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-poppins tracking-wider px-2 text-sm font-extrabold"
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex border-b border-black/20 items-center p-2.5">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shirts, fabric, style..."
            className="w-full px-3 py-2 border rounded outline-none focus:border-brand-red"
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="p-2 hover:text-brand-red transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto h-[calc(100%-128px)]">
          {loading && (
            <div className="flex justify-center mt-10">
              <CometLogoLoader />
            </div>
          )}

          {!loading && query && filteredProducts.length === 0 && (
            <p className="text-center text-sm text-slate-600">
              No products found
            </p>
          )}

          <div>
            {
              !query ? (
                <div className="overflow-y-auto h-[calc(100%-128px)]">
                  {/* Replace this with actual search results */}
                  <h1 className="text-sm font-bold text-slate-800 py-2">Most Popular Category</h1>
                  {popularCategory.map((cat, i) => (
                    <div key={i}>
                      <Link
                        href={`/categories/${cat.categorySlug}?sub=${cat.slug}`}
                        onClick={() => setOpen(false)} // optional UX improvement
                      >
                        <p className="text-sm font-semibold text-slate-800 hover:underline hover:text-brand-red decoration-brand-red cursor-pointer py-1 duration-200">
                          {cat.name}
                        </p>
                      </Link>
                    </div>
                  ))}

                </div>
              )
                : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map(p => {
                      const variant = p.variants[0];
                      const image = getPrimaryImage(variant);

                      return (
                        <Link
                          key={p._id}
                          href={`/products/${p.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          <div className="relative aspect-[3/4] rounded overflow-hidden bg-gray-100">
                            {image && (
                              <Image
                                src={image}
                                alt={p.productName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          <p className="text-xs mt-1 font-medium line-clamp-1">
                            {p.productName}
                          </p>
                          <p className="text-xs font-semibold">
                            ₹{variant.pricing.price}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
