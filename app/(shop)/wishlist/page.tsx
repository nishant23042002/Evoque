"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import Footer from "@/components/Footer/Footer";
import { showProductToast } from "@/store/ui/ui.slice";



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

  /* =======================
     MASONRY CONFIG
  ======================= */

  const breakpoints = {
    default: 4,
    950: 3,
    640: 2,
  };

  /* =======================
     EMPTY STATE
  ======================= */
  if (!loading && !wishlistItems.length) {
    return (
      <>
        <div className="min-h-[90vh] px-4 py-6">

          {/* TITLE */}
          <h1 className="text-5xl tracking-wider font-bold">
            FAVOURITES
          </h1>

          {/* ITEM COUNT */}
          <p className="mt-8 text-sm tracking-wide font-medium">
            0 ITEMS
          </p>

          {/* DESCRIPTION */}
          <p className="mt-2 text-sm text-black/70">
            Tap the heart icon on items to save them here.
          </p>

          {/* BUTTON */}
          <Link
            href="/"
            className="
            inline-block mt-6
            border border-black
            px-14 py-4
            text-sm tracking-wide
            hover:bg-black hover:text-white
            transition-colors duration-200
          "
          >
            EXPLORE PRODUCTS
          </Link>

        </div>
        <Footer />
      </>
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

      <div className="w-full py-2 min-h-[95vh] overflow-hidden">
          <div className="mx-2 flex justify-between items-center py-6 z-20">
                <h1 className="text-4xl min-[400px]:text-5xl tracking-wider font-bold">WISHLIST</h1>
                <span className="text-sm">ITEMS [ {count} ]</span>
            </div>
        <div className="w-full flex flex-col lg:flex-row gap-1">
          <div className="w-full mb-12 lg:h-screen lg:overflow-y-auto scrollbar-hide">
            <Masonry
              breakpointCols={breakpoints}
              className="flex gap-1"
              columnClassName="space-y-1"
            >
              {wishlistItems.map((item: WishlistItem, index) => {
                const isWishlisted = wishlistIds.has(item.productId);

                return (
                  <Link
                    key={`wishlist-${item.productId}-${index}`}
                    href={`/products/${item.slug}`}
                    onClick={() => setActiveId(item.productId)}
                    className="block border border-(--border-light) cursor-pointer"
                  >
                    {/* COLUMN WRAPPER */}
                    <div className="flex flex-col w-full">

                      {/* IMAGE CARD */}
                      <div className="group relative w-full aspect-4/5 overflow-hidden">

                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500"
                          />
                        )}

                        <div className="hidden md:block pointer-events-none absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100" />

                        {/* TOP BAR */}
                        <div className="w-full">
                          <button className="absolute right-2 top-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(removeWishlistItem(item.productId));
                              dispatch(showProductToast({
                                name: item.name,
                                image: item.image,
                                type: "wishlist-remove"
                              }));
                            }}

                          >
                            <Heart
                              strokeWidth={1.4}
                              className={`h-5 w-5 cursor-pointer transition ${isWishlisted
                                ? "fill-primary text-primary scale-110"
                                : "text-(--text-secondary) hover:text-primary"
                                }`}
                              style={{ stroke: "var(--border-strong)" }}
                            />
                          </button>
                        </div>
                      </div>

                      {/* BOTTOM INFO — OUTSIDE */}
                      <div className="text-(--text-secondary)">
                        <div className="mx-1 py-2 flex flex-col text-xs max-[450px]:text-[11px]">
                          <p className="text-primary font-semibold">{item.brand}</p>
                          <p className="text-sm w-full uppercase truncate">{item.name}</p>
                          <div className="flex">
                            <span className="text-red-600 font-semibold mr-2">Rs.{item.price}</span>
                            {item.originalPrice && (
                              <span className="line-through text-(--text-secondary)">
                                Rs.{item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMoveToBag(item);
                          }}
                          className="
                            cursor-pointer w-full
                            border-(--border-light) hover:bg-white border-t
                            py-2 hover:text-primary font-bold
                            text-xs rounded-b-[3px]
                            transition-all duration-300
                            "
                        >
                          ADD TO BAG
                        </button>
                      </div>

                    </div>
                  </Link>

                )
              })}
            </Masonry>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}