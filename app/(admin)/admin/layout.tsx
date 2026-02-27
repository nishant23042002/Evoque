// /app/(admin)/admin/layout.tsx

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 bg-zinc-900 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}