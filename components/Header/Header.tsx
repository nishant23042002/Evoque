"use client";

import Cart from "./Cart";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import LoginModalUI from "./LoginModal";
import { useState } from "react";
import { User } from "lucide-react";

const Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);

    return (
        <header
            className="
                sticky top-0 z-40 w-full
                bg-(--linen-200)
                border-b border-(--border-strong)
            "
        >
            <div className="relative p-2 flex items-center justify-between px-2 md:px-4">
                {/* LEFT — Logo */}
                <div className="w-full ml-11 flex items-center justify-center gap-2">
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
                        className="
                            max-[550px]:absolute left-9 top-5.75
                            cursor-pointer flex items-center justify-center
                        "
                    >
                        <User
                            size={20}
                            strokeWidth={2.2}
                            className="
                                text-foreground
                                hover:text-primary
                                transition-colors duration-200
                            "
                        />
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
