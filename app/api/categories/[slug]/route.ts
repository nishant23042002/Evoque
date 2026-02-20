// /api/categories/[slug]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose from "mongoose";

type SortOption = "recommended" | "newest" | "low-high" | "high-low";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // ✅ MUST await params
        const { slug } = await params;

        const { searchParams } = new URL(request.url);
        const sub = searchParams.get("sub");
        const sort = searchParams.get("sort") as SortOption | null;

        if (!slug) {
            return NextResponse.json(
                { message: "Category slug missing" },
                { status: 400 }
            );
        }

        await connectDB();

        // 1️⃣ Fetch category
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

        // 2️⃣ Product query
        const productQuery: {
            category: mongoose.Types.ObjectId;
            isActive: boolean;
            "subCategory.slug"?: string;
        } = {
            category: category._id as mongoose.Types.ObjectId,
            isActive: true,
        };
        if (sub) {
            productQuery["subCategory.slug"] = sub;
        }

        /* ---------------- SORT MAP ---------------- */
        const sortMap: Record<SortOption, Record<string, 1 | -1>> = {
            "recommended": { "analytics.purchases": 1 },
            newest: { createdAt: -1 },
            "low-high": { "pricing.price": 1 },
            "high-low": { "pricing.price": -1 },
        };
        const sortQuery = sort ? sortMap[sort] : sortMap["newest"];
        const products = await Product.find(productQuery)
            .sort(sortQuery)
            .lean();

        return NextResponse.json(
            {
                category,
                products,
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
