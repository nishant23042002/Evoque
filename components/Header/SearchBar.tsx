"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CometLogoLoader from "../FlashLogo/LayerLogo";
import { Product,Variant,Category,SearchSubCategory } from "@/types/ProductTypes";



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
          "bg-(--linen-200) shadow-xl",
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
              bg-(--linen-100)
              border border-(--input-border)
              text-foreground
              placeholder:text-(--input-placeholder)
              outline-none
              focus:border-(--input-focus)
            "
          />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close search"
            className="
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
        <div className="p-2 overflow-y-auto scrollbar-hide h-[calc(100%-128px)]">
          {loading && (
            <div className="flex justify-center mt-10">
              <CometLogoLoader />
            </div>
          )}

          {!loading && query && filteredProducts.length === 0 && (
            <p className="text-center text-sm text-(--text-muted)">
              Dropping Soon. Stay Tune...
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
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map(p => {
                const variant = p.variants[0];
                const image = getPrimaryImage(variant);

                return (
                  <Link
                    key={p._id}
                    href={`/products/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="border border-(--border-strong) p-0.5 rounded-[3px]"
                  >
                    <div className="relative aspect-3/4 rounded-[3px] overflow-hidden bg-(--surface-muted)">
                      {image && (
                        <Image
                          src={image}
                          alt={p.productName}
                          fill
                          className="object-cover rounded-[3px] transition-transform duration-300 hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-[rgba(0,0,0,0.20)] hover:bg-[rgba(0,0,0,0.35)] transition-colors" />
                    </div>

                    <p className="mt-1 text-xs font-medium text-foreground line-clamp-1">
                      {p.productName}
                    </p>
                    <p className="text-xs font-semibold text-(--text-secondary)">
                      ₹{variant?.pricing?.price}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcement Bar */}
        <div className="fixed bottom-0 w-full overflow-hidden bg-(--linen-800)">
          <div className="marquee flex w-max items-center gap-6 py-1.75">
            {repeatedAnnouncements.map((text, i) => (
              <span
                key={i}
                className="
                  whitespace-nowrap
                  text-(--text-inverse)
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
