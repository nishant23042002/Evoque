import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import mongoose from "mongoose";



export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // ✅ MUST await params
        const { slug } = await params;

        const { searchParams } = new URL(request.url);
        const sub = searchParams.get("sub");

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

        const products = await Product.find(productQuery)
            .sort({ createdAt: -1 })
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
