"use client";

import { AdminProduct } from "@/types/AdminProduct";
import ProductRow from "./ProductRow";

interface Props {
  products: AdminProduct[];
  loading: boolean;
  refresh: () => void;
}

export default function ProductTable({
  products,
  loading,
  refresh,
}: Props) {
  if (loading) {
    return (
      <div className="bg-zinc-900 p-10 rounded-xl">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-zinc-900 p-10 rounded-xl text-center text-zinc-500">
        No products found
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
          <tr>
            <th className="p-4 text-left">Product</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              refresh={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}