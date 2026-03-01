"use client";

import ProductRowCard from "./ProductRow";
import Product from "@/types/ProductTypes";

interface Props {
  products: Product[];
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
      <div className="p-10 text-center text-zinc-400">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="p-10 text-center text-zinc-500">
        No products found
      </div>
    );
  }

  return (
    <div className="grid 
      grid-cols-2 
      sm:grid-cols-3
      
      xl:grid-cols-4 
      2xl:grid-cols-5
  ">
      {products.map((product) => (
        <ProductRowCard
          key={product._id}
          product={product}
          refresh={refresh}
        />
      ))}
    </div>
  );
}