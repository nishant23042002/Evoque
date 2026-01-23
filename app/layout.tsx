import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LeftMenu from "@/components/LeftMenu/LeftMenu";
import { Inter, Poppins } from "next/font/google";
import Providers from "./providers";
import { AuthProvider } from "@/components/AuthProvider";


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
    <AuthProvider>
      <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
        <body className="font-poppins antialiased bg-(--linen-100)">
          <Providers>
            <div className="flex">
              <div className="fixed top-0 z-99 h-full">
                <LeftMenu />
              </div>
              <div className="w-full">
                <Header />

                {children}
                <div id="recaptcha-container"></div>
                <Footer />
              </div>
            </div>
          </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
