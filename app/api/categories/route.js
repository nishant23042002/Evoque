import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";



/**
 * POST → Create Category
*/
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { name, slug, image, isActive, isFeatured } = body;

        if (!name || !slug || !image) {
            return NextResponse.json(
                { message: "Name, slug and image are required" },
                { status: 400 }
            );
        }

        const exists = await Category.findOne({ slug });
        if (exists) {
            return NextResponse.json(
                { message: "Category already exists" },
                { status: 409 }
            );
        }

        const upload = await cloudinary.uploader.upload(image, {
            folder: `evoque/categories/${slug}`,
        });

        const category = await Category.create({
            name: name,
            slug: slug,
            image: upload.secure_url,
            isFeatured: isFeatured ?? true,
            isActive: isActive ?? true,
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
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