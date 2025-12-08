import Container from "./container";
import Logo from "./logo";
import MenuItems from "./menuItems";

const Header = () => {
    return(
        <header className="bg-accent-rose py-5 border-b-2 border-black/10">
            <Container className="flex justify-between items-center mx-4">
                {/* Logo */}
                <Logo />

                {/* Cart and Account */}
                <div className="max-md:hidden flex items-center gap-3">
                    <span>O</span>
                    <input type="search" className="border border-black/30 rounded-md p-1.5 w-60" />
                </div>

                {/* Search bar */}
                <MenuItems />
            </Container>
        </header>
    )
}

export default Header;