"use client"

import { createContext, useContext, useState } from "react"
import { AdminProduct } from "@/types/AdminProduct"


interface ProductContextType {
  product: AdminProduct
  setProduct: React.Dispatch<React.SetStateAction<AdminProduct>>
}

const ProductContext = createContext<ProductContextType | null>(null)

export function ProductProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [product, setProduct] = useState<AdminProduct>({
    productName: "",
    slug: "",
    brand: "",
    categorySlug: "",
    subCategorySlug: "",
    pricing: {
      price: 0,
      originalPrice: 0,
      discountPercentage: 0,
      currency: "INR",
      taxInclusive: true,
    },
    thumbnail: "",
    variants: [],
    description: "",
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
  })

  return (
    <ProductContext.Provider value={{ product, setProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProduct must be used inside ProductProvider")
  }
  return context
}