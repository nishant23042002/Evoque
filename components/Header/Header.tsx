"use client";

import Cart from "./Cart";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import LoginModalUI from "./LoginModal";
import { useState } from "react";
import { Menu, User } from "lucide-react";
import { useAuth } from "../AuthProvider";
import AccountDropdown from "./AccountDropdown";
import { IoClose } from "react-icons/io5";
import { cn } from "@/lib/utils";
import LeftMenu from "../LeftMenu/LeftMenu";


const Header = () => {
    const [accountOpen, setAccountOpen] = useState(false);
    const { user, openLogin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-(--linen-200)">
            <div className="relative p-2 flex items-center justify-between px-2 md:px-4">
                <div>                   
                    <button
                        data-menu-btn
                        onClick={() => setMenuOpen(v => !v)}
                        className={"cursor-pointer mt-1 rounded-md text-foreground hover:text-primary transition-transform duration-300 ease-in-out"}
                    >
                        <span
                            className={cn(
                                "inline-block transition-transform duration-300",
                                menuOpen && "rotate-90"
                            )}
                        >
                            {menuOpen ? (
                                <svg
                                    width="20"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            ) : (
                                <Menu size={20} />
                            )}
                        </span>
                    </button>
                </div>
                {/* Logo */}
                <div className="w-full flex items-center justify-center gap-2">
                    <Logo />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 max-[350px]:gap-2 relative">
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
                            onClick={openLogin}
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

                    <LoginModalUI />
                </div>
                <LeftMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
            </div>
        </header>
    );
};


export default Header;
