import { NextResponse } from "next/server";
import { Types } from "mongoose";
import crypto from "crypto";

import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Cart from "@/models/Cart";
import Address from "@/models/Address";


interface PopulatedProduct {
    _id: Types.ObjectId;
    productName: string;
    thumbnail?: string;
    isAvailable: boolean;
    pricing: {
        price: number;
    };
}
interface PopulatedCartItem {
    productId: PopulatedProduct;
    quantity: number;
    variantSku: string;
}

export async function POST() {
    try {
        const { userId } = await requireAuth();
        await connectDB();

        const userObjectId = new Types.ObjectId(userId);

        // 1️⃣ Fetch cart
        const cart = await Cart.findOne({ userId: userObjectId })
            .populate("items.productId")
            .lean<{ items: PopulatedCartItem[] }>();

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 }
            );
        }

        // 2️⃣ Fetch default address
        const address = await Address.findOne({
            userId: userObjectId,
            isDefault: true,
        }).lean();

        if (!address) {
            return NextResponse.json(
                { message: "No default address found" },
                { status: 400 }
            );
        }
        let subtotal = 0;
        const checkoutItems = [];

        // 2️⃣ Recalculate prices & validate products
        for (const item of cart.items) {
            const product = item.productId;
            console.log("PRODUCT:", item.productId);

            if (!product || !product.isAvailable) {
                return NextResponse.json(
                    { message: "One or more products are unavailable" },
                    { status: 409 }
                );
            }

            const price = product.pricing.price;
            subtotal += price * item.quantity;

            checkoutItems.push({
                productId: product._id.toString(),
                name: product.productName,
                variantSku: item.variantSku,
                quantity: item.quantity,
                price,
                image: product.thumbnail ?? "",
            });
        }

        // 3️⃣ Pricing rules (can evolve later)
        const discount = 0; // coupon logic later
        const shipping = subtotal >= 999 ? 0 : 50;
        const tax = Math.round(subtotal * 0.05); // 5% GST example

        const totalAmount = subtotal - discount + shipping + tax;

        // 4️⃣ Create price hash (anti-tamper)
        const priceHash = crypto
            .createHash("sha256")
            .update(`${userId}:${totalAmount}:${Date.now()}`)
            .digest("hex");

        const checkoutToken = crypto.randomUUID();

        // 5️⃣ Return checkout snapshot
        return NextResponse.json({
            items: checkoutItems,
            address,
            summary: {
                subtotal,
                shipping,
                tax,
                discount,
                totalAmount,
            },
            priceHash,
            checkoutToken,
        });
    } catch (err) {
        console.error("CHECKOUT PREPARE ERROR:", err);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
