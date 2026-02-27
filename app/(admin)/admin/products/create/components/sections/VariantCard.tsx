"use client";

import { useProduct } from "../../ProductProvider";
import SizeManager from "./SizeManager";
import ImageUploader from "./ImageUploader";

interface Props {
  index: number;
}

/* 🔥 Slug generator */
const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
function calculateDiscount(price: number, original: number) {
  if (!price || !original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}


export default function VariantCard({ index }: Props) {
  const { product, setProduct } = useProduct();
  const variant = product.variants[index];

  if (!variant) return null;

  /* ================= UPDATE COLOR NAME ================= */

  const updateColorName = (value: string) => {
    const slug = generateSlug(value);

    setProduct((prev) => {
      const updatedVariants = prev.variants.map((v, i) =>
        i === index
          ? {
            ...v,
            color: {
              ...v.color,
              name: value,
              slug, // 🔥 auto-generated
            },
          }
          : v
      );

      return { ...prev, variants: updatedVariants };
    });
  };

  /* ================= PRICING ================= */

  const updatePricing = (
    field: "price" | "originalPrice",
    value: number
  ) => {
    if (value < 0) return;
    setProduct(prev => {
      const updated = [...prev.variants];

      const currentPricing = updated[index].pricing || {
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
      };

      const newPricing = {
        ...currentPricing,
        [field]: value,
      };

      newPricing.discountPercentage = calculateDiscount(
        newPricing.price,
        newPricing.originalPrice
      );

      updated[index] = {
        ...updated[index],
        pricing: newPricing,
      };

      return { ...prev, variants: updated };
    });
  };

  return (
    <div className="border border-zinc-800 p-6 rounded-xl space-y-6 bg-zinc-900">

      {/* 🔹 COLOR NAME ONLY */}
      <div>
        <input
          placeholder="Color Name"
          value={variant.color.name}
          onChange={(e) => updateColorName(e.target.value)}
          className="bg-zinc-800 p-3 rounded w-full"
        />

        {variant.color.slug && (
          <p className="text-xs text-zinc-400 mt-2">
            Slug: {variant.color.slug}
          </p>
        )}
      </div>

      {/* ================= PRICING ================= */}
      <div className="border border-zinc-700 p-4 rounded space-y-4">
        <h3 className="text-sm font-semibold text-zinc-300">
          Variant Pricing
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Price</label>
            <input
              type="number"
              value={isNaN(variant.pricing?.price) ? "" : variant.pricing?.price}
              onChange={e => {
                const value = e.target.value

                if (value === "") {
                  updatePricing("price", 0)
                  return
                }

                updatePricing("price", Number(value))
              }}
              className="bg-zinc-800 p-3 rounded w-full"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">
              Original Price
            </label>
            <input
              type="number"
              value={isNaN(variant.pricing?.originalPrice) ? "" : variant.pricing?.originalPrice}
              onChange={e => {
                const value = e.target.value

                if (value === "") {
                  updatePricing("originalPrice", 0)
                  return
                }

                updatePricing("originalPrice", Number(value))
              }}
              className="bg-zinc-800 p-3 rounded w-full"
            />
          </div>
        </div>

        <div className="text-sm text-green-400 font-medium">
          Discount: {variant.pricing?.discountPercentage || 0}%
        </div>
      </div>

      {/* 🔹 IMAGE UPLOADER */}
      <div>
        <h3 className="font-medium mb-2">Images</h3>
        <ImageUploader variantIndex={index} />
      </div>

      {/* 🔹 SIZE MANAGER */}
      <div>
        <SizeManager variantIndex={index} />
      </div>

    </div>
  );
}