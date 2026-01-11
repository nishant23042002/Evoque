"use client"

import Cart from "./Cart"
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import LoginModalUI from "./LoginModal";
import { useState } from "react";
import Image from "next/image";

const Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);


    return (
        <header className="
            sticky top-0 z-40 w-full
            bg-[#E8E6DF]           
        ">
            <div className="flex items-center justify-between px-2 h-16">

                {/* LEFT — Logo */}
                <div className="flex items-center gap-2">
                    <Logo />
                </div>

                {/* CENTER — Search */}
                <div className="
                    md:flex
                    flex-1 max-w-xl mx-2
                ">
                    <SearchBar />
                </div>

                {/* RIGHT — Actions */}
                <div className="flex items-center">
                    <WishList />
                    <Cart />
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="cursor-pointer p-2 text-slate-700 hover:text-black"
                    >
                        <Image className="text-slate-800" src="/images/login-icon.png" width={22} height={22} alt="login-icon" />
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
