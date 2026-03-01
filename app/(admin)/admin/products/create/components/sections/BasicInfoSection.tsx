"use client"

import { useEffect, useState } from "react";
import { useProduct } from "../../ProductProvider"
import axios from "axios";
import { Category } from "@/types/ProductTypes";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
    .replace(/\s+/g, "-")           // spaces → hyphen
    .replace(/-+/g, "-");           // collapse multiple hyphens
}


export default function BasicInfoSection() {
  const { product, setProduct } = useProduct();
  const [categories, setCategories] = useState<Category[]>([])
  const [showSlug, setShowSlug] = useState(false)

  useEffect(() => {
    async function fetchCategories() {
      const res = await axios.get("/api/categories")
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  const selectedCategory = categories.find(
    c => c.slug === product.categorySlug
  )

  return (
    <div className="space-y-4">
      <input
        placeholder="Product Name"
        value={product.productName}
        onChange={(e) => {
          const name = e.target.value.toUpperCase();

          setProduct(prev => ({
            ...prev,
            productName: name,
            slug: generateSlug(name), // 🔥 auto slug
          }));
        }}
        onBlur={() => {
          if (!product.productName) return

          setProduct(prev => ({
            ...prev,
            slug: generateSlug(prev.productName),
          }))

          setShowSlug(true)
        }}
        className="bg-zinc-800 p-3 rounded w-full"
      />

      {/* SLUG PREVIEW (NOT INPUT) */}
      {showSlug && product.slug && (
        <div className="text-sm text-zinc-400">
          Slug:{" "}
          <span className="text-white font-mono">
            {product.slug}
          </span>
        </div>
      )}


      <input
        placeholder="Brand"
        value={product.brand}
        onChange={(e) =>
          setProduct({
            ...product,
            brand: e.target.value,
          })
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />

      {/* Category */}
      <select
        value={product.categorySlug}
        onChange={e =>
          setProduct(prev => ({
            ...prev,
            categorySlug: e.target.value,
            subCategorySlug: "", // reset subcategory
          }))
        }
        className="bg-zinc-800 p-3 rounded w-full"
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* SubCategory */}
      <select
        value={product.subCategorySlug}
        onChange={e =>
          setProduct(prev => ({
            ...prev,
            subCategorySlug: e.target.value,
          }))
        }
        disabled={!selectedCategory}
        className="bg-zinc-800 p-3 rounded w-full"
      >
        <option value="">Select SubCategory</option>
        {selectedCategory?.subCategories.map(sub => (
          <option key={sub.slug} value={sub.slug}>
            {sub.name}
          </option>
        ))}
      </select>

      <div>
        <label className="text-sm text-zinc-400">
          Launch Date
        </label>
        <input
          type="date"
          value={product.launchDate || ""}
          onChange={(e) =>
            setProduct(prev => ({
              ...prev,
              launchDate: e.target.value
            }))
          }
          className="bg-zinc-800 p-3 rounded w-full"
        />
      </div>

      <div className="flex items-center justify-between bg-zinc-900 p-3 rounded">
        <span className="text-sm">
          Mark as New Arrival
        </span>

        <button
          type="button"
          onClick={() =>
            setProduct(prev => ({
              ...prev,
              isNewArrival: !prev.isNewArrival
            }))
          }
          className={`px-4 py-1 rounded text-sm transition ${product.isNewArrival
              ? "bg-green-600"
              : "bg-zinc-700"
            }`}
        >
          {product.isNewArrival ? "ON" : "OFF"}
        </button>
      </div>

    </div>
  )
}