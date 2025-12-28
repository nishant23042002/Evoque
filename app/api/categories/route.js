import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import slugify from "slugify";

/**
 * POST → Create Category
 */
export async function POST(req) {
    try {
        await connectDB();

        const { name, description } = await req.json();

        if (!name) {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        const slug = slugify(name, { lower: true });

        const exists = await Category.findOne({ slug });
        if (exists) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 409 }
            );
        }

        const category = await Category.create({
            name,
            slug,
            description,
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
