import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

interface CartRecommendationItem {
    productId: string;
    categoryId: string;
    price: number;
    brand?: string;
}

interface CartRecommendationPayload {
    cartItems: CartRecommendationItem[];
}


export async function POST(req: Request) {
    await connectDB();

    const body = (await req.json()) as CartRecommendationPayload;
    const cartItems = body.cartItems;

    if (!cartItems || cartItems.length === 0) {
        return NextResponse.json([]);
    }

    /* ---------- Extract signals ---------- */
    const categoryIds = cartItems.map(i => i.categoryId);
    const productIdsInCart = cartItems.map(i => i.productId);

    const avgPrice =
        cartItems.reduce((sum, i) => sum + i.price, 0) / cartItems.length;

    /* ---------- Query candidates ---------- */
    const candidates = await Product.find({
        _id: { $nin: productIdsInCart },
        category: { $in: categoryIds },
        isAvailable: true,
    })
        .limit(30)
        .lean();

    /* ---------- Score products ---------- */
    const scored = candidates.map(product => {
        let score = 0;

        // Same category
        if (categoryIds.includes(product.category.toString())) score += 5;

        // Price similarity
        const diff = Math.abs(product.pricing.price - avgPrice);
        if (diff <= avgPrice * 0.2) score += 3;
        else if (diff <= avgPrice * 0.4) score += 1;

        // Same brand
        if (cartItems.some(i => i.brand && i.brand === product.brand)) {
            score += 1;
        }

        return { ...product, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return NextResponse.json(scored.slice(0, 12));
}