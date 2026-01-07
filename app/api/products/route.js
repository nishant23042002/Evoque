import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";


function generateSKU({ brand, category, slug }) {
    const safeBrand = typeof brand === "string" ? brand.slice(0, 2) : "XX";
    const safeCategory = category?.slug
        ? category.slug.slice(0, 2)
        : "XX";

    return `${safeBrand}-${safeCategory}-${slug}`.toUpperCase();
}




async function uploadImage(url, folder, publicId) {
    if (!url) return null;

    const res = await cloudinary.uploader.upload(url, {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
    });

    return {
        url: res.secure_url,
        public_id: res.public_id,
    };
}


/**
 * POST → Add Product
*/
export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            productName,
            slug,
            brand,
            category: categorySlug,
            fit,
            offers,
            pricing,
            rating,
            reviews,
            variants = [],
            description,
            details,
            seo,
            shipping,
            tags,
            isFeatured,
            isBestSeller,
            isNewArrival,
            launchDate,
        } = body;

        if (!pricing?.price) {
            return NextResponse.json({ message: "pricing.price is required" }, { status: 400 });
        }

        const category = await Category.findOne({ slug: categorySlug });
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 400 });
        }

        // Upload images → category-based folders + store public_id
        const uploadedVariants = [];

        for (const variant of variants) {
            const { color, sizes = [], pricing: variantPricing } = variant;

            const uploadedImages = [];

            for (let i = 0; i < (color.images || []).length; i++) {
                const uploaded = await uploadImage(
                    color.images[i].url,
                    `evoque/products/${category.slug}/${slug}/${color.slug}`,
                    `${slug}-${color.slug}-${i + 1}`
                );
                if (uploaded) {
                    uploadedImages.push({
                        url: uploaded.url,
                        publicId: uploaded.publicId,
                        isPrimary: color.images[i].isPrimary || false,
                    });
                }
            }

            const totalStock = sizes.reduce(
                (sum, s) => sum + (s.stock || 0),
                0
            );

            uploadedVariants.push({
                color: {
                    ...color,
                    images: uploadedImages,
                },
                sizes,
                pricing: variantPricing,
                totalStock,
            });
        }

        const sku = generateSKU({ brand, category, slug });

        // 3️⃣ Calculate total stock from variants
        const totalStock = uploadedVariants.reduce((sum, v) => sum + (v.totalStock || 0), 0);



        // 4️⃣ Create product
        const product = await Product.create({
            productName,
            slug,
            sku,
            brand,
            category: category._id,
            fit,
            offers,
            pricing,
            rating,
            reviews,
            variants: uploadedVariants,
            totalStock,
            description,
            details,
            seo,
            shipping,
            tags,
            isFeatured,
            isBestSeller,
            isNewArrival,
            launchDate,
        });


        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * GET → Fetch Products
 * /api/products?category=mobiles&tag=sale&page=1&limit=20
 */
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const categorySlug = searchParams.get("category");
        const tag = searchParams.get("tag");
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const filter = { isActive: true };

        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug });
            if (!category) {
                return NextResponse.json(
                    { message: "Category not found" },
                    { status: 404 }
                );
            }
            filter.category = category._id;
        }

        if (tag) {
            filter.tags = tag;
        }

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json(
            { message: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
