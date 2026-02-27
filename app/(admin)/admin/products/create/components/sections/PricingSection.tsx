"use client"

import { useProduct } from "../../ProductProvider"

export default function PricingSection() {
  const { product, setProduct } = useProduct()

  function handlePriceChange(value: number) {
    const discount =
      product.pricing.originalPrice > 0
        ? Math.round(
            ((product.pricing.originalPrice - value) /
              product.pricing.originalPrice) *
              100
          )
        : 0

    setProduct({
      ...product,
      pricing: {
        ...product.pricing,
        price: value,
        discountPercentage: discount,
      },
    })
  }

  return (
    <div className="space-y-4">
      <input
        type="number"
        placeholder="Price"
        value={product.pricing.price}
        onChange={(e) =>
          handlePriceChange(Number(e.target.value))
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />

      <input
        type="number"
        placeholder="Original Price"
        value={product.pricing.originalPrice}
        onChange={(e) =>
          setProduct({
            ...product,
            pricing: {
              ...product.pricing,
              originalPrice: Number(e.target.value),
            },
          })
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />
    </div>
  )
}