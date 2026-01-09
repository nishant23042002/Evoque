import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";


const toSlug = (str) =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const toTitle = (str) =>
    str
        .toLowerCase()
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

/**
 * POST → Create Category
*/
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const { name, slug, image, subCategories = [], isActive, isFeatured } = body;

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

        const categoryUpload = await cloudinary.uploader.upload(image, {
            folder: `evoque/categories/${slug}`,
        });

        /* ---------------- HANDLE SUB CATEGORIES ---------------- */

        const formattedSubCategories = [];

        for (const sub of subCategories) {
            if (!sub.name || !sub.slug || !sub.image) {
                return NextResponse.json(
                    { message: "Each subcategory must have name, slug and image" },
                    { status: 400 }
                );
            }

            const subUpload = await cloudinary.uploader.upload(sub.image, {
                folder: `evoque/categories/${slug}/subcategories/${sub.slug}`,
            });

            const fullSubCategoryName = `${toTitle(sub.name)} ${toTitle(name)}`;
            const fullSubCategorySlug = `${toSlug(sub.slug)}-${toSlug(slug)}`;

            formattedSubCategories.push({
                name: fullSubCategoryName,          // "Plain Shirts"
                slug: fullSubCategorySlug,          // "plain-shirts"
                image: subUpload.secure_url,
                isActive: sub.isActive ?? true,
            });

        }

        const category = await Category.create({
            name: name,
            slug: slug,
            image: categoryUpload.secure_url,
            subCategories: formattedSubCategories,
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