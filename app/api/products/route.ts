// app/api/products/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import mongoose, { ObjectId } from "mongoose";
import ProductType from "@/types/ProductTypes"; // Your Product interface
import { extractHexFromBuffer } from "@/data/extractColorFromImage";
import axios from "axios"

interface VariantImage {
    url: string;
    publicId: string;
    isPrimary: boolean;
    isHover?: boolean;
    order?: number;
}

interface VariantColor {
    name: string;
    slug: string;
    hex?: string;
    images: VariantImage[];
}

interface SizeVariant {
    size: string;
    stock: number;
    isAvailable?: boolean;
    variantSku?: string;
}

interface Variant {
    color: VariantColor;
    sizes?: SizeVariant[];
    pricing?: {
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
    };
    totalStock?: number;
}

interface Pricing {
    price: number;
    originalPrice: number;
    discountPercentage: number;
    currency: string;
}

type ProductFilter = Partial<ProductType> & {
    [key: string]: string | number | ObjectId | boolean | undefined;
};



type ProductPOSTBody = {
    productName: string;
    slug: string;
    brand: string;
    category: string; // slug or ObjectId
    subCategory: {
        name: string;
        slug: string;
        image?: string;
    };
    thumbnail: string;
    fit?: string;
    offers?: { type: string; title: string }[];
    pricing: Pricing;
    rating?: number;
    reviews?: {
        userId?: string;
        rating?: number;
        comment?: string;
        createdAt?: Date;
    }[];
    variants?: Variant[];
    description?: string;
    details?: {
        material?: string;
        fabricWeight?: string;
        stretch?: string;
        washCare?: string[];
        fitType?: string;
        rise?: string;
        closure?: string;
    };
    attributes?: {
        sleeve?: string;
        pattern?: string;
        occasion?: string[];
        fabric?: string;
        fitType?: string;
        season?: string[];
    };
    sizeChart?: {
        image?: string;
        measurements?: {
            size?: string;
            chest?: string;
            length?: string;
            shoulder?: string;
            sleeve?: string;
        }[];
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
    shipping?: {
        weight?: number;
        dimensions?: string;
        codAvailable?: boolean;
        returnDays?: number;
    };
    tags?: string[];
    badges?: { type?: string; label?: string }[];
    merchandising?: {
        priority?: number;
        collection?: string;
        displayOrder?: number;
    };
    search?: {
        keywords?: string[];
        synonyms?: string[];
        popularityScore?: number;
    };
    analytics?: {
        views?: number;
        cartAdds?: number;
        purchases?: number;
    };
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    launchDate?: string | Date;
};

type SubCategory = {
    name: string;
    slug: string;
    image?: string;
};

type UploadedImage = {
    url: string;
    publicId: string;
    isPrimary: boolean;
    isHover?: boolean;
    order?: number;
};


// ------------------- HELPERS -------------------

const toCode = (str = "", len = 2) =>
    str.replace(/[^a-zA-Z]/g, "").slice(0, len).toUpperCase();

function generateProductSKU({
    brand,
    categorySlug,
    subCategorySlug,
    serial,
}: {
    brand: string;
    categorySlug: string;
    subCategorySlug: string;
    serial: number;
}) {
    return [
        toCode(brand, 2),
        toCode(categorySlug, 2),
        toCode(subCategorySlug, 2),
        String(serial).padStart(3, "0"),
    ].join("-");
}

function generateVariantSKU({
    productSku,
    color,
    size,
}: {
    productSku: string;
    color: string;
    size: string;
}) {
    return `${productSku}-${toCode(color, 3)}-${size.toUpperCase()}`;
}

async function uploadImage(
    url?: string,
    folder?: string,
    publicId?: string
): Promise<{ url: string; publicId: string; buffer: Buffer } | null> {
    if (!url) return null;

    const res = await cloudinary.uploader.upload(url, {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
    });
    const imageRes = await axios.get(res.secure_url, {
        responseType: "arraybuffer",
    });

    return {
        url: res.secure_url,
        publicId: res.public_id,
        buffer: Buffer.from(imageRes.data)
    };
}

// ------------------- POST -------------------

export async function POST(req: Request) {
    try {
        await connectDB();
        const body: ProductPOSTBody = await req.json();

        const {
            productName,
            slug,
            brand,
            category: categorySlug,
            subCategory,
            variants = [],
            pricing,
            attributes,
            thumbnail,
            description,
            fit,
            sizeChart,
            details,
            seo,
            shipping,
            offers,
            tags,
            badges,
            merchandising,
            search,
            analytics,
            isActive,
            isFeatured,
            isBestSeller,
            isNewArrival,
            launchDate,
        } = body;

        if (!pricing?.price) {
            return NextResponse.json(
                { message: "pricing.price is required" },
                { status: 400 }
            );
        }

        if (!subCategory?.slug) {
            return NextResponse.json(
                { message: "subCategory is required" },
                { status: 400 }
            );
        }

        if (!thumbnail) {
            return NextResponse.json(
                { message: "Thumbnail is required" },
                { status: 400 }
            );
        }

        // Find category
        let category;
        if (mongoose.Types.ObjectId.isValid(categorySlug)) {
            category = await Category.findById(categorySlug);
        } else {
            category = await Category.findOne({ slug: categorySlug });
        }
        if (!category) return NextResponse.json({ message: "Category not found" }, { status: 400 });

        // Validate subCategory
        const validSub = category.subCategories.find(
            (s: SubCategory) => s.slug === subCategory.slug
        );
        if (!validSub)
            return NextResponse.json({ message: "Invalid subCategory" }, { status: 400 });

        // Generate SKU
        const productCount = await Product.countDocuments({ category: category._id });
        const productSku = generateProductSKU({
            brand,
            categorySlug,
            subCategorySlug: subCategory.slug,
            serial: productCount + 1,
        });

        // Upload variants
        const uploadedVariants = [];
        for (const variant of variants) {
            const { color, sizes = [], pricing: variantPricing } = variant;
            const uploadedImages: UploadedImage[] = [];

            let colorHex: string | undefined;
            for (let i = 0; i < (color.images || []).length; i++) {
                const uploaded = await uploadImage(
                    color.images[i].url,
                    `thelayerco./products/${category.slug}/${slug}/${color.slug}`,
                    `${productSku}-${color.slug}-${i + 1}`
                );
                if (uploaded) {
                    uploadedImages.push({
                        url: uploaded.url,
                        publicId: uploaded.publicId,
                        isPrimary: color.images[i].isPrimary || false,
                        isHover: color.images[i].isHover || false,
                        order: color.images[i].order || 0,
                    });
                    // 🔥 Extract color only once (primary image preferred)
                    if (!colorHex && color.images[i].isPrimary) {
                        colorHex = await extractHexFromBuffer(uploaded.buffer);
                    }
                }
            }

            // Fallback: first image
            if (!colorHex && uploadedImages.length) {
                colorHex = await extractHexFromBuffer(
                    Buffer.from(
                        await (
                            await fetch(uploadedImages[0].url)
                        ).arrayBuffer()
                    )
                );
            }

            const updatedSizes: SizeVariant[] = sizes.map((s: SizeVariant) => ({
                ...s,
                variantSku: generateVariantSKU({
                    productSku,
                    color: color.name,
                    size: s.size,
                }),
            }));


            const totalStock = updatedSizes.reduce((sum, s) => sum + (s.stock || 0), 0);

            uploadedVariants.push({
                color: { ...color, hex: colorHex, images: uploadedImages },
                sizes: updatedSizes,
                pricing: variantPricing,
                totalStock,
            });
        }

        const totalStock = uploadedVariants.reduce((sum, v) => sum + (v.totalStock || 0), 0);

        const product = await Product.create({
            productName,
            slug,
            sku: productSku,
            brand,
            category: category._id,
            subCategory: {
                name: validSub.name,
                slug: validSub.slug,
                image: validSub.image,
            },
            fit,
            attributes,
            variants: uploadedVariants,
            pricing,
            thumbnail,
            totalStock,
            description,
            sizeChart,
            details,
            offers,
            seo,
            shipping,
            tags,
            badges,
            merchandising,
            search,
            analytics,
            isActive,
            isFeatured,
            isBestSeller,
            isNewArrival,
            launchDate: launchDate ? new Date(launchDate) : undefined
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );

    }
}


/**
 * GET → Fetch Products
 * /api/products?category=mobiles&tag=sale&page=1&limit=20
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const categorySlug = searchParams.get("category") || undefined;
        const subCategorySlug = searchParams.get("subCategory") || undefined;
        const pattern = searchParams.get("pattern") || undefined;
        const fabric = searchParams.get("fabric") || undefined;
        const tag = searchParams.get("tag") || undefined;

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;

        const filter: ProductFilter = { isActive: true };

        if (categorySlug) {
            const category = await Category.findOne({ slug: categorySlug }); // _id is ObjectId
            if (!category) {
                return NextResponse.json({ message: "Category not found" }, { status: 404 });
            }
            filter.category = category!._id; // ✅ ObjectId
        }

        if (subCategorySlug) filter["subCategory.slug"] = subCategorySlug;
        if (pattern) filter["attributes.pattern"] = pattern;
        if (fabric) filter["attributes.fabric"] = fabric;
        if (tag) filter.tags = tag.split(","); // ✅ ["sale", "new"] etc.


        const products = await Product.find(filter)
            .populate("category", "name slug")
            .sort({ "merchandising.priority": -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({ page, limit, count: products.length, products });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

