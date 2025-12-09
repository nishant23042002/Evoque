// iconMap.ts
import { RiAccountCircleFill } from "react-icons/ri";
import { MdShoppingCart } from "react-icons/md";
import { GoHeartFill } from "react-icons/go";

export const ICON_MAP = {
  account: RiAccountCircleFill,
  wishlist: GoHeartFill,
  cart: MdShoppingCart,
} as const;
