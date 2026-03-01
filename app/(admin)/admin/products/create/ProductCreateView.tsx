"use client"

import { useState } from "react"
import ProductTabs from "./components/ProductTabs"
import BasicInfoSection from "./components/sections/BasicInfoSection"
import ThumbnailSection from "./components/sections/ThumbnailSection"
import { useProduct } from "./ProductProvider"
import { validateProduct } from "./utils/validateProduct"
import axios from "axios"
import VariantsSection from "./components/sections/VariantsSection"
import PricingSection from "./components/sections/PricingSection"

export default function ProductCreateView() {
  const [activeTab, setActiveTab] = useState("Basic")
  const { product } = useProduct()

  async function handleSubmit() {
    const error = validateProduct(product)

    if (error) {
      alert(error)
      return
    }
    console.log(product);
    console.log(JSON.stringify(product.variants, null, 2))
    try {
      await axios.post("/api/admin/products", {
        ...product,
        category: product.categorySlug,
        subCategory: {
          slug: product.subCategorySlug,
        },
      })

      alert("Product created successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to create product")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-semibold">
        Create Product
      </h1>

      <ProductTabs active={activeTab} setActive={setActiveTab} />

      {activeTab === "Basic" && <BasicInfoSection />}
      {activeTab === "Pricing" && <PricingSection />}
      {activeTab === "Thumbnail" && <ThumbnailSection />}
      {activeTab === "Variants" && <VariantsSection />}
      <button
        onClick={handleSubmit}
        className="bg-white flex items-center font-medium justify-evenly border text-sm uppercase duration-200 cursor-pointer text-black hover:text-white hover:bg-black w-35 py-2 rounded"
      >
        Create Product
      </button>
    </div>
  )
}