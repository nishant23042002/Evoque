import {
  HiOutlineHome,
  HiOutlineFire,
  HiOutlineCollection,
  HiOutlineUser,
  HiOutlineHeart,
} from "react-icons/hi";
import { MdFiberNew } from "react-icons/md";
import { IconType } from "react-icons";
import { PiShirtFolded, PiTShirt, PiPantsDuotone } from "react-icons/pi";
import { GiArmoredPants } from "react-icons/gi";
import { Flame } from 'lucide-react';

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
        href: "/product-category/new-arrivals",
        icon: MdFiberNew,
      },
      {
        title: "Best Sellers",
        href: "/best-sellers",
        icon: Flame,
      }
    ],
  },

  {
    section: "CATEGORIES",
    items: [
      {
        title: "Shirts",
        href: "/product-category/shirts",
        icon: PiShirtFolded,
        image: "/images/category-shirt.jpg",
      },
      {
        title: "T-Shirts",
        href: "/product-category/t-shirts",
        icon: PiTShirt,
        image: "/images/category-tshirt.jpg"
      },
      {
        title: "Jeans",
        href: "/product-category/jeans",
        icon: GiArmoredPants,
        image: "/images/category-jeans.jpeg"
      },
      {
        title: "Trousers",
        href: "/product-category/trousers",
        icon: PiPantsDuotone,
        image: "/images/category-trousers.jpg"
      }
    ],
  },

  {
    section: "COLLECTIONS",
    items: [
      {
        title: "Essentials",
        href: "/product-category/essentials",
        icon: HiOutlineCollection,
        image: "/images/collections-essentials.jpg"
      },
      {
        title: "Limited Drop",
        href: "/product-category/limited-drops",
        icon: HiOutlineFire,
        image: "/images/collections-limited-drops.png"
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
