import Link from "next/link";
import Image from "next/image";

const Logo = () => {
    return (
        <Link
            href="/"
            aria-label="The Layer Co. Home"
            className="group relative flex items-center h-11 w-40"
        >
            <Image
                src="/images/thelayerlogo-bold.svg"
                alt="The Layer Co"
                width={160}
                height={48}
                priority
                className="h-full w-auto"
            />
            <span className="
                              absolute left-0.5 bottom-3
                              h-0.5
                              w-1/2
                              bg-[var(--primary)]
                              scale-x-0 origin-left
                              transition-transform duration-500 ease-out
                              group-hover:scale-x-100
                            "></span>
        </Link>
    );
};

export default Logo;
