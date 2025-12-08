import { LEFT_NAV_ITEMS } from "./leftNavIcons";

export const leftNav = [
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