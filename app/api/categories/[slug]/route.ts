// /api/categories/[slug]/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose from "mongoose";

type SortOption = "recommended" | "newest" | "low-high" | "high-low";
type BaseMatchStage = {
    category: mongoose.Types.ObjectId;
    isActive: boolean;
    "subCategory.slug"?: string;
};
type ProductMatchStage = {
    category: mongoose.Types.ObjectId;
    isActive: boolean;
    "subCategory.slug"?: string;
    "pricing.price"?: {
        $gte?: number;
        $lte?: number;
    };
    variants?: {
        $elemMatch: {
            "color.slug"?: { $in: string[] };
            sizes?: {
                $elemMatch: {
                    size?: { $in: string[] };
                    isAvailable?: boolean;
                    stock?: { $gt?: number };  // ✅ FIXED
                };
            };
        };
    };
    "attributes.fitType"?: {
        $in: string[];
    };
    "attributes.fabric"?: { $in: string[] };
    "attributes.pattern"?: { $in: string[] };
};
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // ✅ Await params (Next.js new requirement)
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { message: "Category slug missing" },
                { status: 400 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);

        /* ======================
           PARSE QUERY PARAMS
        ====================== */
        const sub = searchParams.get("sub");
        const sort = searchParams.get("sort") as SortOption | null;

        const min = Number(searchParams.get("min")) || null;
        const max = Number(searchParams.get("max")) || null;

        const colorParam = searchParams.get("color");
        const sizeParam = searchParams.get("size");

        const fitParam = searchParams.get("fit");
        const fabricParam = searchParams.get("fabric");
        const pattern = searchParams.get('pattern');

        /* ======================
           FETCH CATEGORY
        ====================== */

        const category = await Category.findOne({
            slug,
            isActive: true,
        }).lean();

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // First get all prices for this category (without price filter)
        const priceStats = await Product.aggregate([
            {
                $match: {
                    category: category._id,
                    isActive: true,
                },
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$pricing.price" },
                    maxPrice: { $max: "$pricing.price" },
                },
            },
        ]);

        const minAvailablePrice = priceStats[0]?.minPrice || 0;
        const maxAvailablePrice = priceStats[0]?.maxPrice || 0;

        /* ======================
           BUILD MATCH STAGE
        ====================== */
        const baseMatch: BaseMatchStage = {
            category: category._id,
            isActive: true,
        };

        if (sub) {
            baseMatch["subCategory.slug"] = sub;
        }

        const productMatch: ProductMatchStage = { ...baseMatch };
        // Price filter
        if (min || max) {
            productMatch["pricing.price"] = {};

            if (min) productMatch["pricing.price"].$gte = Number(min);
            if (max) productMatch["pricing.price"].$lte = Number(max);
        }
        if (colorParam || sizeParam) {
            productMatch["variants"] = {
                $elemMatch: {
                    ...(colorParam && {
                        "color.slug": { $in: colorParam.split(",") },
                    }),
                    ...(sizeParam && {
                        sizes: {
                            $elemMatch: {
                                size: { $in: sizeParam.split(",") },
                                isAvailable: true,        // 🔥 IMPORTANT
                                stock: { $gt: 0 },        // 🔥 EVEN BETTER
                            },
                        },
                    }),
                },
            };
        }

        if (fitParam) {
            productMatch["attributes.fitType"] = {
                $in: fitParam.split(","),
            };
        }

        if (fabricParam) {
            productMatch["attributes.fabric"] = {
                $in: fabricParam.split(","),
            };
        }

        if (pattern) {
            productMatch["attributes.pattern"] = {
                $in: pattern.split(","),
            };
        }

        /* ======================
           SORT LOGIC
        ====================== */

        const sortMap: Record<SortOption, Record<string, 1 | -1>> = {
            recommended: { "analytics.purchases": -1 },
            newest: { createdAt: -1 },
            "low-high": { "pricing.price": 1 },
            "high-low": { "pricing.price": -1 },
        };

        const sortStage = sort ? sortMap[sort] : sortMap["newest"];

        /* ======================
           AGGREGATION PIPELINE
        ====================== */

        const result = await Product.aggregate([
            {
                $facet: {

                    /* ---------- PRODUCTS ---------- */
                    products: [
                        { $match: productMatch },
                        { $sort: sortStage },
                    ],

                    /* ---------- COLOR COUNTS ---------- */
                    colorCounts: [
                        { $match: baseMatch },   // 🔥 IMPORTANT (no color filter here)
                        { $unwind: "$variants" },
                        {
                            $group: {
                                _id: "$variants.color.slug",
                                name: { $first: "$variants.color.name" },
                                hex: { $first: "$variants.color.hex" },
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                slug: "$_id",
                                name: 1,
                                hex: { $ifNull: ["$hex", "#000000"] },
                                count: 1,
                            },
                        },
                        { $sort: { name: 1 } },
                    ],
                    sizeCounts: [
                        { $match: baseMatch },
                        { $unwind: "$variants" },
                        { $unwind: "$variants.sizes" },
                        {
                            $group: {
                                _id: "$variants.sizes.size",
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                size: "$_id",
                                count: 1,
                            },
                        },
                        { $sort: { size: 1 } },
                    ],
                    fitCounts: [
                        { $match: baseMatch },
                        {
                            $group: {
                                _id: "$attributes.fitType",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                fitType: "$_id",
                                count: 1
                            }
                        },
                        { $sort: { fitType: 1 } }
                    ],
                    fabricCounts: [
                        {
                            $match: {
                                ...baseMatch,
                                "attributes.fabric": { $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: "$attributes.fabric",
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                fabric: "$_id",
                                count: 1
                            }
                        },
                        { $sort: { fabric: 1 } }
                    ],
                    patternCounts: [
                        {
                            $match: {
                                ...baseMatch,
                                "attributes.pattern": { $ne: null }
                            }
                        },
                        {
                            $group: {
                                _id: "$attributes.pattern",
                                count: { $sum: 1 }
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                pattern: "$_id",
                                count: 1
                            }
                        },
                        { $sort: { pattern: 1 } }
                    ]
                },
            },
        ]);

        const products = result[0].products;
        const colorCounts = result[0].colorCounts;
        const sizeCounts = result[0].sizeCounts;
        const fitCounts = result[0].fitCounts;
        const fabricCounts = result[0].fabricCounts;
        const patternCounts = result[0].patternCounts;

        return NextResponse.json(
            {
                category,
                products,
                colorCounts,
                sizeCounts,
                fitCounts,
                fabricCounts,
                patternCounts,
                priceRange: {
                    min: minAvailablePrice,
                    max: maxAvailablePrice,
                },
                total: products.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}