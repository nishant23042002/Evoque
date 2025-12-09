import Container from "./container";
import Logo from "./logo";
import MenuItems from "./menuItems";
import { FaSearch } from "react-icons/fa";

const Header = () => {
    return(
        <header className="bg-accent-rose py-2 border-b-2 border-black/10">
            <Container className="flex gap-4 justify-between items-center mx-4">
                {/* Logo */}
                <Logo />

                {/* Cart and Account */}
                <div className="relative max-md:hidden flex items-center w-full">
                    <span className="absolute left-2 text-slate-700"><FaSearch /></span>
                    <input type="search" placeholder="Search" className="w-full px-8 border text-slate-900 border-black/30 rounded-full p-1.5" />
                </div>

                {/* Search bar */}
                <MenuItems />
            </Container>
        </header>
    )
}

export default Header;