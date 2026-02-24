// app/api/webhooks/razorpay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Address from "@/models/Address";
import CheckoutSession from "@/models/CheckoutSession";
import Coupon from "@/models/Coupon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutSessionItem {
    productId: string;
    name: string;
    image?: string;
    variantSku: string;
    slug:string;
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

    /* 3️⃣ Idempotency */
    const existing = await Order.findOne({ checkoutToken }).lean();
    if (existing) {
        return NextResponse.json({ received: true });
    }

    /* 5️⃣ Fetch address */
    const addressDoc = await Address.findOne({
        userId: userObjectId,
    })

    if (!addressDoc) {
        return NextResponse.json({ received: true });
    }

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

    const orderItems = session.items.map((item: CheckoutSessionItem) => {
        const total = item.price * item.quantity;

        return {
            productId: new Types.ObjectId(item.productId),
            name: item.name,
            slug: item.slug, // optional if you don’t store it
            image: item.image ?? "",
            size: item.size,
            color: item.color,
            sku: item.variantSku,   // 🔥 map correctly
            quantity: item.quantity,
            price: item.price,
            discount: 0,
            total,
        }
    })


    /* 8️⃣ Order number */
    const orderNumber = `TL-${Date.now().toString().slice(-8)}`;


    /* 9️⃣ Create order */
    await Order.create({
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
    });

    if (session.coupon?.code) {
        await Coupon.updateOne(
            { code: session.coupon.code, isActive: true },
            { $inc: { usedCount: 1 } }
        );
    }
    await CheckoutSession.deleteOne({ checkoutToken });
    /* 🔟 Clear cart */
    await Cart.deleteOne({ userId: userObjectId });

    return NextResponse.json({ success: true });
}

