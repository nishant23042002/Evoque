
import Sidebar from "./admin/Sidebar";
import AdminHeader from "./admin/AdminHeader";
import { requireAdmin } from "@/lib/requireAdmin";


export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    try {
        await requireAdmin();
    } catch {
        return <div>Not authorized</div>;
    }
    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 bg-zinc-900">
                    {children}
                </main>
            </div>
        </div>
    );
}