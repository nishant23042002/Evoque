import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

type PurchaseItem = {
    productId: string;
    qty: number;
};

const BEST_SELLER_THRESHOLD = 5;

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { items } = body as { items: PurchaseItem[] };

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { message: "items array is required" },
                { status: 400 }
            );
        }

        // ✅ Build bulk operations
        const bulkOps = items
            .filter(
                item =>
                    mongoose.Types.ObjectId.isValid(item.productId) &&
                    typeof item.qty === "number" &&
                    item.qty > 0
            )
            .map(item => ({
                updateOne: {
                    filter: {
                        _id: new mongoose.Types.ObjectId(item.productId),
                    },
                    update: {
                        $inc: {
                            "analytics.purchases": item.qty,
                        },
                    },
                },
            }));

        if (!bulkOps.length) {
            return NextResponse.json(
                { message: "No valid purchase items" },
                { status: 400 }
            );
        }

        // 1️⃣ Increment purchases (atomic + fast)
        await Product.bulkWrite(bulkOps);

        // 2️⃣ Auto-mark best sellers
        await Product.updateMany(
            {
                "analytics.purchases": { $gte: BEST_SELLER_THRESHOLD },
                isBestSeller: { $ne: true },
            },
            {
                $set: { isBestSeller: true },
            }
        );


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update purchases analytics" },
            { status: 500 }
        );
    }
}
