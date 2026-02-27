import { AdminProduct } from "@/types/AdminProduct"

export function validateProduct(product: AdminProduct) {
  if (!product.productName)
    return "Product name required"

  if (!product.slug)
    return "Slug required"

  if (!product.thumbnail)
    return "Thumbnail required"

  if (product.pricing.price <= 0)
    return "Price must be greater than 0"

  return null
}