import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LeftMenu from "@/components/LeftMenu/LeftMenu";
import { Inter, Poppins } from "next/font/google";

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
      <body className="font-poppins antialiased" style={{ backgroundColor: "#eceae3" }}>
        <div className="flex">
          <div className="fixed top-0 z-99 h-full">
            <LeftMenu />
          </div>
          <div className="w-full">
            <Header />

            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
