import { z } from "zod"

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required"),
  categorySlug: z.string().min(1, "Category is required"),
  subCategorySlug: z.string().min(1, "Subcategory is required"),
  basePrice: z.coerce.number().min(1, "Price must be greater than 0"),
  description: z.string().min(10, "Description too short"),
})

export type ProductFormValues = z.infer<typeof productSchema>