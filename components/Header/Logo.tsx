import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className="group relative select-none">
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
                <span className="relative">
                    EVOQUE
                    <span
                        className="
                        absolute -bottom-0.5 left-0 h-0.5 w-[70%]
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
