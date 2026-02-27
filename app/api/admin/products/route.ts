// app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/requireAdmin";
import { extractHexFromBuffer } from "@/data/extractColorFromImage";
import axios from "axios";
import { SizeType } from "@/types/AdminProduct";
import { SubCategory } from "@/types/ProductTypes";


const toCode = (str = "", len = 2) =>
  str.replace(/[^a-zA-Z]/g, "").slice(0, len).toUpperCase();

function generateProductSKU({
  brand,
  categorySlug,
  subCategorySlug,
  serial,
}: {
  brand: string;
  categorySlug: string;
  subCategorySlug: string;
  serial: number;
}) {
  return [
    toCode(brand, 2),
    toCode(categorySlug, 2),
    toCode(subCategorySlug, 2),
    String(serial).padStart(3, "0"),
  ].join("-");
}

function generateVariantSKU({
  productSku,
  color,
  size,
}: {
  productSku: string;
  color: string;
  size: string;
}) {
  return `${productSku}-${toCode(color, 3)}-${size.toUpperCase()}`;
}

function calculateDiscount(price: number, original: number) {
  if (!original || original <= price) return 0

  return Math.round(
    ((original - price) / original) * 100
  )
}

/**
 * POST → Create Product (Admin Only)
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      productName,
      slug,
      brand,
      category: categorySlug,
      subCategory,
      variants = [],
      pricing,
      thumbnail,
      description,
      isActive = true,
      isFeatured = false,
      launchDate,
      ...rest
    } = body;

    /* ---------- VALIDATION ---------- */

    if (!productName || !slug)
      return NextResponse.json(
        { message: "Product name & slug required" },
        { status: 400 }
      );


    if (!thumbnail)
      return NextResponse.json(
        { message: "Thumbnail required" },
        { status: 400 }
      );

    if (!variants.length)
      return NextResponse.json(
        { message: "At least one variant required" },
        { status: 400 }
      );

    /* ---------- CATEGORY VALIDATION ---------- */

    let category;
    if (mongoose.Types.ObjectId.isValid(categorySlug)) {
      category = await Category.findById(categorySlug);
    } else {
      category = await Category.findOne({ slug: categorySlug });
    }

    if (!category)
      return NextResponse.json(
        { message: "Category not found" },
        { status: 400 }
      );

    const validSub = category.subCategories.find(
      (s: SubCategory) => s.slug === subCategory?.slug
    );

    if (!validSub)
      return NextResponse.json(
        { message: "Invalid subCategory" },
        { status: 400 }
      );

    /* ---------- SKU ---------- */

    const count = await Product.countDocuments({
      category: category._id,
    });

    const productSku = generateProductSKU({
      brand,
      categorySlug: category.slug,
      subCategorySlug: subCategory.slug,
      serial: count + 1,
    });

    /* ---------- PROCESS VARIANTS ---------- */

    const processedVariants = [];

    for (const variant of variants) {
      if (
        typeof variant.pricing?.price !== "number" ||
        variant.pricing.price <= 0
      )
        return NextResponse.json(
          { message: "Variant price must be greater than 0" },
          { status: 400 }
        );

      if (!variant.sizes?.length)
        return NextResponse.json(
          { message: "Each variant needs sizes" },
          { status: 400 }
        );

      let colorHex: string | undefined;

      try {
        const res = await axios.get(
          variant.color.images[0].url,
          { responseType: "arraybuffer" }
        );

        colorHex = await extractHexFromBuffer(
          Buffer.from(res.data)
        );
      } catch {
        colorHex = undefined;
      }

      const updatedSizes = variant.sizes.map((s: SizeType) => ({
        size: s.size,
        stock: s.stock,
        isAvailable: s.stock > 0,
        variantSku: generateVariantSKU({
          productSku,
          color: variant.color.name,
          size: s.size,
        }),
      }));

      const totalStock = updatedSizes.reduce(
        (sum: number, s: SizeType) => sum + s.stock,
        0
      );

      const variantDiscount = calculateDiscount(
        variant.pricing.price,
        variant.pricing.originalPrice
      )

      processedVariants.push({
        color: {
          ...variant.color,
          hex: colorHex,
          images: variant.color.images,
        },
        sizes: updatedSizes,
        pricing: {
          price: variant.pricing.price,
          originalPrice: variant.pricing.originalPrice || variant.pricing.price,
          discountPercentage: variantDiscount,
        },
        totalStock,
      });
    }

    const totalStock = processedVariants.reduce(
      (sum, v) => sum + v.totalStock,
      0
    );

    const firstVariantPricing = processedVariants[0].pricing


    const productPricing = {
      price: firstVariantPricing.price,
      originalPrice: firstVariantPricing.originalPrice,
      discountPercentage: firstVariantPricing.discountPercentage,
      taxInclusive: pricing.taxInclusive ?? true,
      currency: pricing.currency ?? "INR",
    }

    /* ---------- CREATE ---------- */

    const product = await Product.create({
      productName,
      slug,
      sku: productSku,
      brand,
      category: category._id,
      subCategory: validSub,
      pricing: productPricing,
      thumbnail,
      description,
      variants: processedVariants,
      totalStock,
      isActive,
      isFeatured,
      launchDate: launchDate ? new Date(launchDate) : undefined,
      ...rest,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();
  const products = await Product.find({ isDeleted: false }).lean();

  return NextResponse.json(products);
}