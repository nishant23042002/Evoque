
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { Inter, Poppins } from "next/font/google";
import Providers from "./providers";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalLoginModal from "./GlobalLoginModal";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import ProductToast from "@/components/ProductToast";



const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Men's Clothing | The Layer Co.",
  description: "The Layer Co. offers premium men’s clothing including oversized t-shirts, casual shirts, linen shirts, overshirts and modern essentials. Elevate your everyday style with quality fits."
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-poppins antialiased bg-white">
        <Providers>
          <AuthProvider>
            <ReactQueryProvider>
              {/* PAGE SHELL */}
              <Header />

              {/* MAIN CONTENT */}
              <main className="min-h-screen">
                {children}
                <ProductToast />
              </main>

              {/* GLOBAL UI */}
              <GlobalLoginModal />

            </ReactQueryProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
