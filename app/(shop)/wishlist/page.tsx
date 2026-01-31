"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Heart } from "lucide-react";
import { fetchWishlist, removeWishlistItem } from "@/store/wishlist/wishlist.thunks";
import { RootState } from "@/store";
import { WishlistItem } from "@/types/WishlistTypes";
import SelectedVariantModal from "./SelectVariantModal";
import { selectWishlistIds } from "@/store/wishlist/wishlist.selector";
import { addCartItem } from "@/store/cart/cart.thunks";



const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

export default function Wishlist() {
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const loading = useAppSelector(
    (state: RootState) => state.wishlist.loading
  );


  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WishlistItem | null>(null);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const wishlistIds = useAppSelector(selectWishlistIds);


  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToBag = (item: WishlistItem) => {
    if (!item.product || !item.product.variants?.length) {
      console.warn("Product data not ready yet", item);
      return;
    }

    setSelectedProduct(item);
    setOpenVariantModal(true);
  };

  const closeModal = () => {
    setOpenVariantModal(false);
    setSelectedProduct(null);
  };


  const selectWishlistCount = (state: RootState) =>
    state.wishlist.items.length;

  const count = useAppSelector(selectWishlistCount);



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
      const id = product?.productId;

      // 🔒 SAFETY GUARD
      if (!id) return buckets[0];

      let seed = 0;
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
  if (!loading && !wishlistItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[95vh] text-center px-6">
        {/* Icon */}
        <div className="mb-2 animate-float flex items-center justify-center w-20 h-20 rounded-full bg-(--earth-charcoal)/10">
          <Heart className="w-10 h-10 text-primary" />
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-primary">
          Your wishlist is empty
        </h2>
        <p className="mt-2 text-sm font-medium text-(--linen-800)/70 max-w-sm">
          Save your favourite items here and come back anytime to find them quickly.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium
                          bg-primary text-black hover:opacity-90 transition"
        >
          <span className="text-(--linen-100)">
            Explore Products
          </span>
        </Link>
      </div>
    );
  }



  return (
    <>
      {selectedProduct && (
        <SelectedVariantModal
          key={selectedProduct?.productId}
          open={openVariantModal}
          product={selectedProduct.product} // ✅ FULL PRODUCT
          onClose={closeModal}
          onConfirm={({ product, variant, size, image }) => {
            if (!variant.pricing || variant.pricing.price == null) {
              return; // ⛔ impossible cart state
            }

            dispatch(addCartItem({
              productId: product._id.toString(),
              name: product.productName,
              slug: product.slug,
              image,
              price: variant.pricing.price,
              originalPrice: variant.pricing.originalPrice ?? 0,
              quantity: 1,
              size: size.size,
              variantSku: size.variantSku,
              color: {
                name: variant.color.name,
                slug: variant.color.slug,
              },
              brand: product.brand,
            }));


            dispatch(removeWishlistItem(selectedProduct.productId));
            closeModal();
          }}
        />
      )}

      <div className="w-full px-2 py-2 bg-(--linen-100) min-h-[95vh] overflow-hidden">
        <div className="w-full flex flex-col lg:flex-row gap-2">
          <div className="flex flex-col w-[70%] lg:sticky top-0 scrollbar-hide self-start h-fit">

            <div className="text-5xl flex max-lg:flex-col pb-2  lg:justify-between lg:items-center text-(--linen-800) font-semibold tracking-tight">
              <span>Favourites</span>
              <span className="text-lg tracking-wide font-light">{count} ITEM</span>
            </div>


            {/* LEFT — BIG ITEM */}
            {activeItem && (
              <div className="hidden lg:block">
                <div className="sticky top-20 border border-(--border-light)">

                  {/* IMAGE */}
                  <div className="relative rounded-[3px] w-full h-135 overflow-hidden">
                    <Link href={`/products/${activeItem.slug}`}>
                      {activeItem.image ? (
                        <Image
                          src={activeItem.image}
                          alt={activeItem.name}
                          fill
                          className="object-cover object-[50%_40%]"
                        />
                      ) : (
                        <div className="w-full h-full bg-(--surface-muted)" />
                      )}
                    </Link>


                    {/* BRAND TAG */}
                    <span className="absolute top-2 left-2 text-xs font-semibold text-foreground">
                      {activeItem.brand}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-3 py-3 mx-2">
                    <h2 className="text-lg font-medium text-foreground">
                      {activeItem.name}
                    </h2>

                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-semibold text-primary">
                        ₹{activeItem.price}
                      </span>

                      {activeItem.originalPrice && (
                        <span className="line-through text-sm text-(--text-muted)">
                          ₹{activeItem.originalPrice}
                        </span>
                      )}
                    </div>

                    <button onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      handleMoveToBag(activeItem);

                    }}
                      className="border border-(--border-strong)
                            cursor-pointer mt-2 w-full
                            hover:bg-(--btn-primary-bg)
                            text-(--btn-primary-text)
                            font-semibold
                            py-3
                            rounded-[3px]                         
                            bg-(--btn-primary-hover)
                            transition-all duration-300
                          ">
                      MOVE TO BAG
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>



          {/* RIGHT — MASONRY */}
          <div className="w-full mb-12 lg:h-[90vh] lg:overflow-y-auto scrollbar-hide">
            <Masonry
              breakpointCols={breakpoints}
              className="flex gap-2 "
              columnClassName="space-y-2"
            >
              {wishlistItems.map((item, index) => {
                const isWishlisted = wishlistIds.has(item.productId);

                return (
                  <Link
                    key={`wishlist-${item.productId}-${index}`}
                    href={`/products/${item.slug}`}
                    onClick={() => setActiveId(item.productId)}
                    className="block cursor-pointer border border-(--border-light) rounded-[3px]"
                  >
                    <div
                      className="group relative w-full rounded-[3px] overflow-hidden bg-(--surface-muted)"
                      style={{ height: heights[index] ?? 350 }}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                        />
                      )}


                      <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* TOP BAR */}
                      <div className="absolute flex justify-between top-2 left-2 right-2">
                        <h3 className="text-[11px] text-foreground font-semibold">
                          {item?.brand}
                        </h3>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(removeWishlistItem(item.productId));
                          }}
                          className="p-1.5 border border-(--border-light) cursor-pointer rounded-full bg-(--surface) shadow z-30"
                        >
                          <Heart
                            strokeWidth={0.9}
                            className={`h-5 w-5 transition ${isWishlisted
                              ? "fill-primary text-primary scale-110"
                              : "text-(--text-secondary) hover:text-primary"
                              }`}
                          />
                        </button>
                      </div>

                      {/* BOTTOM INFO */}
                      <div className="absolute bottom-0 w-full bg-(--earth-charcoal)/30 p-1.5 text-(--text-inverse)">
                        <p className="text-sm mb-1">{item.name}</p>

                        <div className="flex justify-between text-[11px]">
                          <span className="text-md">Price: {item.price}</span>
                          {item.originalPrice && (
                            <span className="line-through text-muted/70 text-[12px]">
                              {item.originalPrice}
                            </span>
                          )}
                        </div>

                        <button onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          handleMoveToBag(item);
                        }}
                          className="border border-(--border-strong)
                              cursor-pointer mt-2 w-full
                              hover:bg-primary
                              text-primary-foreground
                              font-semibold
                              text-[11px]
                              py-1.5
                              rounded-[3px]
                              bg-(--btn-primary-hover)
                              transition-all duration-300
                            ">
                          Move to Bag
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </Masonry>
          </div>
        </div>
      </div>
    </>
  );
}