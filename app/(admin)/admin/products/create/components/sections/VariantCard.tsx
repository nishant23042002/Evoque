"use client";

import { useProduct } from "../../ProductProvider";
import SizeManager from "./SizeManager";
import ImageUploader from "./ImageUploader";

interface Props {
  index: number;
}

export default function VariantCard({ index }: Props) {
  const { product, setProduct } = useProduct();
  const variant = product.variants[index];

  const updateColorField = (
    field: "name" | "slug",
    value: string
  ) => {
    setProduct(prev => {
      const updated = [...prev.variants];

      updated[index].color = {
        ...updated[index].color,
        [field]: value,
      };

      return {
        ...prev,
        variants: updated,
      };
    });
  };

  return (
    <div className="border border-zinc-800 p-6 rounded-xl space-y-6 bg-zinc-900">

      {/* 🔹 COLOR FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Color Name"
          value={variant.color.name}
          onChange={e => updateColorField("name", e.target.value)}
          className="bg-zinc-800 p-3 rounded"
        />

        <input
          placeholder="Color Slug"
          value={variant.color.slug}
          onChange={e => updateColorField("slug", e.target.value)}
          className="bg-zinc-800 p-3 rounded"
        />
      </div>

      {/* 🔹 IMAGE UPLOADER SECTION */}
      <div>
        <h3 className="font-medium mb-2">Images</h3>
        <ImageUploader variantIndex={index} />
      </div>

      {/* 🔹 SIZE SECTION */}
      <div>
        <SizeManager variantIndex={index} />
      </div>

    </div>
  );
}