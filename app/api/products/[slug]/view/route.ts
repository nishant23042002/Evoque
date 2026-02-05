// app/api/products/[slug]/view/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();

        const { slug } = await params;

        const product = await Product.findOneAndUpdate(
            { slug: slug },
            { $inc: { "analytics.views": 1 } },
            { new: true }
        );

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
    }
}
