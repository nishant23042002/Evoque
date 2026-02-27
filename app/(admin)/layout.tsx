// /app/(admin)/admin/layout.tsx

import { ReactNode } from "react";
import { requireAdmin } from "@/lib/requireAdmin";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const admin = await requireAdmin();

    if (!admin) {
        redirect("/")
    }
    return (
        <>
            { children }
        </>
    );
}