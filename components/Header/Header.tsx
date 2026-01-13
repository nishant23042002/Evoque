"use client"

import Cart from "./Cart"
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import LoginModalUI from "./LoginModal";
import { useState } from "react";
import { User } from "lucide-react";

const Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const announcements = [
        "Free Shipping on Orders Above ₹999",
    ];
    const repeatedAnnouncements = Array(10).fill(announcements[0]);


    return (
        <header className="
            sticky top-0 z-40 w-full
            bg-[#e2dfd6]          
        ">
            <div className="cursor-pointer relative w-full overflow-hidden bg-brand-red text-white">
                <div className="marquee flex w-max items-center gap-6 py-1.75">
                    {repeatedAnnouncements.map((text, i) => (
                        <span
                            key={`a-${i}`}
                            className="whitespace-nowrap font-poppins tracking-wider px-2 text-sm font-extrabold"
                        >
                            {text}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between px-2 md:px-4 h-16">
                {/* LEFT — Logo */}
                <div className="w-full flex items-center max-md:ml-9 md:justify-center gap-2">
                    <Logo />
                </div>


                {/* RIGHT — Actions */}
                <div className="flex items-center gap-4">
                    <SearchBar />
                    <WishList />
                    <Cart />
                    <button
                        onClick={() => setLoginOpen(true)}
                        aria-label="Login"
                        className="cursor-pointer flex items-center justify-center                                   ">
                        <User size={20}
                            strokeWidth={2.2}
                            className="text-slate-800 hover:text-brand-red" />
                    </button>

                    <LoginModalUI
                        open={loginOpen}
                        onClose={() => setLoginOpen(false)}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
