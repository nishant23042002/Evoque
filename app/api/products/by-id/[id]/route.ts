// api/products/by-id/[id]/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        // ✅ UNWRAP params (THIS IS THE FIX)
        const { id } = await context.params;

        // 🔐 Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid product id" },
                { status: 400 }
            );
        }

        const product = await Product.findById(id).lean();

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("GET /api/products/by-id error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
