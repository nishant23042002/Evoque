// app/api/webhooks/razorpay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose, { Types } from "mongoose";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Address from "@/models/Address";
import CheckoutSession from "@/models/CheckoutSession";
import Coupon from "@/models/Coupon";
import Product from "@/models/Product";
import { OrderItem } from "@/types/OrderTypes";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutSessionItem {
    productId: string;
    name: string;
    image?: string;
    variantSku: string;
    slug: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
}


export async function POST(req: Request) {
    /* 1️⃣ Raw body */
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    /* 2️⃣ Verify signature */
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

    if (expectedSignature !== signature) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    const event = JSON.parse(body);
    if (event.event !== "payment.captured") {
        return NextResponse.json({ received: true });
    }

    await connectDB();

    const payment = event.payload.payment.entity;
    const { userId, checkoutToken } = payment.notes || {};
    if (!userId || !checkoutToken) {
        return NextResponse.json({ received: true });
    }


    const session = await CheckoutSession.findOne({ checkoutToken }).lean<{
        items: CheckoutSessionItem[];
        subtotal: number;
        tax: number;
        shippingFee: number;
        discountAmount: number;
        grandTotal: number;
        coupon?: {
            code: string;
        };
        userId: Types.ObjectId;
        expiresAt: Date;
    }>();


    if (!session) {
        console.log("No checkout session found");
        return NextResponse.json({ received: true });
    }

    if (session.expiresAt < new Date()) {
        console.log("session expired");
        return NextResponse.json({ received: true });
    }

    if (session.userId.toString() !== userId) {
        console.log("user mismatch");
        return NextResponse.json({ received: true });
    }

    if (payment.amount !== Math.round(session.grandTotal * 100)) {
        console.log("amount mismatch");
        return NextResponse.json({ received: true });
    }

    console.log("Session User:", session.userId.toString());
    console.log("Payment User:", userId);
    console.log("Webhook Triggered");
    console.log("Payment Notes:", payment.notes);
    console.log("Session:", session);
    console.log("Payment Amount:", payment.amount);

    const userObjectId = new Types.ObjectId(userId);

    /* 5️⃣ Fetch address */
    const addressDoc = await Address.findOne({ userId: userObjectId });
    if (!addressDoc) return NextResponse.json({ received: true });

    const address = {
        name: addressDoc.name,
        phone: addressDoc.phone,
        addressLine1: addressDoc.addressLine1,
        addressLine2: addressDoc.addressLine2 ?? "",
        city: addressDoc.city,
        state: addressDoc.state,
        pincode: addressDoc.pincode,
        country: addressDoc.country ?? "India",
    };


    /* 🔹 Build typed order items */
    const orderItems: OrderItem[] = session.items.map((item) => ({
        productId: new Types.ObjectId(item.productId),
        name: item.name,
        slug: item.slug,
        image: item.image ?? "",
        size: item.size,
        color: item.color,
        sku: item.variantSku,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        total: item.price * item.quantity,
    }));

    /* 8️⃣ Order number */
    const orderNumber = `TL-${Date.now().toString().slice(-8)}`;

    /* ===============================
       🔥 START TRANSACTION
    ================================ */
    const dbSession = await mongoose.startSession();

    /* 4️⃣ Idempotency */
    const existing = await Order.findOne({ checkoutToken }).lean();
    if (existing) {
        return NextResponse.json({ received: true });
    }

    try {
        dbSession.startTransaction();

        /* 🔥 ATOMIC STOCK DEDUCTION */
        for (const item of orderItems) {
            const stockUpdate = await Product.updateOne(
                {
                    _id: item.productId,
                    "variants.sizes.variantSku": item.sku,
                    "variants.sizes.stock": { $gte: item.quantity }, // prevents oversell
                },
                {
                    $inc: {
                        "variants.$[variant].sizes.$[size].stock": -item.quantity,
                    },
                },
                {
                    arrayFilters: [
                        { "variant.sizes.variantSku": item.sku },
                        { "size.variantSku": item.sku },
                    ],
                    session: dbSession,
                }
            );

            if (stockUpdate.modifiedCount === 0) {
                throw new Error(`Insufficient stock for SKU: ${item.sku}`);
            }
        }

        /* 🔁 Recalculate totalStock & availability */
        for (const item of orderItems) {
            const product = await Product.findById(item.productId).session(dbSession);
            if (!product) continue;

            // ✅ define AFTER product exists
            type VariantDoc = (typeof product.variants)[number];
            type SizeDoc = VariantDoc["sizes"][number];

            product.variants.forEach((variant: VariantDoc) => {
                variant.sizes.forEach((size: SizeDoc) => {
                    // 🔥 Update size availability
                    size.isAvailable = size.stock > 0;
                });


                variant.totalStock = variant.sizes.reduce(
                    (sum: number, s: SizeDoc) => sum + s.stock,
                    0
                );
            });

            product.totalStock = product.variants.reduce(
                (sum: number, v: VariantDoc) =>
                    sum + (v.totalStock ?? 0),
                0
            );

            product.isAvailable = product.totalStock > 0;

            await product.save({ session: dbSession });
        }

        /* 🧾 CREATE ORDER INSIDE TRANSACTION */
        await Order.create(
            [
                {
                    userId: userObjectId,
                    checkoutToken,
                    orderNumber,
                    items: orderItems,
                    shippingAddress: address,
                    billingAddress: address,
                    subtotal: session.subtotal,
                    tax: session.tax,
                    shippingFee: session.shippingFee,
                    discountAmount: session.discountAmount,
                    grandTotal: session.grandTotal,
                    paymentInfo: {
                        method: "razorpay",
                        paymentId: payment.id,
                        orderId: payment.order_id,
                        signature,
                        status: "paid",
                        paidAt: new Date(),
                    },
                    orderStatus: "confirmed",
                },
            ],
            { session: dbSession }
        );

        /* 🎟 Coupon increment */
        if (session.coupon?.code) {
            await Coupon.updateOne(
                { code: session.coupon.code, isActive: true },
                { $inc: { usedCount: 1 } },
                { session: dbSession }
            );
        }

        /* 🧹 Cleanup */
        await CheckoutSession.deleteOne({ checkoutToken }).session(dbSession);
        await Cart.deleteOne({ userId: userObjectId }).session(dbSession);

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json({ success: true });

    } catch (error) {
        await dbSession.abortTransaction();
        dbSession.endSession();

        console.error("🚨 Transaction failed:", error);

        // Optional: trigger auto refund here

        return NextResponse.json(
            { message: "Stock issue detected — order cancelled automatically" },
            { status: 409 }
        );
    }
}

