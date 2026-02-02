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

    if (!slug) {
        return NextResponse.json(
            { message: "Slug param missing" },
            { status: 400 }
        );
    }

    const product = await Product.findOne({
        slug: decodedSlug,
        isActive: true,
    }).populate("category", "name slug sizeType")
        .lean();

    if (!product) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(product);
}
