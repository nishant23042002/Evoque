import Image from "next/image";
import Container from "./container";
import Logo from "./logo";

const Header = () => {
    return(
        <header className="bg-accent-sand py-5">
            <Container>
                {/* Logo */}
                <Logo />
                {/* Search bar */}
                {/* Cart and Account */}
            </Container>
        </header>
    )
}

export default Header;