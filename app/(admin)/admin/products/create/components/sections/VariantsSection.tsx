"use client";

import { Plus } from "lucide-react";
import { useProduct } from "../../ProductProvider";
import VariantCard from "./VariantCard";
import { VariantType } from "@/types/AdminProduct";

export default function VariantsSection() {
  const { product, setProduct } = useProduct();

  const addVariant = () => {
    const newVariant: VariantType = {
      color: {
        name: "",
        slug: "",
        images: [],
      },
      sizes: [],
      pricing: {
        price: NaN,
        originalPrice: NaN,
        discountPercentage: 0,
      },
      totalStock: 0,
    };

    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Variants</h2>
        <button
          type="button"
          onClick={addVariant}
          className="bg-white flex items-center justify-evenly border text-sm uppercase duration-200 cursor-pointer text-black hover:text-white hover:bg-black w-35 py-2 rounded"
        >
          Add Variant <span><Plus size={14} /></span>
        </button>
      </div>

      {product.variants.length === 0 && (
        <p className="text-sm text-zinc-400">
          No variants added yet.
        </p>
      )}

      {product.variants.map((_, index) => (
        <VariantCard key={index} index={index} />
      ))}
    </div>
  );
}