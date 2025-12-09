import { IconType } from "react-icons";
import { ICON_MAP } from "./iconsData";
export interface headerType {
    title: string;
    href: string;
    icon: IconType;
    mobileOnly?: boolean;
}

export const headerData: headerType[] = [
    {
        title: "Account",
        href: "/account",
        icon: ICON_MAP.account,
        mobileOnly: true,
    },
    {
        title: "Wishlist",
        href: "/wishlist",
        icon: ICON_MAP.wishlist,
    },
    {
        title: "Cart",
        href: "/cart",
        icon: ICON_MAP.cart,
    },
] as const;