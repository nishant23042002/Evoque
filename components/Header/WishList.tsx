"use client";

import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks";

const WishList = () => {
    const pathname = usePathname();
    const active = pathname === "/wishlist";
    const selectWishlistCount = (state: RootState) =>
        state.wishlist.items.length;
    const count = useAppSelector(selectWishlistCount);

    return (
        <Link
            href="/wishlist"
            className={`relative group max-[550px]:hidden ${active ? "text-brand-red" : "text-neutral-800"
                }`}
        >
            <span
                key={count}
                className="
                            absolute -top-1.5 -right-1.5
                            min-w-[14px] h-[14px]
                            px-1
                            flex items-center justify-center
                            rounded-full
                            bg-brand-red
                            text-white
                            text-[10px]
                            font-semibold
                            animate-scale-in
                        "
            >
                {count}
            </span>

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
