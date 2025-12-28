import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

/**
 * POST → Add Product
 */
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const category = await Category.findOne({ slug: body.category });
        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 400 }
            );
        }

        const product = await Product.create({
            ...body,
            category: category._id,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * GET → Fetch Products
 * /api/products?category=mobiles&tag=sale&page=1&limit=20
 */
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const categorySlug = searchParams.get("category");
        const tag = searchParams.get("tag");
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const filter = { isActive: true };

        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (!category) {
                return NextResponse.json(
                    { message: "Category not found" },
                    { status: 404 }
                );
            }
            filter.category = category._id;
        }

        if (tag) {
            filter.tags = tag;
        }

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
