"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CategoryCircle } from "@/constants/categoryItems";

interface Props {
    title?: string;
    categories: CategoryCircle[];
}

const CategoryCircles = ({ title, categories }: Props) => {
    const pathname = usePathname();

    return (
        <section className="w-full py-8">
            {title && (
                <h2 className="text-center text-slate-700 text-xl font-semibold mb-6">
                    {title}
                </h2>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 overflow-x-auto px-4 scrollbar-hide">
                {categories.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="flex flex-col items-center min-w-20"
                        >
                            <div
                                className={clsx(
                                    "w-20 h-20 rounded-full overflow-hidden border transition-all duration-300",
                                    isActive
                                        ? "border-orange-500 ring-2 ring-orange-400"
                                        : "border-gray-300 hover:border-black/60"
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
