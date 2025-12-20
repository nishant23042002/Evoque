import {
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineCollection,
  HiOutlineUser,
  HiOutlineHeart,
} from "react-icons/hi";
import { IconType } from "react-icons";
import { PiShirtFolded, PiTShirt, PiPantsDuotone } from "react-icons/pi";
import { GiArmoredPants } from "react-icons/gi";

export interface LeftNavItem {
  title: string;
  href: string;
  icon: IconType;
  image?: string;
}

export interface LeftNavSection {
  section: string;
  items: LeftNavItem[];
}


export const leftNav: LeftNavSection[] = [
  {
    section: "SHOP",
    items: [
      {
        title: "Home",
        href: "/",
        icon: HiOutlineHome,
      },
      {
        title: "New Arrivals",
        href: "/latest",
        icon: HiOutlineSparkles,
      },
      {
        title: "Best Sellers",
        href: "/best-sellers",
        icon: HiOutlineFire,
      },
      {
        title: "Shop All",
        href: "/shop",
        icon: HiOutlineCollection,
      },
    ],
  },

  {
    section: "CATEGORIES",
    items: [
      {
        title: "Shirts",
        href: "/category/shirts",
        icon: PiShirtFolded,
        image: "/category-shirt.webp",
      },
      {
        title: "T-Shirts",
        href: "/category/tshirts",
        icon: PiTShirt,
        image: "/category-tshirt.webp"
      },
      {
        title: "Jeans",
        href: "/category/jeans",
        icon: GiArmoredPants,
        image: "/category-bottom.webp"
      },
      {
        title: "Trousers",
        href: "/category/trousers",
        icon: PiPantsDuotone,
        image: "/category-bottom.webp"
      }
    ],
  },

  {
    section: "COLLECTIONS",
    items: [
      {
        title: "Essentials",
        href: "/collections/essentials",
        icon: HiOutlineCollection,
        image: "/collections-essential.webp"
      },
      {
        title: "Limited Drop",
        href: "/collections/limited",
        icon: HiOutlineFire,
        image: "/collections-limited-drops.png"
      },
    ],
  },

  {
    section: "ACCOUNT",
    items: [
      {
        title: "Wishlist",
        href: "/wishlist",
        icon: HiOutlineHeart,
      },
      {
        title: "My Account",
        href: "/account",
        icon: HiOutlineUser,
      },
    ],
  },
];
