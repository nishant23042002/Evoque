import { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ReactQueryProvider from "@/components/ReactQueryProvider";


export const metadata: Metadata = {
    icons: {
        icon: "/images/favicon.png",
    },
    title: "Men's Clothing | Men's Fashion | Men's Fashion | THE LAYER Co.",
    description:
        "Shop premium men's fashion including shirts,linen shirts, sweatshirts, hoodies and denim. Discover new arrivals and best sellers.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}