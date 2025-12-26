"use client";

import Image from "next/image";
import { useState } from "react";
import { clothingItems } from "@/data/clothingItems";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MdDeleteOutline } from "react-icons/md";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

export default function Wishlist() {
  const [activeItem, setActiveItem] = useState(clothingItems[0]);

  const breakpoints = {
    default: 4,
    1500: 3,
    1200: 2,
    768: 2,
    500: 1,
  };

  const MIN_HEIGHT = 320;
  const MAX_HEIGHT = 500;

  const [heights] = useState<number[]>(() =>
    clothingItems.map(() =>
      Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT
    )
  );


  return (
    <div className="ml-18 max-[768px]:ml-15 px-2 py-3">
      <div className="flex flex-col lg:flex-row gap-6 justify-center">

        {/* LEFT — BIG ITEM */}
        <div className="hidden lg:block lg:w-[40%] border-r-2 p-2">
          <div className="sticky top-20">
            <div className="relative w-full h-150 overflow-hidden">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                className="object-contain"
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
            {clothingItems.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                href={`/product/${item.slug}`}
                onClick={() => setActiveItem(item)}
                className="block cursor-pointer"
              >
                <div
                  className="group relative w-full rounded-xl overflow-hidden bg-gray-100"
                  style={{ height: heights[index] }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                  {/* Hover Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


                  <div className="absolute flex justify-between top-2 left-2 right-2">
                    <h3 className="text-[11px] text-slate-800 font-semibold">
                      {item.brand}
                    </h3>
                    <MdDeleteOutline className="text-slate-600 hover:text-red-500 cursor-pointer" />
                  </div>
                  <div className="absolute bottom-0 w-full bg-black/20 p-1.5 rounded-b-xl text-white">
                    <p className="text-[11px] mb-1">{item.title}</p>

                    <div className="flex justify-between text-[11px]">
                      <span>Price: {item.price}</span>
                      <span className="line-through text-gray-300">
                        {item.originalPrice}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] mt-1">
                      <span>Size: {item.size}</span>
                      <span>Qty: {item.qty}</span>
                    </div>

                    <button className="cursor-pointer mt-2 w-full border border-white/30 text-[11px] py-1.5 rounded hover:bg-brand-red transition duration-250">
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
