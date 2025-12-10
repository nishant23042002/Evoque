"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo } from "react";

const Masonry = dynamic(() => import("react-masonry-css"), { ssr: false });

interface MasonryProps {
    images: string[];
}

export default function MasonryGrid({ images }: MasonryProps) {
    const breakpoints = {
        default: 7,
        1600: 6,
        1400: 5,
        1200: 4,
        900: 3,
        700: 2,
        550: 1,
    };
    
    const heights = useMemo(() => {
    return images.map(() => 250 + Math.floor(Math.random() * 250));
    }, [images]);



    return (
        <Masonry
            breakpointCols={breakpoints}
            className="flex gap-4 w-full"
            columnClassName="masonry-column"
        >
            {images.map((img, index) => {
                return (
                    <div
                        key={index}
                        className="relative w-full mb-4 rounded-xl overflow-hidden"
                        style={{ height: heights[index] }}
                    >
                        <Image
                            src={img}
                            alt="product"
                            fill
                            className="object-cover"
                        />
                    </div>
                );
            })}
        </Masonry>
    );
}
