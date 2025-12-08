import { cn } from "@/lib/utils";
import Container from "./container";

const Footer = ({ className }: { className?: string }) => {
    return (
        <footer className="min-w-full py-5 border-t-2 border-black/10 fixed bottom-0 bg-accent-sky">
            <Container className={cn("text-primary font-semibold hover:text-brand-red hoverEffect", className)}>Footer</Container>
        </footer>
    )
}

export default Footer;