"use client";

import { ProductProvider } from "./ProductProvider";
import ProductCreateView from "./ProductCreateView";

export default function CreateProductPage() {
  return (
    <ProductProvider>
      <ProductCreateView />
    </ProductProvider>
  );
}