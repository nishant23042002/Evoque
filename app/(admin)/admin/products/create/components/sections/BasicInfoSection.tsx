"use client"

import { useEffect, useState } from "react";
import { useProduct } from "../../ProductProvider"
import axios from "axios";
import { Category } from "@/types/ProductTypes";

export default function BasicInfoSection() {
  const { product, setProduct } = useProduct();
  const [categories, setCategories] = useState<Category[]>([])

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
        onChange={(e) =>
          setProduct({
            ...product,
            productName: e.target.value,
          })
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />

      <input
        placeholder="Slug"
        value={product.slug}
        onChange={(e) =>
          setProduct({
            ...product,
            slug: e.target.value,
          })
        }
        className="bg-zinc-800 p-3 rounded w-full"
      />

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
    </div>
  )
}