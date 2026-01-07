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
            className={`relative group p-2 max-[550px]:hidden ${active ? "text-brand-red" : "text-neutral-800"
                }`}
        >
            <span className="hidden absolute top-0 right-0 text-slate-700 font-bold">0</span>
            <HeartIcon
                size={20}
                className={`text-inherit group-hover:text-brand-red ${active ? "text-brand-red" : "text-slate-800"
                    }`}
            />
            {/* Underline */}
            <span
                className={`
                    bg-brand-red absolute bottom-0 left-1/2 -translate-x-full
                    h-0.5 w-0 group-hover:w-1/3 transition-all duration-300
                    ${active && "w-1/4"}
                `}
            />
            <span
                className={`
                    bg-brand-red absolute bottom-0 left-1/2 translate-x-0
                    h-0.5 w-0 group-hover:w-1/3 transition-all duration-300
                    ${active && "w-1/4"}
                `}
            />
        </Link>
    );
};

export default WishList;
