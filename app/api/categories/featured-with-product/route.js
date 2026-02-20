// /api/categories/featured-with-product/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET() {
    try {
        await connectDB();

        // 1️⃣ Get featured categories
        const categories = await Category.find({
            isFeatured: true,
            isActive: true,
        }).select("name slug image");

        // 2️⃣ For each category fetch 1 product
        const result = await Promise.all(
            categories.map(async (category) => {
                const product = await Product.findOne({
                    category: category._id,
                    isActive: true,
                })
                    .sort({ createdAt: -1 }) // newest
                    .select("productName thumbnail slug pricing")
                    .lean();

                return {
                    category,
                    product,
                };
            })
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch featured category products" },
            { status: 500 }
        );
    }
}