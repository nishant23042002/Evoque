//(user)/layout.tsx

import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header/Header";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "My Account | The Layer Co.",
  description: "Your saved items at THE LAYER Co.",
};

export function Page() {
  return ;
}


export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <Header />
            {children}
        </AuthProvider>
    );
}