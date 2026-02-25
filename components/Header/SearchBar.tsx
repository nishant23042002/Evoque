"use client";

import { Search, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import CometLogoLoader from "../FlashLogo/LayerLogo";
import { Category, SearchSubCategory } from "@/types/ProductTypes";
import { useProductSearch } from "@/lib/useProductSearch";
import { useDebounce } from "use-debounce"
import { useLockBodyScroll } from "@/src/useLockBodyScroll";

/* =====================
   COMPONENT
===================== */


const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [popularCategory, setPopularCategory] = useState<SearchSubCategory[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [debouncedQuery] = useDebounce(query, 300);
  const { products, loading } = useProductSearch(debouncedQuery);
  useLockBodyScroll(open)
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
      }
    }

    fetchCategories();
  }, []);


  


  const announcements = ["Free Shipping on Orders Above ₹999"];
  const repeatedAnnouncements = Array(5).fill(announcements[0]);
  
  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;

    const updated = [
      term,
      ...recentSearches.filter((t) => t !== term),
    ].slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  return (
    <>
      {/* Search Icon */}
      <button
        onClick={() => {
          setOpen(true);

          const saved = JSON.parse(
            localStorage.getItem("recentSearches") || "[]"
          );

          setRecentSearches(saved);
        }}
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
        onClick={() => {
          setOpen(false);
          saveRecentSearch(query)
          setQuery("");
        }}
      />

      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50",
          "bg-white shadow-xl",
          "w-[80vw] sm:w-130",
          "transform-gpu will-change-transform",
          "transition-transform duration-700 ease-in-out",
          open ? "translate-x-0" : "translate-x-[101%]"
        )}
      >

        {/* Input */}
        <div className="relative flex items-center py-6 px-3">
          <SearchIcon className="absolute top-6.5" size={18} />
          {query &&
            <span onClick={() => setQuery("")} className="cursor-pointer underline text-xs absolute right-14 top-7">Clear</span>
          }
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shirts, fabric, style..."
            className="
              w-full pl-6 pr-10 pb-3 border-b-2 border-black
              bg-white text-sm
              text-foreground          
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
              <div className="pt-2 flex uppercase text-sm justify-between">
                <p>Products</p>
                <p>[ {products?.length} ] </p>
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
              <div className="">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-semibold text-primary">
                        Recent Searches
                      </p>

                      <button
                        onClick={() => {
                          localStorage.removeItem("recentSearches");
                          setRecentSearches([]);
                        }}
                        className="text-xs text-red-500 cursor-pointer hover:underline"
                      >
                        Clear
                      </button>
                    </div>

                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="block uppercase text-xs cursor-pointer  text-left hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <h1 className="text-sm font-semibold text-primary tracking-wide mb-2">
                Most Trending Layer
              </h1>

              {popularCategory.map((cat, i) => (
                <Link
                  key={i}
                  href={`/categories/${cat.categorySlug}?sub=${cat.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="relative group"
                >
                  <p
                    className="
                      py-1 font-medium
                      text-(--text-secondary) text-xs
                      hover:text-primary
                      transition-colors uppercase
                    "
                  >
                    {cat?.name.slice(0, 21) ?? null}
                  </p>
                  <span
                    className="
                      absolute -left-5 bottom-0.5
                      h-0.5
                      w-26
                      bg-primary
                      scale-x-0 origin-center
                      transition-transform duration-500 ease-out
                      group-hover:scale-x-60
                    "
                  />
                </Link>
              ))}
            </>
          ) : (
            <div className="grid grid-cols-2">
              {products?.length > 0 && products.map((p) => {
                const variant = p.variants?.[0] ?? null;
                const image =
                  variant?.color?.images?.find(i => i.isPrimary)?.url ||
                  variant?.color?.images?.[0]?.url ||
                  p.thumbnail;

                return (
                  <Link
                    key={p._id}
                    href={`/products/${p.slug}`}
                    onClick={() => {
                      setOpen(false)
                      saveRecentSearch(p.productName)
                    }}
                    className="mb-2"
                  >
                    <div className="relative aspect-3/4 overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={p.productName}
                          fill
                          className="object-cover"
                        />

                      )}
                      <div className="absolute inset-0 hover:bg-black/10 transition-colors" />
                      {variant?.pricing?.discountPercentage && (
                        <div className="text-xs bg-black text-white px-1 py-0.5 absolute bottom-0">
                          -{variant.pricing.discountPercentage}%
                        </div>
                      )}
                    </div>

                    <p className="mt-1 text-xs uppercase font-medium line-clamp-1">
                      {p.productName}
                    </p>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs font-semibold text-red-600">
                        Rs.{variant?.pricing?.price}
                      </p>
                      {variant?.pricing?.discountPercentage && (
                        <div className="text-xs bg-black text-white px-1 py-0.5 absolute bottom-0">
                          -{variant.pricing.discountPercentage}%
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Announcement Bar */}
        <div className="fixed bottom-0 w-full border-t border-(--border-light) overflow-hidden bg-(--linen-100)">
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
