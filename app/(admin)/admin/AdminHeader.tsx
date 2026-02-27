// /app/(admin)/admin/AdminHeader.tsx

"use client";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 px-8 flex items-center justify-between">
      <h1 className="text-lg font-medium tracking-wide">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-zinc-400">
          Admin
        </div>

        <div className="w-8 h-8 rounded-full bg-zinc-700" />
      </div>
    </header>
  );
}