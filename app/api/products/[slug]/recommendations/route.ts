import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import type { PipelineStage } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!decodedSlug) {
    return NextResponse.json(
      { message: "Slug param missing" },
      { status: 400 }
    );
  }

  // 1️⃣ Fetch base product
  const baseProduct = await Product.findOne({
    slug: decodedSlug,
    isActive: true,
  }).lean();

  if (!baseProduct) {
    return NextResponse.json(
      { message: "Product not found" },
      { status: 404 }
    );
  }

  const stylePairs = baseProduct.stylePairs || [];
  const styleTags = baseProduct.styleTags || [];

  // ❗ If no stylePairs → no recommendations
  if (!stylePairs.length) {
    return NextResponse.json({ recommendations: [] });
  }

  // 2️⃣ STRICT recommendation pipeline
  const pipeline: PipelineStage[] = [
    {
      // 🔒 ONLY categories present in stylePairs
      $match: {
        _id: { $ne: baseProduct._id },
        isActive: true,
        isAvailable: true,
        category: { $in: stylePairs },
      },
    },
    {
      // 🎯 Optional ranking via styleTags
      $addFields: {
        styleScore: {
          $size: {
            $setIntersection: ["$styleTags", styleTags],
          },
        },
      },
    },
    {
      $sort: {
        styleScore: -1,
        isFeatured: -1,
        isBestSeller: -1,
        isNewArrival: -1,
        "merchandising.priority": -1,
        createdAt: -1,
      },
    },
    { $limit: 8 },
    {
      $project: {
        productName: 1,
        slug: 1,
        thumbnail: 1,
        variants: 1,
        pricing: 1,
        brand: 1,
        rating: 1,
        category: 1,
      },
    },
  ];

  const recommendations = await Product.aggregate(pipeline);

  return NextResponse.json({
    recommendations,
  });
}
