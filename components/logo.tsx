import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
    return (
        <Link className="mx-22" href={"/"}>
            <h2 className={cn("max-sm:hidden uppercase text-brand-red hover:text-red-400 font-semibold hoverEffect", className)}>Evoqu<span className="text-red-400 hover:text-brand-red">e</span></h2>
        </Link>
    )
}

export default Logo;