import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link
            href="/"
            className="group relative select-none"
            aria-label="The Layer Co. Home"
        >
            <h1
                className={cn(
                    `relative
                    text-[20px] 
                    max-lg:text-[16px] 
                    max-sm:text-[12px]
                    
                    font-light
                    uppercase
                    
                    tracking-[0.2em]
                    transition-transform duration-300
                    text-slate-800
                    dark:text-slate-100
                    hover:text-brand-red
                    leading-4
                    `,
                    className
                )}
            >
                <span className="relative">
                    THE LAYER CO.

                    <span
                        className="max-md:hidden
                        absolute -bottom-1 left-0.5 h-0.5 w-[50%]
                         bg-brand-red
                         scale-x-0 origin-left
                        transition-transform duration-300
                        group-hover:scale-x-100
                    "
                    />
                </span>

            </h1>
        </Link>
    );
};

export default Logo;
