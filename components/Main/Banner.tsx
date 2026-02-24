"use client";

import Image from "next/image";
import Link from "next/link";
import { Banner, BannerImage } from "@/types/ProductTypes";
import { ArrowRight } from "lucide-react";

interface BannerSliderProps {
  banners: Banner[];
}
const getBestImage = (images: BannerImage[]) =>
  images?.length
    ? [...images].sort((a, b) => b.width - a.width)[0]
    : null;
const ResponsiveImage = ({
  banner,
  sizes,
  priority = false,
  forceMobile = false,
  forceDesktop = false,
}: {
  banner: Banner;
  sizes: string;
  priority?: boolean;
  forceMobile?: boolean;
  forceDesktop?: boolean;
}) => {
  const desktop = getBestImage(banner.desktopImages);
  const mobile = getBestImage(banner.mobileImages);

  if (!desktop && !mobile) return null;

  // ✅ Always desktop
  if (forceDesktop && desktop) {
    return (
      <Image
        src={desktop.url}
        alt={banner.title || ""}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  // ✅ Always mobile
  if (forceMobile && mobile) {
    return (
      <Image
        src={mobile.url}
        alt={banner.title || ""}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover md:object-contain"
      />
    );
  }

  // ✅ Normal responsive behavior
  return (
    <>
      {desktop && (
        <Image
          src={desktop.url}
          alt={banner.title || ""}
          fill
          priority={priority}
          sizes={sizes}
          className="hidden sm:block object-cover"
        />
      )}

      {mobile && (
        <Image
          src={mobile.url}
          alt={banner.title || ""}
          fill
          priority={priority}
          sizes="100vw"
          className="block sm:hidden object-cover"
        />
      )}
    </>
  );
};

const BannerList = ({ banners }: BannerSliderProps) => {


  if (!banners || banners.length < 4) return null;


  return (
    <div className="w-full flex flex-col">

      {/* ================= HERO BANNER ================= */}
      <Link
        href={banners[0].redirectUrl || "#"}
        className="group relative w-full max-[500px]:aspect-4/7 aspect-4/5 sm:aspect-4/5 md:aspect-21/12 xl:aspect-21/10 block"
      >
        <ResponsiveImage
          banner={banners[0]}
          sizes="100vw"
          priority

        />
        <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10  transition-opacity duration-300" />

        <div className="absolute right-0 top-1/4 md:left-0 flex items-center">
          <div className="asolute px-6 md:px-9">
            <h1 className="text-red-600 font-bold leading-none uppercase
              text-2xl sm:text-4xl lg:text-6xl">
              FLAT <br />
              15%* OFF
            </h1>
          </div>
        </div>
      </Link>

      {/* ================= GRID SECTION ================= */}
      <div className="grid grid-cols-2 md:grid-cols-2 w-full">

        {/* Card 1 */}
        <Link href={banners[2].redirectUrl || "#"} className="group block">
          <div className="group relative w-full aspect-3/5 sm:aspect-4/6 md:aspect-4/5 lg:aspect-12/14 overflow-hidden">
            <ResponsiveImage
              banner={banners[2]}
              sizes="50vw"
              forceMobile
            />
            <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10  transition-opacity duration-300" />
            <div className="absolute bg-black/20 w-full bottom-0 flex py-4 px-2 items-center justify-between">
              <h1 className="uppercase text-xs text-white truncate w-[90%] sm:text-lg group-hover:underline underline-offset-2">
                {banners[2].title || "Sweatshirt Collection"}
              </h1>
              <ArrowRight className="text-white" size={18} />
            </div>
          </div>

        </Link>

        {/* Card 2 */}
        <Link href={banners[3].redirectUrl || "#"} className="group block">
          <div className="group relative w-full aspect-3/5 sm:aspect-4/6 md:aspect-4/5 lg:aspect-12/14 overflow-hidden">
            <ResponsiveImage
              banner={banners[3]}
              sizes="50vw"
              forceMobile
            />
            <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="absolute bottom-0 w-full bg-black/20 flex py-4 px-2 items-center justify-between">
            <h1 className="uppercase text-xs text-white font-light truncate w-[90%] sm:text-lg group-hover:underline underline-offset-2">
              {banners[3].title || "Printed Shirts"}
            </h1>
            <ArrowRight className="text-white" size={18} />
          </div>
          </div>

        </Link>

      </div>
      {/* ================= SECOND BANNER ================= */}
      <Link
        href={banners[1].redirectUrl || "#"}
        className="group relative w-full max-[500px]:aspect-4/7 aspect-4/5 sm:aspect-4/5 md:aspect-21/12 xl:aspect-21/10 block"
      >
        <ResponsiveImage
          banner={banners[1]}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-(--earth-charcoal) opacity-10 group-hover:opacity-5  transition-opacity duration-300" />
        <div className="absolute right-0 top-1/2 md:left-0 flex items-center">
          <div className="asolute px-6 md:px-9">
            <h1 className="text-red-600 font-bold leading-none uppercase
              text-2xl sm:text-4xl lg:text-6xl">
              FLAT <br />
              25%* OFF
            </h1>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BannerList;