"use client";

import { useProduct } from "../../ProductProvider";
import VariantCard from "./VariantCard";

export default function VariantsSection() {
  const { product, setProduct } = useProduct();

  const addVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: {
            name: "",
            slug: "",
            images: [],
          },
          sizes: [],
          pricing: {
            price: 0,
            originalPrice: 0,
            discountPercentage: 0,
          },
          totalStock: 0,
        },
      ],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Variants</h2>
        <button
          type="button"
          onClick={addVariant}
          className="bg-white text-black px-4 py-2 rounded"
        >
          + Add Variant
        </button>
      </div>

      {product.variants.map((_, index) => (
        <VariantCard key={index} index={index} />
      ))}
    </div>
  );
}