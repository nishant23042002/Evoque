// /app/(admin)/admin/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Inventory", href: "/admin/inventory" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Customers", href: "/admin/customers" },
    { name: "Marketing", href: "/admin/marketing" },
    { name: "Coupons", href: "/admin/coupons" },
    { name: "Roles", href: "/admin/roles" },
    { name: "Analytics", href: "/admin/analytics" },
    { name: "Settings", href: "/admin/settings" },
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
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-10 text-xs text-zinc-500">
                © 2026 The Layer Co.
            </div>
        </aside>
    );
}