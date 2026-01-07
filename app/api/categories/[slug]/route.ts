import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        // ✅ unwrap params
        const { slug } = await params;

        // 1️⃣ Validate slug
        if (!slug) {
            return NextResponse.json(
                { message: "Slug missing in URL" },
                { status: 400 }
            );
        }

        const decodedSlug = decodeURIComponent(slug);

        // 2️⃣ Connect DB
        await connectDB();

        // 3️⃣ Find category
        const category = await Category.findOne({
            slug: decodedSlug,
            isActive: true,
        }).populate({
            path: "products",
            match: { isActive: true },
        });

        // 4️⃣ Not found
        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // 5️⃣ Success
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: error || "Internal Server Error" },
            { status: 500 }
        );
    }
}
