// /app/(admin)/admin/products/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminProduct } from "@/types/AdminProduct";
import ProductTable from "./components/ProductTable";
import ProductFilters from "./components/ProductFilters";
import Product from "@/types/ProductTypes";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get<Product[]>(
        "/api/admin/products",
        { withCredentials: true }
      );
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProductFilters />

      <ProductTable
        products={products}
        loading={loading}
        refresh={fetchProducts}
      />
    </div>
  );
}