"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Banner,BannerImage } from "@/types/ProductTypes";

interface BannerSliderProps {
  banners: Banner[];
}

const AUTO_SLIDE_DELAY = 2500;
const DESKTOP_BREAKPOINT = 1000;

const BannerSlider = ({ banners }: BannerSliderProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isMobile, setIsMobile] = useState(false);

  const total = banners.length;

  /* -------------------------------
   * Screen size detection
   * ------------------------------- */
  useEffect(() => {
    const update = () =>
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* -------------------------------
   * Auto fade switch (ping-pong)
   * ------------------------------- */
  const startAutoSlide = () => {
    if (intervalRef.current || total <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        if (direction === "forward") {
          if (prev === total - 1) {
            setDirection("backward");
            return prev - 1;
          }
          return prev + 1;
        }

        if (prev === 0) {
          setDirection("forward");
          return prev + 1;
        }
        return prev - 1;
      });
    }, AUTO_SLIDE_DELAY);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [direction, total]);



  /* -------------------------------
   * Helpers
   * ------------------------------- */
  const getBestImage = (images: BannerImage[]) =>
    images?.length
      ? [...images].sort((a, b) => b.width - a.width)[0]
      : null;

  const goToSlide = (i: number) => {
    stopAutoSlide();
    setIndex(i);
    startAutoSlide();
  };

  return (
    <div className="relative overflow-hidden">
      {/* FADE STACK */}
      <div
        className={`
                  relative w-full overflow-hidden transition-[aspect-ratio] duration-300
                  ${isMobile
            ? "aspect-4/5"
            : "aspect-21/9"
          }
                `}
      >

        {banners.map((banner, i) => {
          const images = isMobile
            ? banner.mobileImages
            : banner.desktopImages;

          const image = getBestImage(images);
          const isActive = i === index;

          return (
            <a
              key={banner._id}
              href={banner.redirectUrl}
              aria-label={banner.title || `banner-${i}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out
                ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}
              `}
            >
              {image && (
                <Image
                  src={image.url}
                  alt={banner.title || `banner-${i}`}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  quality={85}
                  className="min-[1000px]:object-cover object-center"
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1 rounded-full transition-all duration-300
                ${index === i
                  ? "w-9 bg-black/70"
                  : "w-3 bg-black/20 cursor-pointer hover:bg-white"
                }`}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
