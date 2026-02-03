"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CometLogoLoader from "../FlashLogo/LayerLogo";
import { Category, SearchSubCategory } from "@/types/ProductTypes";
import { useProductSearch } from "@/lib/useProductSearch";


/* =====================
   COMPONENT
===================== */

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [popularCategory, setPopularCategory] = useState<SearchSubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { products } = useProductSearch(query);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();

        const activeSubCategories: SearchSubCategory[] = data
          .filter(category => category.isTrending)
          .flatMap(category =>
            category.subCategories
              .filter(sub => sub.isActive)
              .map(sub => ({
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
        className="cursor-pointer"
      >
        <Search
          size={20}
          strokeWidth={2.2}
          className="
            text-foreground
            hover:text-primary
            transition-colors duration-200
          "
        />
      </button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto bg-[rgba(0,0,0,0.35)]"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50",
          "bg-(--surface-elevated) shadow-xl",
          "w-[80vw] sm:w-105",
          "transform-gpu will-change-transform",
          "transition-transform duration-700 ease-in-out",
          open ? "translate-x-0" : "translate-x-[101%]"
        )}
      >

        {/* Input */}
        <div className="flex items-center p-3 border-b border-(--border-strong) ">
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shirts, fabric, style..."
            className="
              w-full px-3 py-1.25 rounded-[3px]
              bg-(--surface-elevated)
              border-2 border-(--border-strong)
              text-foreground
              placeholder:text-(--input-placeholder)
              outline-none
              focus:border-(--input-focus)
            "
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="cursor-pointer
              p-2
              text-(--text-secondary)
              hover:text-primary
              transition-colors
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="px-2 overflow-y-auto scrollbar-hide h-[calc(100%-128px)]">
          {
            query && products.length > 0 && (
              <div className="pt-2 flex justify-between">
                <p>Products</p>
                <p>{products?.length}</p>
              </div>
            )
          }
          {loading && (
            <div className="flex justify-center mt-10">
              <CometLogoLoader />
            </div>
          )}

          {!loading && query && products.length === 0 && (
            <p className="text-center text-sm text-(--text-muted)">
              No results found for “{query}”
            </p>
          )}


          {!query ? (
            <>
              <h1 className="text-sm font-semibold tracking-wide text-foreground py-2">
                Most Trending Layer
              </h1>

              {popularCategory.map((cat, i) => (
                <Link
                  key={i}
                  href={`/categories/${cat.categorySlug}?sub=${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="relative group"
                >
                  <p
                    className="
                      py-1 text-sm font-medium
                      text-(--text-secondary)
                      hover:text-primary
                      transition-colors
                    "
                  >
                    {cat.name}
                  </p>
                  <span
                    className="
                      absolute left-0 bottom-0
                      h-0.5
                      w-1/2
                      bg-primary
                      scale-x-0 origin-left
                      transition-transform duration-500 ease-out
                      group-hover:scale-x-30
                    "
                  />
                </Link>
              ))}
            </>
          ) : (
            <div className="grid grid-cols-2 my-2 gap-2">

              {products.map(p => {
                const variant = p.variants?.[0];
                const image =
                  variant?.color?.images?.find(i => i.isPrimary)?.url ||
                  variant?.color?.images?.[0]?.url ||
                  p.thumbnail;

                return (
                  <Link
                    key={p._id}
                    href={`/products/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="border border-(--border-strong) rounded-[3px]"
                  >
                    <div className="relative aspect-3/4 rounded-[3px] overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={p.productName}
                          fill
                          className="object-cover rounded-[3px] transition-transform duration-300 hover:scale-105"
                        />

                      )}
                      <div className="absolute inset-0 hover:bg-black/20 transition-colors" />
                    </div>

                    <p className="m-1 text-xs font-medium line-clamp-1">
                      {p.productName}
                    </p>

                    <p className="m-1 text-xs font-semibold text-(--text-secondary)">
                      ₹{variant?.pricing?.price}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcement Bar */}
        <div className="fixed bottom-0 w-full border-t overflow-hidden bg-(--linen-200)">
          <div className="marquee flex w-max items-center gap-6 py-1.75">
            {repeatedAnnouncements.map((text, i) => (
              <span
                key={i}
                className="
                  whitespace-nowrap
                  text-(--text-primary)
                  font-poppins tracking-wider
                  px-2 text-sm
                "
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
