"use client";

import { useEffect, useRef, useState } from "react";

interface BannerImage {
  url: string;
  width: number;
}

interface Banner {
  _id: string;
  title?: string;
  desktopImages: BannerImage[];
  mobileImages: BannerImage[];
  redirectUrl: string;
}

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider = ({ banners }: BannerSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] =
    useState<"forward" | "backward">("forward");
  const [isMobile, setIsMobile] = useState(false);

  /* Detect screen size */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const total = banners.length;

  /* Auto slide (ping-pong logic) */
  useEffect(() => {
    if (total <= 1) return;

    const interval = setInterval(() => {
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
    }, 3500);

    return () => clearInterval(interval);
  }, [direction, total]);

  /* Apply transform */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.transition = "transform 1.2s ease-out";
    slider.style.transform = `translateX(-${index * 100}%)`;
  }, [index]);

  const goToSlide = (i: number) => {
    setIndex(i);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div ref={sliderRef} className="flex w-full">
        {banners.map((banner, i) => {
          const images: BannerImage[] = isMobile ? banner.mobileImages || [] : banner.desktopImages || [];
          const sortedImages = images.length > 0 ? [...images].sort((a, b) => b.width - a.width) : [];
          const largestImage = sortedImages[0];

          const srcSet = sortedImages.map((img) => `${img.url} ${img.width}w`).join(", ");

          return (
            <a
              key={banner._id}
              href={banner.redirectUrl}
              className="relative w-full shrink-0 block"
            >
              <div className="w-full relative">
                <img
                  src={largestImage?.url}
                  srcSet={srcSet}
                  sizes="100vw"
                  alt={banner.title || `banner-${i}`}
                  className={`w-full h-full ${isMobile ? "object-cover" : "object-cover"}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`
                h-2 w-2 rounded-full transition-all duration-300
                ${index === i ? "bg-white w-6" : "bg-white/50 hover:bg-white"}
              `}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;
