// /api/cart/[variantSku]/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/reqiureAuth";
import { Types } from "mongoose";
import Product from "@/models/Product";
import { SizeVariant } from "@/types/ProductTypes";


export async function DELETE(
    _req: Request,
    context: { params: Promise<{ variantSku: string }> }
) {
    try {
        const { variantSku } = await context.params;
        const auth = await requireAuth();
        if (!auth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = auth;
        await connectDB();


        const userObjectId = new Types.ObjectId(userId);

        const result = await Cart.updateOne(
            { userId: userObjectId },
            {
                $pull: {
                    items: { variantSku: variantSku },
                },
            }
        );

        console.log("🧹 Cart modified:", result.modifiedCount);

        // 🧹 cleanup empty cart
        const cart = await Cart.findOne({ userId: userObjectId });
        if (cart && cart.items.length === 0) {
            await Cart.deleteOne({ userId: userObjectId });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("CART DELETE ERROR:", err);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}


export async function PATCH(
    req: Request,
    context: { params: Promise<{ variantSku: string }> }
) {
    try {
        const { quantity } = await req.json();
        const { variantSku } = await context.params;

        if (!quantity || quantity < 1) {
            return NextResponse.json(
                { message: "Quantity must be at least 1" },
                { status: 400 }
            );
        }

        const auth = await requireAuth();
        if (!auth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = auth;
        await connectDB();

        const userObjectId = new Types.ObjectId(userId);

        // 🔎 1. Find Cart
        const cart = await Cart.findOne({ userId: userObjectId });
        if (!cart) {
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        const item = cart.items.find(
            (i: { variantSku: string; productId: string }) =>
                i.variantSku === variantSku
        );
        if (!item) {
            return NextResponse.json(
                { message: "Cart item not found" },
                { status: 404 }
            );
        }

        const product = await Product.findById(item.productId);
        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // 🔥 CORRECT NESTED SEARCH
        const variant = product.variants.find(
            (v: {
                sizes: SizeVariant[];
            }) =>
                v.sizes.some(
                    (s: SizeVariant) => s.variantSku === variantSku
                )
        );
        if (!variant) {
            return NextResponse.json(
                { message: "Variant not found" },
                { status: 404 }
            );
        }

        const size = variant.sizes.find(
            (s: SizeVariant) => s.variantSku === variantSku
        );

        if (!size) {
            return NextResponse.json(
                { message: "Size not found" },
                { status: 404 }
            );
        }

        // 🔥 STOCK CHECK
        if (quantity > size.stock) {
            return NextResponse.json(
                { message: `Only ${size.stock} items left in stock` },
                { status: 409 }
            );
        }

        // ✅ Update quantity
        await Cart.updateOne(
            {
                userId: userObjectId,
                "items.variantSku": variantSku,
            },
            {
                $set: { "items.$.quantity": quantity },
            }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("PATCH ERROR:", err);
        return NextResponse.json(
            { message: "Failed to update cart quantity" },
            { status: 500 }
        );
    }
}
