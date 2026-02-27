"use client"

import Image from "next/image"
import { useProduct } from "../../ProductProvider"

export default function ThumbnailSection() {
  const { product, setProduct } = useProduct()

  return (
    <div className="space-y-4">
      <input
        placeholder="Thumbnail URL"
        value={product.thumbnail}
        onChange={(e) =>
          setProduct({
            ...product,
            thumbnail: e.target.value,
          })
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />

      {product.thumbnail && (
        <Image
          width={40}
          height={40}
          src={product.thumbnail}
          alt="Preview"
          className="w-32 h-40 object-cover border"
        />
      )}
    </div>
  )
}