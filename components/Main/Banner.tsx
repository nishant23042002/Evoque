"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const banners = [
    "/images/banner.webp",
    "/images/banner.webp",
    "/images/banner3.jpg",
    "/images/banner3.jpg",
    "/images/banner3.jpg",
];

const BannerSlider = () => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<"forward" | "backward">("forward");
    const [isHovering, setIsHovering] = useState(false);

    const total = banners.length;

    /* Auto slide (ping-pong logic) */
    useEffect(() => {
        if (isHovering) return;

        const interval = setInterval(() => {
            setIndex((prev) => {
                // Moving forward
                if (direction === "forward") {
                    if (prev === total - 1) {
                        setDirection("backward");
                        return prev - 1;
                    }
                    return prev + 1;
                }

                // Moving backward
                if (prev === 0) {
                    setDirection("forward");
                    return prev + 1;
                }
                return prev - 1;
            });
        }, 3500);

        return () => clearInterval(interval);
    }, [direction, isHovering, total]);

    /* Apply transform */
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.style.transition = "transform 2s ease";
        slider.style.transform = `translateX(-${index * 100}%)`;
    }, [index]);

    /* Pagination click */
    const goToSlide = (i: number) => {
        setIndex(i);
    };

    return (
        <div
            className="relative w-full overflow-hidden my-2 rounded-xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Slides */}
            <div ref={sliderRef} className="flex">
                {banners.map((src, i) => (
                    <div
                        key={i}
                        className="relative w-full shrink-0 max-md:h-50 h-75 aspect-5/1"
                    >
                        <Image
                            src={src}
                            alt={`banner-${i}`}
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        className={`
              h-2 w-2 rounded-full transition-all duration-300
              ${index === i
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white"
                            }
            `}
                        aria-label={`Go to banner ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerSlider;
