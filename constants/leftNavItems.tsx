import { LEFT_NAV_ITEMS } from "./leftNavIcons";
import { IconType } from "react-icons";

export interface LeftNavItem {
    title: string;
    href: string;
    icon: IconType;
}

export const leftNav: LeftNavItem[] = [
    {
        title: "Home",
        href: "/",
        icon: LEFT_NAV_ITEMS.home,
    },
    {
        title: "Notify",
        href: "/notify",
        icon: LEFT_NAV_ITEMS.notify,
    },
    {
        title: "Account",
        href: "/account",
        icon: LEFT_NAV_ITEMS.account
    },
    {
        title: "Settings",
        href: "/settings",
        icon: LEFT_NAV_ITEMS.settings,
    },
    {
        title: "Latest",
        href: "/latest",
        icon: LEFT_NAV_ITEMS.latest,
    },
] as const;