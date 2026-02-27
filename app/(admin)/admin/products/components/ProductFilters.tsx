// /app/(admin)/admin/products/components/ProductFilters.tsx

"use client";

import { useRouter } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <input
        placeholder="Search products..."
        className="bg-zinc-800 px-4 py-2 rounded text-sm outline-none w-64"
      />

      <button
        onClick={() => router.push("/admin/products/create")}
        className="bg-white text-black px-4 py-2 rounded hover:opacity-80"
      >
        + Add Product
      </button>
    </div>
  );
}