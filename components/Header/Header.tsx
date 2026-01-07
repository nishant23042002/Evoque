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
            bg-white/90 backdrop-blur-md
            border-b border-accent-rose
        ">
            <div className="flex items-center justify-between px-4 h-16">

                {/* LEFT — Logo */}
                <div className="max-md:ml-10 ml-14 flex items-center gap-2">
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
                <div className="flex items-center gap-3">
                    <WishList />
                    <Cart />
                    <LoginOtpModal />
                </div>
            </div>



        </header>
    );
};

export default Header;
