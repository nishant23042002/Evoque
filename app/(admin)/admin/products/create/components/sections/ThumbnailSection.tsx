"use client"

import Image from "next/image"
import { useProduct } from "../../ProductProvider"

export default function ThumbnailSection() {
  const { product } = useProduct()

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Auto Thumbnail</h3>

      {product.thumbnail ? (
        <Image
          width={200}
          height={200}
          src={product.thumbnail}
          alt="Thumbnail Preview"
          className="w-40 h-48 object-cover border rounded"
        />
      ) : (
        <p className="text-sm text-zinc-400">
          Thumbnail will be generated from primary variant image.
        </p>
      )}
    </div>
  )
}