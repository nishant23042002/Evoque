import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className="group relative select-none ml-8">
            <h1
                className={cn(
                    `
                    relative z-10
                    text-[18px] max-lg:text-[12px]
                    font-medium tracking-[0.45em]
                    uppercase text-neutral-900
                    `,
                    className
                )}
            >
                <span className="relative px-2">
                    EVOQUE
                    <span
                        className="
                        absolute -bottom-1 left-2 h-0.5 w-[50%]
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
