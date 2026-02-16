// app/api/products/best-sellers/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find({
            isActive: true,
            isBestSeller: true,
        })
            .sort({
                "analytics.purchases": -1,
                "analytics.cartAdds": -1,
                "analytics.views": -1,
            })
            .lean();

        return NextResponse.json({ products });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Failed to fetch best sellers" },
            { status: 500 }
        );
    }
}
