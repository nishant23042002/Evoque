// (shop)/layput.tsx

import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header/Header";
import GlobalLoginModal from "../GlobalLoginModal";
import ProductToast from "@/components/ProductToast";
import Footer from "@/components/Footer/Footer";



export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <Header />
            <main className="min-h-screen">
                {children}
                <ProductToast />
            </main>
            <GlobalLoginModal />
            <Footer />
        </AuthProvider>
    );
}