import { ICON_MAP } from "./iconsData";

export const headerData = [
    {
        title: "Account",
        href: "/account",
        icon: ICON_MAP.account,
    },
    {
        title: "Notify",
        href: "/notify",
        icon: ICON_MAP.notify,
    },
    {
        title: "Cart",
        href: "/cart",
        icon: ICON_MAP.cart,
    },
] as const;