"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/wishlist/wishlist.slice";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [activeId, setActiveId] = useState<string | null>(null);


  const activeItem = useMemo(() => {
    if (!wishlistItems.length) return null;

    return (
      wishlistItems.find((item) => item.productId === activeId) ??
      wishlistItems[0]
    );
  }, [wishlistItems, activeId]);


  /* =======================
     MASONRY CONFIG
  ======================= */

  const breakpoints = {
    default: 3,
    1500: 3,
    1200: 3,
    768: 2,
    500: 1,
  };

  /* =======================
     STABLE HEIGHTS (NO JITTER)
  ======================= */
  const heights = useMemo(() => {
    if (!wishlistItems.length) return [];

    const buckets = [350, 370, 390, 420, 450, 480, 510, 540];

    return wishlistItems.map((product) => {
      let seed = 0;
      const id = product.productId;

      for (let i = 0; i < id.length; i++) {
        seed = (seed << 5) - seed + id.charCodeAt(i);
      }

      const index = Math.abs(seed) % buckets.length;
      const jitter = (Math.abs(seed) % 30) - 15;

      return buckets[index] + jitter;
    });
  }, [wishlistItems]);

  /* =======================
     EMPTY STATE
  ======================= */
  if (!wishlistItems.length) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-sm text-slate-600">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="px-2 py-3">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">

        {/* LEFT — BIG ITEM */}
        {activeItem && (
          <div className="hidden lg:block lg:w-[40%]">
            <div className="sticky top-18">
              <div className="relative rounded-[3px] w-full h-145 overflow-hidden">
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  className="object-cover object-[50%_10%]"
                />
              </div>
              <div className="absolute top-2 left-2">{activeItem.brand}</div>

              <div className="mt-2 py-3">
                <h2 className="text-lg font-medium">{activeItem.name}</h2>
                <div className="flex justify-items-start items-center gap-3 text-[11px]">
                  <span className="text-lg font-semibold">Price: {activeItem?.price}</span>
                  <span className="line-through text-sm opacity-70">
                    {activeItem?.originalPrice}
                  </span>
                </div>

                <button className="mt-4 w-full bg-brand-red text-white py-3 rounded-[3px] hover:bg-red-700 transition">
                  MOVE TO BAG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT — MASONRY */}
        <div className="w-full lg:w-[55%]">
          <Masonry
            breakpointCols={breakpoints}
            className="flex gap-4"
            columnClassName="space-y-4"
          >
            {wishlistItems.map((item, index) => (
              <Link
                key={item.productId}
                href={`/products/${item.slug}`}
                onClick={() => setActiveId(item.productId)}
                className="block cursor-pointer"
              >
                <div
                  className="group relative w-full rounded-[3px] overflow-hidden bg-gray-100"
                  style={{ height: heights[index] }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* TOP BAR */}
                  <div className="absolute flex justify-between top-2 left-2 right-2">
                    <h3 className="text-[11px] text-slate-800 font-semibold">
                      {item?.brand}
                    </h3>

                    <MdDeleteOutline
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(toggleWishlist(item));
                      }}
                      className="text-slate-600 hover:text-red-500 cursor-pointer"
                    />
                  </div>

                  {/* BOTTOM INFO */}
                  <div className="absolute bottom-0 w-full bg-black/20 p-1.5 text-white">
                    <p className="text-sm mb-1">{item.name}</p>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-md">Price: {item.price}</span>
                      <span className="line-through text-[12px] opacity-70">
                        {item.originalPrice}
                      </span>
                    </div>

                    <button className="cursor-pointer mt-2 w-full border border-white/30 text-sm py-1.5 rounded-[3px] bg-brand-red transition">
                      Move to Bag
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </Masonry>
        </div>
      </div>
    </div>
  );
}
