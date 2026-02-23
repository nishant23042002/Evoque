// /api/products/purchase/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

type PurchaseItem = {
    productId: string;
    variantSku: string;
    quantity: number;
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

        const bulkOps = [];

        for (const item of items) {

            if (
                !mongoose.Types.ObjectId.isValid(item.productId) ||
                !item.variantSku ||
                typeof item.quantity !== "number" ||
                item.quantity <= 0
            ) continue;

            // 🔥 Prevent overselling
            const product = await Product.findOne({
                _id: item.productId,
                "variants.sizes.variantSku": item.variantSku,
                "variants.sizes.stock": { $gte: item.quantity }
            });

            if (!product) {
                return NextResponse.json(
                    { message: "Insufficient stock for one or more items" },
                    { status: 400 }
                );
            }

            bulkOps.push({
                updateOne: {
                    filter: { _id: new mongoose.Types.ObjectId(item.productId) },
                    update: {
                        $inc: {
                            // reduce exact size stock
                            "variants.$[variant].sizes.$[size].stock": -item.quantity,

                            // reduce variant totalStock
                            "variants.$[variant].totalStock": -item.quantity,

                            // reduce product totalStock
                            "totalStock": -item.quantity,

                            // increase purchases
                            "analytics.purchases": item.quantity,
                        }
                    },
                    arrayFilters: [
                        { "variant.sizes.variantSku": item.variantSku },
                        { "size.variantSku": item.variantSku }
                    ]
                }
            });
        }

        if (!bulkOps.length) {
            return NextResponse.json(
                { message: "No valid purchase items" },
                { status: 400 }
            );
        }

        // 🔥 Execute all updates atomically
        await Product.bulkWrite(bulkOps);

        const affectedProductIds = [
            ...new Set(
                items.map(i => i.productId)
            )
        ].map(id => new mongoose.Types.ObjectId(id));


        await Product.updateMany(
            { _id: { $in: affectedProductIds } },
            {
                $set: {
                    "variants.$[].sizes.$[size].isAvailable": false
                }
            },
            {
                arrayFilters: [{ "size.stock": { $lte: 0 } }]
            }
        );

        await Product.updateMany(
            { _id: { $in: affectedProductIds } },
            {
                $set: {
                    "variants.$[].sizes.$[size].isAvailable": true
                }
            },
            {
                arrayFilters: [{ "size.stock": { $gt: 0 } }]
            }
        );

        // If totalStock <= 0 → product not available
        await Product.updateMany(
            {
                _id: { $in: affectedProductIds },
                totalStock: { $lte: 0 }
            },
            {
                $set: { isAvailable: false }
            }
        );

        // If totalStock > 0 → product available
        await Product.updateMany(
            {
                _id: { $in: affectedProductIds },
                totalStock: { $gt: 0 }
            },
            {
                $set: { isAvailable: true }
            }
        );

        /* ===========================
           BEST SELLER LOGIC (UNCHANGED)
        =========================== */
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
            { message: "Failed to update purchases & stock" },
            { status: 500 }
        );
    }
}