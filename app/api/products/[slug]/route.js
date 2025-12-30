import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/db";

export async function GET(req, { params }) {
    await connectDB();

    const { slug } = params;

    const product = await Product.findOne({
        slug,
        isActive: true,
    }).populate("category");

    if (!product) {
        return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(product);
}
