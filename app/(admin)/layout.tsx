import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminGroupLayout({
    children,
}: {
    children: ReactNode;
}) {
    const admin = await requireAdmin();

    if (!admin) {
        redirect("/");
    }

    return <>{children}</>;
}