// /app/(admin)/admin/page.tsx

export default function AdminHome() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Total Products</p>
          <h3 className="text-2xl font-bold mt-2">--</h3>
        </div>

        <div className="bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Active Products</p>
          <h3 className="text-2xl font-bold mt-2">--</h3>
        </div>

        <div className="bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Total Users</p>
          <h3 className="text-2xl font-bold mt-2">--</h3>
        </div>

        <div className="bg-zinc-800 p-6">
          <p className="text-sm text-zinc-400">Total Stock</p>
          <h3 className="text-2xl font-bold mt-2">--</h3>
        </div>
      </div>
    </div>
  );
}