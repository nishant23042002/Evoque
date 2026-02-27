"use client";

import { useProduct } from "../../ProductProvider";
import { SizeType } from "@/types/AdminProduct";

interface Props {
  variantIndex: number;
}

export default function SizeManager({ variantIndex }: Props) {
  const { product, setProduct } = useProduct();
  const variant = product.variants[variantIndex];

  /* ================= ADD SIZE ================= */

  const addSize = () => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];

      updatedVariants[variantIndex].sizes.push({
        size: "",
        stock: 0,
        isAvailable: false,
        variantSku: "",
      });

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  /* ================= UPDATE SIZE FIELD ================= */

  const updateSizeField = (
    sizeIndex: number,
    field: keyof SizeType,
    value: string | number
  ) => {
    setProduct(prev => {
      const updatedVariants = [...prev.variants];
      const size = updatedVariants[variantIndex].sizes[sizeIndex];

      if (field === "stock") {
        const stockNumber = Number(value);

        updatedVariants[variantIndex].sizes[sizeIndex] = {
          ...size,
          stock: stockNumber,
          isAvailable: stockNumber > 0,
        };
      } else {
        updatedVariants[variantIndex].sizes[sizeIndex] = {
          ...size,
          [field]: value,
        };
      }

      return {
        ...prev,
        variants: updatedVariants,
      };
    });
  };

  /* ================= AUTO TOTAL STOCK ================= */

  const totalStock = variant.sizes.reduce(
    (sum, s) => sum + s.stock,
    0
  );


  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <h3 className="font-medium">Sizes</h3>
        <button
          type="button"
          onClick={addSize}
          className="text-sm underline"
        >
          + Add Size
        </button>
      </div>

      {variant.sizes.map((size, i) => (
        <div key={i} className="flex gap-4 items-center">

          <input
            placeholder="Size (M, L, 42, etc)"
            value={size.size}
            onChange={e =>
              updateSizeField(i, "size", e.target.value)
            }
            className="bg-zinc-800 p-2 rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            value={size.stock}
            onChange={e =>
              updateSizeField(i, "stock", e.target.value)
            }
            className="bg-zinc-800 p-2 rounded"
          />

          <span className="text-xs text-zinc-400">
            {size.isAvailable ? "Available" : "Out of stock"}
          </span>

        </div>
      ))}

      <div className="text-sm text-zinc-400">
        Total Stock: {totalStock}
      </div>

    </div>
  );
}