// /app/(admin)/admin/products/components/ProductFilters.tsx

"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductFilters() {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4">
      <input
        placeholder="Search products..."
        className="bg-zinc-800 px-4 py-2 text-sm outline-none w-64"
      />

      <button
        onClick={() => router.push("/admin/products/create")}
        className="bg-white flex items-center font-medium justify-evenly border text-sm uppercase duration-200 cursor-pointer text-black hover:text-white hover:bg-black w-35 py-2"
      >
        Add Product <Plus size={14} />
      </button>
    </div>
  );
}