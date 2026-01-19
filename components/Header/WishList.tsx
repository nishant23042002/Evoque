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
                            absolute -top-2 -right-1.5
                            min-w-[12px] h-[13px]
                            p-0.75
                            flex items-center justify-center
                            rounded-full
                            bg-brand-red
                            text-white
                            bg-[var(--primary)]
                            text-[8px]
                            font-extrabold
                            animate-scale-in
                        "
            >
                {count}
            </span>

            <HeartIcon
                size={20}
                strokeWidth={2.2}
                className={`text-[var(--foreground)]
                                hover:text-[var(--primary)]
                                transition-colors duration-200                          
                            ${active ? "text-[var(--primary)]" : "text-[var(--foreground)]"}
                            group-hover:text-[var(--primary)]
                        `}
            />
        </Link>
    );
};

export default WishList;
