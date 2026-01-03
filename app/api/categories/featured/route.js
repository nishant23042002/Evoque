import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find({
            isFeatured: true,
            isActive: true,
        })
            .select("name slug image") // only what frontend needs
            .sort({ createdAt: -1 });

        return NextResponse.json(categories);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
