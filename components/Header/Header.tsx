import Cart from "./Cart";
import Container from "../Container";
import Login from "./Login";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";


const Header = () => {
    return (
        <header className="sticky top-0 w-full z-40 bg-white py-1 border-accent-rose border">
            <Container className="flex justify-between items-center mx-4">
                {/* Logo */}
                <Logo />

                {/* Cart and Account */}
                <div className="w-auto md:w-full flex gap-4 items-center">
                    <div className="w-full max-sm:hidden">
                        <SearchBar />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <WishList />
                        <Cart />
                        <Login />
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header;