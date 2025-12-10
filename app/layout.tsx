import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeftMenu from "@/components/LeftMenu";


export const metadata: Metadata = {
  title: "The Evoque Store",
  description: "Your go to Clothing Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
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
