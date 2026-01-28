import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import { requireAuth } from "@/lib/reqiureAuth";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { Variant } from "@/types/ProductTypes";
export const dynamic = "force-dynamic";

interface PopulatedProduct {
    _id: Types.ObjectId;
    productName: string;
    slug: string;
    brand: string;
    thumbnail?: string;
    pricing: {
        price: number;
        originalPrice?: number;
    };
    variants: Variant;
    category?: {
        slug: string;
    };
}

interface PopulatedWishlistItem {
    productId: PopulatedProduct;
}

interface PopulatedWishlist {
    items: PopulatedWishlistItem[];
}

export async function GET() {
    try {
        const { userId } = await requireAuth();
        await connectDB();

        const wishlist = await Wishlist.findOne({ userId })
            .populate("items.productId")
            .lean<PopulatedWishlist | null>();

        if (!wishlist) {
            return NextResponse.json([]);
        }

        return NextResponse.json(
            wishlist.items.map((i: PopulatedWishlistItem) => ({
                productId: i.productId._id.toString(),
                product: i.productId,
                name: i.productId.productName,
                slug: i.productId.slug,
                image: i.productId.thumbnail,
                price: i.productId.pricing.price,
                originalPrice: i.productId.pricing.originalPrice,
                brand: i.productId.brand
            })) ?? []
        );
    } catch (error) {
        console.error("Wishlist GET error:", error);

        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}


export async function POST(req: Request) {
    try {
        const { userId } = await requireAuth();
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        console.log("🍪 TOKEN IN WISHLIST ROUTE:", token);
        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json(
                { message: "Product ID missing" },
                { status: 400 }
            );
        }
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            {
                $addToSet: {
                    items: { productId }
                }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(wishlist);
    } catch (err) {
        console.error("❌ WISHLIST POST ERROR:", err);

        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}

