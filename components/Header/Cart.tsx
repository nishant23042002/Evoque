"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";


const Cart = () => {
    const pathname = usePathname();
    const active = pathname === "/cart";

    return (
        <Link
            href="/cart"
            className={`relative group  ${active ? "text-brand-red" : "text-neutral-800"
                }`}
        >
            <span className="absolute -top-2.5 text-slate-700 -right-1 font-bold"><span className="relative text-brand-red right-0.5 -top-1">0</span></span>
            <ShoppingBag
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

export default Cart;
