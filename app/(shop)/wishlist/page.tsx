"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/wishlist/wishlist.slice";
import { addToCart } from "@/store/cart/cart.slice";



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
    1400: 2,
    1024: 4,
    950: 3,
    700: 2,
    350: 1,
  };

  /* =======================
     STABLE HEIGHTS (NO JITTER)
  ======================= */
  const heights = useMemo(() => {
    if (!wishlistItems.length) return [];

    const buckets =
      typeof window !== "undefined" && window.innerWidth < 640
        ? [280, 300, 320, 340]
        : [350, 370, 390, 420, 450, 480, 510];


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
      <div className="flex items-center justify-center h-[60vh] text-sm text-[var(--text-muted)]">
        Your wishlist is empty
      </div>
    );
  }

  return (
    <div className="px-2 py-2 sm:py-4 bg-[var(--linen-100)]">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">

        {/* LEFT — BIG ITEM */}
        {activeItem && (
          <div className="hidden lg:block lg:w-[40%]">
            <div className="sticky top-20 border border-[var(--border-light)]">

              {/* IMAGE */}
              <div className="relative rounded-[3px] w-full h-165 overflow-hidden">
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  className="object-cover object-[50%_40%]"
                />

                {/* BRAND TAG */}
                <span className="absolute top-2 left-2 text-xs font-semibold bg-[var(--surface)]/80 text-[var(--foreground)] px-2 py-0.5 rounded">
                  {activeItem.brand}
                </span>
              </div>

              {/* DETAILS */}
              <div className="mt-3 py-3 mx-2">
                <h2 className="text-lg font-medium text-[var(--foreground)]">
                  {activeItem.name}
                </h2>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg font-semibold text-[var(--primary)]">
                    ₹{activeItem.price}
                  </span>

                  {activeItem.originalPrice && (
                    <span className="line-through text-sm text-[var(--text-muted)]">
                      ₹{activeItem.originalPrice}
                    </span>
                  )}
                </div>

                <button onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Item added to cart");
                  console.log(`ProductId: ${activeItem.productId}`);
                  dispatch(
                    addToCart({
                      productId: activeItem?.productId,
                      name: activeItem?.name,
                      slug: activeItem?.slug,
                      image: activeItem?.image,
                      price: activeItem?.price,
                      originalPrice: activeItem?.originalPrice,
                      quantity: 1,
                      brand: activeItem?.brand
                    })
                  );

                  dispatch(toggleWishlist(activeItem));
                }}
                  className="
                            cursor-pointer mt-2 w-full
                            hover:bg-[var(--btn-primary-bg)]
                            text-[var(--btn-primary-text)]
                            font-semibold
                            py-3
                            rounded-[3px]
                            border border-[var(--border)]
                            bg-[var(--btn-primary-hover)]
                            transition-all duration-300
                          ">
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
            className="flex gap-2 sm:gap-4"
            columnClassName="space-y-2 sm:space-y-4"
          >
            {wishlistItems.map((item, index) => (
              <Link
                key={item.productId}
                href={`/products/${item.slug}`}
                onClick={() => setActiveId(item.productId)}
                className="block cursor-pointer border border-[var(--border-light)] rounded-[3px]"
              >
                <div
                  className="group relative w-full rounded-[3px] overflow-hidden bg-[var(--surface-muted)]"
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
                    <h3 className="text-[11px] text-[var(--foreground)] font-semibold">
                      {item?.brand}
                    </h3>

                    <MdDeleteOutline
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(toggleWishlist(item));
                      }}
                      className="text-[var(--text-muted)] hover:text-[var(--accent)] cursor-pointer"
                    />
                  </div>

                  {/* BOTTOM INFO */}
                  <div className="absolute bottom-0 w-full bg-[var(--earth-charcoal)]/30 p-1.5 text-[var(--text-inverse)]">
                    <p className="text-sm mb-1">{item.name}</p>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-md">Price: {item.price}</span>
                      <span className="line-through text-[var(--muted-foreground)] text-[12px]">
                        {item.originalPrice}
                      </span>
                    </div>

                    <button onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Item added to cart");
                      console.log(`ProductId: ${item.productId}`);
                      dispatch(
                        addToCart({
                          productId: item.productId,
                          name: item.name,
                          slug: item.slug,
                          image: item.image,
                          price: item.price,
                          originalPrice: item.originalPrice,
                          quantity: 1,
                          brand: item.brand
                        })
                      );

                      dispatch(toggleWishlist(activeItem));
                    }}
                      className="
                              cursor-pointer mt-2 w-full
                              hover:bg-[var(--primary)]
                              text-[var(--primary-foreground)]
                              font-semibold
                              text-[11px]
                              py-1.5
                              rounded
                              bg-[var(--btn-primary-hover)]
                              transition-all duration-300
                            ">
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
