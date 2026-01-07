"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CategoryCircle } from "@/constants/categoryItems";

interface Props {
    title?: string;
    categories: CategoryCircle[];
    categorySlug: string;
}

const CategoryCircles = ({ title, categories, categorySlug }: Props) => {
    const pathname = usePathname();

    return (
        <section className="py-2">

            {title && (
                <h2 className="text-slate-700 text-center text-md font-semibold px-4">
                    {title}
                </h2>
            )}
            <div className="flex w-[90%] mx-auto flex-nowrap overflow-auto items-center justify-start gap-4 p-3 scrollbar-hide">
                {categories.map((item) => {
                    const href = `/categories/${item.slug || categorySlug}`;

                    const isActive = pathname === href;

                    return (
                        <Link
                            key={item.id}
                            href={href}
                            className="flex flex-col items-center min-w-20"
                        >
                            <div
                                className={clsx(
                                    "w-20 h-20 rounded-full hover:border-brand-red overflow-hidden border transition-all duration-300",
                                    isActive
                                        ? "border-brand-red  ring-2 ring-brand-red"
                                        : "border-2 border-gray-300 hover:ring-brand-red"
                                )}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.label}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <span
                                className={clsx(
                                    "mt-2 text-[11px] font-medium text-nowrap uppercase truncate tracking-wide",
                                    isActive ? "text-brand-red" : "text-slate-800"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryCircles;
