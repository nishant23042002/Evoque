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
        className="object-cover"
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
          className="hidden md:block object-cover"
        />
      )}

      {mobile && (
        <Image
          src={mobile.url}
          alt={banner.title || ""}
          fill
          priority={priority}
          sizes="100vw"
          className="block md:hidden object-cover"
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
          forceDesktop
        />
        <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10  transition-opacity duration-300" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-6 md:px-16">
            <h1 className="text-red-600 font-bold leading-none uppercase
              text-4xl sm:text-6xl md:text-7xl">
              FLAT <br />
              15%* OFF
            </h1>
          </div>
        </div>
      </Link>

      {/* ================= GRID SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">

        {/* Card 1 */}
        <Link href={banners[2].redirectUrl || "#"} className="group block">
          <div className="group relative w-full aspect-4/5 md:aspect-14/16 overflow-hidden">
            <ResponsiveImage
              banner={banners[2]}
              sizes="50vw"
              forceMobile
            />
            <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10  transition-opacity duration-300" />
          </div>

          <div className="flex p-4 items-center justify-between">
            <h1 className="uppercase text-sm sm:text-lg group-hover:underline">
              {banners[2].title || "Sweatshirt Collection"}
            </h1>
            <ArrowRight size={18} />
          </div>
        </Link>

        {/* Card 2 */}
        <Link href={banners[3].redirectUrl || "#"} className="group block">
          <div className="group relative w-full aspect-4/5 md:aspect-14/16 overflow-hidden">
            <ResponsiveImage
              banner={banners[3]}
              sizes="50vw"
              forceMobile
            />
            <div className="absolute inset-0 bg-(--earth-charcoal) opacity-15 group-hover:opacity-10 transition-opacity duration-300" />
          </div>

          <div className="flex p-4 items-center justify-between">
            <h1 className="uppercase text-sm sm:text-lg group-hover:underline">
              {banners[3].title || "Printed Shirts"}
            </h1>
            <ArrowRight size={18} />
          </div>
        </Link>

      </div>
      {/* ================= SECOND BANNER ================= */}
      <Link
        href={banners[1].redirectUrl || "#"}
        className="group relative w-full max-[500px]:aspect-4/7 aspect-4/5 sm:aspect-4/5 md:aspect-21/12 xl:aspect-21/11 block"
      >
        <ResponsiveImage
          banner={banners[1]}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-(--earth-charcoal) opacity-10 group-hover:opacity-5  transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 absolute right-0 md:px-16">
            <h1 className="text-red-600 font-bold leading-none uppercase
              text-4xl sm:text-6xl md:text-7xl">
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