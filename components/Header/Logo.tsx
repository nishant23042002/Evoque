import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className="flex items-center">
            <h1
                className={cn(
                    `
                    text-lg tracking-widest font-semibold
                    text-brand-red uppercase
                    hover:opacity-80 transition
                    `,
                    className
                )}
            >
                EVOQU<span className="text-red-400">E</span>
            </h1>
        </Link>
    );
};

export default Logo;
