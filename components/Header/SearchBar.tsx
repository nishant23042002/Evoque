"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CometLogoLoader from "../FlashLogo/LayerLogo"
import Link from "next/link";

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

interface SearchSubCategory {
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  categorySlug: string;
}

interface SubCategory {
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  priority?: number;
  isFeatured?: boolean;
}



const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [popularCategory, setPopularCategory] = useState<SearchSubCategory[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();

        const activeSubCategories: SearchSubCategory[] = data.flatMap(
          (category) =>
            category.subCategories
              .filter((sub) => sub.isActive)
              .map((sub) => ({
                name: sub.name,
                slug: sub.slug,
                image: sub.image,
                isActive: sub.isActive,
                categorySlug: category.slug, // ✅ guaranteed
              }))
        );

        console.log(activeSubCategories); // 🔥 CHECK THIS
        setPopularCategory(activeSubCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);





  if (loading) {
    return (
      <div className="flex flex-nowrap items-center justify-center h-[70vh]">
        <CometLogoLoader />
      </div>
    );
  }

  return (
    <>
      {/* Search Icon */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="cursor-pointer text-slate-800 hover:text-brand-red transition-colors"
      >
        <Search
          strokeWidth={2.2} size={20} />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[90%] sm:w-100 bg-[#E8E6DF] z-50 shadow-lg transform transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex border border-b-black/20 items-center justify-between p-2.5">
          <div className="w-full">
            <input
              type="text"
              placeholder="Search shirts, jeans, jackets..."
              className="w-full border border-black/10 rounded px-3 py-2 outline-none focus:border-brand-red transition-all"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="cursor-pointer p-2 hover:text-brand-red transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Optional: Search Results */}
        <div className="p-4 overflow-y-auto h-[calc(100%-128px)]">
          {/* Replace this with actual search results */}
          <h1 className="text-sm font-bold text-slate-700 py-3">Most Popular Category</h1>
          {popularCategory.map((cat, i) => (
            <div key={i}>
              <Link
                href={`/categories/${cat.categorySlug}?sub=${cat.slug}`}
                onClick={() => setOpen(false)} // optional UX improvement
              >
                <p className="text-sm font-medium text-slate-700 hover:underline hover:text-brand-red decoration-brand-red cursor-pointer py-1 duration-200">
                  {cat.name}
                </p>
              </Link>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default SearchBar;
