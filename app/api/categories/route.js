// /api/categories/route.js

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

        const { name, slug, image, sizeType, leftMenuCategoryImage, description, attribute, badge, merchandising, seo, isTrending, categoryPageBanner, subCategories = [], isActive, isFeatured } = body;

        if (!name || !slug || !image || !leftMenuCategoryImage || !categoryPageBanner) {
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
            folder: `thelayerco./categories/${slug}`,
        });
        const leftMenuImg = await cloudinary.uploader.upload(leftMenuCategoryImage, {
            folder: `thelayerco./categories/${slug}/leftmenu-specific-img`,
        });
        const categoryPageBannerImg = await cloudinary.uploader.upload(categoryPageBanner, {
            folder: `thelayerco./categories/${slug}/category-page-banners`,
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
                folder: `thelayerco./categories/${slug}/subcategories/${sub.slug}`,
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
            leftMenuCategoryImage: leftMenuImg.secure_url,
            categoryPageBanner: categoryPageBannerImg.secure_url,
            description,
            sizeType,
            seo,
            attribute,
            badge,
            merchandising,
            subCategories: formattedSubCategories,
            isFeatured: isFeatured ?? true,
            isTrending,
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