"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";


const Cart = () => {
    const pathname = usePathname();
    const active = pathname === "/cart";
    const cartCount = useAppSelector(
        (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );

    return (
        <Link
            href="/cart"
            className={`relative group ${active ? "text-brand-red" : "text-neutral-800"
                }`}
        >
            <span
                key={cartCount}
                className="
                            absolute -top-2 -right-1.5
                            min-w-[12px] h-[13px]
                            p-0.75
                            bg-[var(--primary)]
                            flex items-center justify-center
                            rounded-full
                            bg-brand-red
                            text-white
                            text-[8px]
                            font-extrabold
                            animate-scale-in
                        "
            >
                {cartCount}
            </span>
            <ShoppingBag
                size={20}
                strokeWidth={2.2}
                className={`
                            text-[var(--foreground)]
                                hover:text-[var(--primary)]
                                transition-colors duration-200
                            ${active ? "text-[var(--primary)]" : "text-[var(--foreground)]"}
                            group-hover:text-[var(--primary)]
                        `}
            />
        </Link>
    );
};

export default Cart;
