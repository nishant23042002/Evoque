"use client"
import Image from "next/image";
import { leftNav } from "@/constants/leftNavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftMenu = () => {
    const pathName = usePathname();
    return (
        <div className="p-4 w-28 border-r border-black/10 bg-red-100">
            <div>
                <Image alt="evoque-logo" src="/Evoque1.png" width={100} height={100} />
            </div>
            <div className="my-18 p-2 flex flex-col justify-around gap-18 items-center">
                {leftNav.map((item) => {
                    const Icon = item.icon; // instantiate icon component

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`relative group p-2 
    ${pathName === item.href ? "text-brand-red" : "text-neutral-800"}
  `}
                        >
                            {/* ICON with active + hover color */}
                            <Icon
                                size={28}
                                className={`
            text-inherit 
            group-hover:text-brand-red 
            ${pathName === item.href && "text-brand-red"}
        `}
                            />

                            {/* LEFT half underline */}
                            <span
                                className={`
        bg-brand-red absolute -bottom-1 left-1/2 -translate-x-full 
        h-0.5 w-0 group-hover:w-1/2 transition-all duration-300
        ${pathName === item.href && "w-1/2"}
      `}
                            />

                            {/* RIGHT half underline */}
                            <span
                                className={`
        bg-brand-red absolute -bottom-1 left-1/2 translate-x-0 
        h-0.5 w-0 group-hover:w-1/2 transition-all duration-300
        ${pathName === item.href && "w-1/2"}
      `}
                            />
                        </Link>

                    );
                })}
            </div>
        </div>
    )
}

export default LeftMenu