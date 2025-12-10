import Cart from "./Cart";
import Container from "./Container";
import Login from "./Login";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import WishList from "./WishList";


const Header = () => {
    return (
        <header className="bg-accent-rose py-1 border-b-2 border-black/10">
            <Container className="flex gap-4 justify-between items-center mx-4">
                {/* Logo */}
                <Logo />

                {/* Cart and Account */}
                <div className="w-auto md:w-full flex gap-4 items-center">
                    <div className="w-full max-md:hidden mx-4">
                        <SearchBar />
                    </div>
                    <div className="flex items-center justify-center gap-8">
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