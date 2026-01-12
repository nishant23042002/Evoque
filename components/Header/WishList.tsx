"use client";

import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const WishList = () => {
    const pathname = usePathname();
    const active = pathname === "/wishlist";

    return (
        <Link
            href="/wishlist"
            className={`relative group max-[550px]:hidden ${active ? "text-brand-red" : "text-neutral-800"
                }`}
        >
            <span className="hidden absolute top-0 right-0 text-slate-700 font-bold">0</span>
            <HeartIcon
                size={20}
                strokeWidth={2.2}
                className={`
    transition-colors duration-200
    ${active ? "text-brand-red" : "text-slate-800"}
    group-hover:text-brand-red
  `}
            />
        </Link>
    );
};

export default WishList;
