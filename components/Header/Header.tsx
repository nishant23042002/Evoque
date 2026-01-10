"use client"
import Cart from "./Cart";
import dynamic from "next/dynamic";

const LoginOtpModal = dynamic(() => import("./LoginOtpModal"), {
    ssr: false,
});
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";

const Header = () => {
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
                    <LoginOtpModal />
                </div>
            </div>



        </header>
    );
};

export default Header;
