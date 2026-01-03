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

        const body = await req.json();

        if (!body.name) {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        const slug = slugify(body.name, { lower: true });

        const exists = await Category.findOne({ slug });
        if (exists) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 409 }
            );
        }

        const category = await Category.create({
            name: body.name,
            slug: body.slug,
            image: body.image,
            isFeatured: body.isFeatured ?? true,
            isActive: body.isActive ?? true,
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


export async function GET() {
    await connectDB();

    const categories = await Category.find();

    return NextResponse.json(categories);
}