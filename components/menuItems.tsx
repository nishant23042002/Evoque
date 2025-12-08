"use client"
import { headerData } from "@/constants/headerData";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItems = () => {
    const pathName = usePathname();
    return (
        <div className="max-sm:gap-3 max-md:gap-8 md:gap-12 font-bold capitalize flex justify-center items-center">
            {headerData?.map((item) => {
                const Icon = item.icon;
                return (
                    <Link className={`hover:text-brand-red p-1 hoverEffect relative group ${pathName === item?.href && "text-brand-red"}`} key={item?.title} href={item.href}>

                        <Icon
                            className={`
    min-[450px]:text-2xl font-extrabold 
    text-inherit 
    group-hover:text-brand-red 
    ${pathName === item?.href ? "text-brand-red" : "text-neutral-800"}
  `}
                        />


                        <span className={`bg-brand-red absolute -bottom-1 
        left-1/2 -translate-x-full
        w-0 h-0.5 group-hover:w-1/2 hoverEffect
        ${pathName === item?.href && "w-1/2"}`}
                        />

                        <span
                            className={`bg-brand-red-dark absolute -bottom-1 
        left-1/2 translate-x-[0%]
        w-0 h-0.5 group-hover:w-1/2 hoverEffect
        ${pathName === item?.href && "w-1/2"}`}
                        />
                    </Link>

                )
            })}
        </div>
    )
}

export default MenuItems;