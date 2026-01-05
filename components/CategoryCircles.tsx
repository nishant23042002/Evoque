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
        <section className="w-full py-8">
            {title && (
                <h2 className="text-center text-slate-700 text-xl font-semibold mb-6">
                    {title}
                </h2>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 px-4">
                {categories.map((item) => {
                    const href = item.slug
                        ? `/product-category/${categorySlug}/${item.slug}`
                        : `/product-category/${categorySlug}`;

                    const isActive = pathname === href;

                    return (
                        <Link
                            key={item.id}
                            href={href}
                            className="flex flex-col items-center min-w-20"
                        >
                            <div
                                className={clsx(
                                    "w-20 h-20 rounded-full overflow-hidden border transition-all duration-300",
                                    isActive
                                        ? "border-orange-500 ring-2 ring-orange-400"
                                        : "border-2 border-gray-300 hover:border-orange-400"
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
                                    "mt-2 text-[11px] font-medium uppercase tracking-wide",
                                    isActive ? "text-orange-600" : "text-gray-700"
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
