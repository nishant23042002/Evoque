import { AdminProduct } from "@/types/AdminProduct"

export function validateProduct(product: AdminProduct) {
  if (!product.productName)
    return "Product name required"

  if (!product.slug)
    return "Slug required"

  if (!product.thumbnail)
    return "Thumbnail required"

  
  for (const variant of product.variants) {
    if (!variant.pricing || !variant.pricing.price || variant.pricing.price <= 0) {
      return "Each variant must have a price greater than 0"
    }

    if (!variant.sizes.length) {
      return "Each variant must have at least one size"
    }

    if (!variant.color.images.length) {
      return "Each variant must have at least one image"
    }
  }

  return null
}