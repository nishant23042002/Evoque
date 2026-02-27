"use client"

import { useMemo } from "react"
import { useProduct } from "../../ProductProvider"

export default function PricingSection() {
    const { product } = useProduct()

    const derivedPricing = useMemo(() => {
        if (!product.variants.length) return null

        const prices = product.variants
            .map(v => v.pricing?.price)
            .filter(p => typeof p === "number" && p > 0) as number[]

        if (!prices.length) return null

        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return {
            minPrice,
            maxPrice,
        }
    }, [product.variants])

    if (!derivedPricing) {
        return (
            <div className="text-sm text-zinc-400">
                Product price will be calculated automatically once you add a valid variant.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-700 p-4 rounded">
                <p className="text-sm text-zinc-400">Product Price (Auto Derived)</p>

                {derivedPricing.minPrice === derivedPricing.maxPrice ? (
                    <p className="text-lg font-semibold">
                        Rs. {derivedPricing.minPrice}
                    </p>
                ) : (
                    <p className="text-lg font-semibold">
                        Rs. {derivedPricing.minPrice} - Rs. {derivedPricing.maxPrice}
                    </p>
                )}
            </div>
        </div>
    )
}