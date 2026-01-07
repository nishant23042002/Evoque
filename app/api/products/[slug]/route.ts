import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({
        slug,
        isActive: true,
    });

    if (!product) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(product);
}
