"use client";

import Image from "next/image";
import { useState } from "react";
import { clothingItems } from "@/data/clothingItems";
import dynamic from "next/dynamic";
import Link from "next/link";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

export default function WishlistPinterest() {
  const [activeItem, setActiveItem] = useState(clothingItems[0]);

  const breakpoints = {
    default: 4,
    1400: 3,
    1200: 2,
    768: 2,
    500: 1,
  };

 const [heights] = useState<number[]>(() => clothingItems.map(() => 250 + Math.floor(Math.random() * 250)) );

  return (
    <div className="ml-18 max-[490px]:ml-15 px-2 py-6">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT — BIG ITEM */}
        <div className="hidden lg:block lg:w-[45%]">
          <div className="sticky top-20">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-white border border-black/10">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-fill"
              />
            </div>

            <div className="mt-4 p-3">
              <h2 className="text-lg font-medium">{activeItem.title}</h2>
              <p className="text-xl font-semibold mt-1">
                Rs.{activeItem.price}
              </p>

              <button className="mt-4 w-full bg-brand-red text-white py-3 rounded-xl hover:bg-red-700 transition">
                MOVE TO BAG
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — MASONRY */}
        <div className="w-full lg:w-[55%]">
          <Masonry
            breakpointCols={breakpoints}
            className="flex gap-4"
            columnClassName="space-y-4"
          >
            {clothingItems.map((item, index) => (
              <Link
                key={index}
                href={`/product/${item.slug}`}
                onClick={() => setActiveItem(item)}
                className="block cursor-pointer"
              >
                <div
                  className="relative w-full rounded-xl overflow-hidden bg-gray-100"
                  style={{ height: heights[index] }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </Masonry>
        </div>

      </div>
    </div>
  );
}
