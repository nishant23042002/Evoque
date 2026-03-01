// /app/(admin)/admin/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: "/images/dashboard.png" },
    { name: "Products", href: "/admin/products", icon: "/images/products.png" },
    { name: "Inventory", href: "/admin/inventory", icon: "/images/inventory.png" },
    { name: "Orders", href: "/admin/orders", icon: "/images/orders.png" },
    { name: "Customers", href: "/admin/customers", icon: "/images/customers.png" },
    { name: "Marketing", href: "/admin/marketing", icon: "/images/marketing.png" },
    { name: "Coupons", href: "/admin/coupons", icon: "/images/coupons.png" },
    { name: "Roles", href: "/admin/roles", icon: "/images/roles.png" },
    { name: "Analytics", href: "/admin/analytics", icon: "/images/analytics.png" },
    { name: "Settings", href: "/admin/settings", icon: "/images/setting.png" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-zinc-950 p-6 hidden md:flex flex-col">
            <h2 className="text-xl font-semibold mb-10 tracking-wide">
                The Layer Co. <br /> <span>ADMIN</span>
            </h2>

            <nav className="space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                            "block px-4 py-2 text-sm transition",
                            pathname === item.href
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        )}
                    >
                        <div className="flex w-full gap-4 items-center">
                            <span>
                                <Image width={20} height={20} src={item.icon} alt="" />
                            </span>
                            <span className="uppercase text-xs font-medium">
                                {item.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-10 text-xs text-zinc-500">
                © 2026 The Layer Co.
            </div>
        </aside>
    );
}