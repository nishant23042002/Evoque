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
        href: "/new-arrivals",
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
        href: "/categories/shirts",
        icon: PiShirtFolded,
        image: "/images/shirts.jpg",
      },
      {
        title: "T-Shirts",
        href: "/categories/t-shirts",
        icon: PiTShirt,
        image: "/images/t-shirts.jpeg"
      },
      {
        title: "Jeans",
        href: "/categories/jeans",
        icon: GiArmoredPants,
        image: "/images/jean.jpg"
      },
      {
        title: "Trousers",
        href: "/categories/trousers",
        icon: PiPantsDuotone,
        image: "/images/trouser.jpeg"
      }
    ],
  },

  {
    section: "COLLECTIONS",
    items: [
      {
        title: "Essentials",
        href: "/categories/essentials",
        icon: HiOutlineCollection,
        image: "/images/collections-essentials.jpg"
      },
      {
        title: "Limited Drop",
        href: "/categories/limited-drops",
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
