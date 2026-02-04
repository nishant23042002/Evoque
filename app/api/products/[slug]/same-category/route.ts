import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

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

    // 1️⃣ Get base product (only category + _id needed)
    const baseProduct = await Product.findOne(
        { slug: decodedSlug, isActive: true },
        { category: 1 }
    ).lean();

    if (!baseProduct) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        );
    }

    // 2️⃣ Fetch same-category products (excluding PDP product)
    const products = await Product.find({
        category: baseProduct.category,
        isActive: true,
        _id: { $ne: baseProduct._id },
    })
        .sort({
            isFeatured: -1,
            isBestSeller: -1,
            isNewArrival: -1,
            "merchandising.priority": -1,
            createdAt: -1,
        })
        .limit(12)
        .select("productName slug thumbnail pricing variants brand")
        .lean();

    return NextResponse.json({
        products,
    });
}
