import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // 1️⃣ Validate slug
        if (!slug) {
            return NextResponse.json(
                { message: "Slug missing in URL" },
                { status: 400 }
            );
        }

        await connectDB();

        const category = await Category.findOne({
            slug,
            isActive: true,
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Get products under this category
        const products = await Product.find({
            category: category._id,
            isActive: true,
        }).sort({ createdAt: -1 });

        // 3️⃣ Return combined response
        return NextResponse.json(
            {
                category,
                products,
                total: products.length,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error || "Internal Server Error" },
            { status: 500 }
        );
    }
}
