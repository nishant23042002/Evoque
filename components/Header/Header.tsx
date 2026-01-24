"use client";

import Cart from "./Cart";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import LoginModalUI from "./LoginModal";
import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../AuthProvider";
import AccountDropdown from "./AccountDropdown";
import { IoClose } from "react-icons/io5";


const Header = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full bg-(--linen-200) border-b border-(--border-strong)">
            <div className="relative p-2 flex items-center justify-between px-2 md:px-4">

                {/* Logo */}
                <div className="w-full ml-11 flex items-center justify-center gap-2">
                    <Logo />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 relative">
                    <SearchBar />
                    <WishList />
                    <Cart />

                    {/* USER */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();          // prevents outside click
                                    setAccountOpen(prev => !prev);
                                }}
                                className="cursor-pointer flex items-center justify-center
                                           text-foreground hover:text-primary"
                            >
                                {!accountOpen ? <User size={20} strokeWidth={2.2} /> : <IoClose size={20} />}
                            </button>


                            <AccountDropdown
                                open={accountOpen}
                                onClose={() => setAccountOpen(false)}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setLoginOpen(true)}
                            aria-label="Login"
                            className="cursor-pointer flex items-center justify-center"
                        >
                            <User
                                size={20}
                                strokeWidth={2.2}
                                className="text-foreground hover:text-primary"
                            />
                        </button>
                    )}

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
