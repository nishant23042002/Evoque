// app/api/products/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose, { ObjectId } from "mongoose";
import ProductType, { SubCategory } from "@/types/ProductTypes"; // Your Product interface
import { extractHexFromBuffer } from "@/data/extractColorFromImage";
import axios from "axios"


interface SizeVariant {
    size: string;
    stock: number;
    isAvailable?: boolean;
    variantSku?: string;
}


type ProductFilter = Partial<ProductType> & {
    [key: string]: string | number | ObjectId | boolean | undefined | Record<string, unknown>
    | Array<Record<string, unknown>>;
};


// ------------------- HELPERS -------------------

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



/* ------------------ HELPERS ------------------ */

const slugify = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "-");




/* ------------------ POST ------------------ */

export async function POST(req: Request) {
  try {
    await connectDB();
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
      attributes,
      styleTags,
      stylePairs,
      fit,
      sizeChart,
      details,
      seo,
      shipping,
      offers,
      tags,
      badges,
      merchandising,
      search,
      isActive = true,
      isFeatured = false,
      launchDate,
    } = body;

    /* ---------- BASIC VALIDATION ---------- */

    if (!productName || !slug)
      return NextResponse.json(
        { message: "Product name & slug required" },
        { status: 400 }
      );

    if (!pricing?.price)
      return NextResponse.json(
        { message: "pricing.price is required" },
        { status: 400 }
      );

    if (!subCategory?.slug)
      return NextResponse.json(
        { message: "subCategory is required" },
        { status: 400 }
      );

    if (!thumbnail)
      return NextResponse.json(
        { message: "Thumbnail is required" },
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
      (s: SubCategory) => s.slug === subCategory.slug
    );

    if (!validSub)
      return NextResponse.json(
        { message: "Invalid subCategory" },
        { status: 400 }
      );

    /* ---------- SKU GENERATION ---------- */

    const count = await Product.countDocuments({
      category: category._id,
    });

    const productSku = generateProductSKU({
      brand,
      categorySlug: category.slug,
      subCategorySlug: subCategory.slug,
      serial: count + 1,
    });

    /* ---------- VARIANT PROCESSING ---------- */

    const processedVariants = [];

    for (const variant of variants) {
      if (!variant.color?.images?.length)
        return NextResponse.json(
          { message: "Each variant needs images" },
          { status: 400 }
        );

      if (!variant.sizes?.length)
        return NextResponse.json(
          { message: "Each variant needs sizes" },
          { status: 400 }
        );

      const colorSlug = slugify(variant.color.slug);

      /* ---------- HEX EXTRACTION ---------- */

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

      /* ---------- SIZE PROCESSING ---------- */

      const updatedSizes = variant.sizes.map((s: SizeVariant) => ({
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
        (sum: number, s: SizeVariant) => sum + (s.stock || 0),
        0
      );

      processedVariants.push({
        color: {
          name: variant.color.name,
          slug: colorSlug,
          hex: colorHex,
          images: variant.color.images,
        },
        sizes: updatedSizes,
        pricing: variant.pricing,
        totalStock,
      });
    }

    const totalStock = processedVariants.reduce(
      (sum, v) => sum + v.totalStock,
      0
    );

    /* ---------- CREATE PRODUCT ---------- */

    const product = await Product.create({
      productName,
      slug,
      sku: productSku,
      brand,
      category: category._id,
      subCategory: {
        name: validSub.name,
        slug: validSub.slug,
        image: validSub.image,
      },
      fit,
      attributes,
      styleTags,
      stylePairs: stylePairs?.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
      variants: processedVariants,
      pricing,
      thumbnail,
      totalStock,
      description,
      sizeChart,
      details,
      offers,
      seo,
      shipping,
      tags,
      badges,
      merchandising,
      search,
      isActive,
      isFeatured,
      launchDate: launchDate ? new Date(launchDate) : undefined,
    });

    return NextResponse.json(product, { status: 201 });

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


/**
 * GET → Fetch Products
 * /api/products?category=mobiles&tag=sale&page=1&limit=20
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const categorySlug = searchParams.get("category") || undefined;
        const subCategorySlug = searchParams.get("subCategory") || undefined;
        const pattern = searchParams.get("pattern") || undefined;
        const fabric = searchParams.get("fabric") || undefined;
        const tag = searchParams.get("tag") || undefined;
        const sort = searchParams.get("sort") || "recommended";

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;

        const filter: ProductFilter = { isActive: true };

        const newArrival = searchParams.get("newArrival");

        if (newArrival === "true") {
            const days = 30; // configurable
            const date = new Date();
            date.setDate(date.getDate() - days);

            filter.$or = [
                { isNewArrival: true },
                { launchDate: { $gte: date } }
            ];

        }

        let sortQuery: Record<string, 1 | -1>;

        switch (sort) {
            case "newest":
                sortQuery = { createdAt: -1 };
                break;

            case "low-high":
                sortQuery = { "pricing.price": 1 };
                break;

            case "high-low":
                sortQuery = { "pricing.price": -1 };
                break;

            default:
                sortQuery = {
                    "merchandising.priority": -1,
                    createdAt: -1,
                };
        }



        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug }); // _id is ObjectId
            if (!category) {
                return NextResponse.json({ message: "Category not found" }, { status: 404 });
            }
            filter.category = category!._id; // ✅ ObjectId
        }

        if (subCategorySlug) filter["subCategory.slug"] = subCategorySlug;
        if (pattern) filter["attributes.pattern"] = pattern;
        if (fabric) filter["attributes.fabric"] = fabric;
        if (tag) filter.tags = tag.split(","); // ✅ ["sale", "new"] etc.


        const products = await Product.find(filter)
            .populate("category", "name slug")
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const total = await Product.countDocuments(filter);
        return NextResponse.json({
            page,
            limit,
            total,
            products
        });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

