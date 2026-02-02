// app/api/webhooks/razorpay/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Address from "@/models/Address";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CartItemPopulated {
    productId: {
        _id: Types.ObjectId;
        productName: string;
        pricing: { price: number };
        slug: string;
    };
    quantity: number;
    variantSku: string;
    size?: string;
    image?: string;
    color?: { name?: string };
}
interface OrderItem {
    productId: Types.ObjectId;
    name: string;
    slug: string;
    image: string;
    size: string;
    color: string;
    sku: string;
    price: number;
    quantity: number;
    discount: number;
    total: number;
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

    const userObjectId = new Types.ObjectId(userId);

    /* 3️⃣ Idempotency */
    const existing = await Order.findOne({ checkoutToken }).lean();
    if (existing) {
        return NextResponse.json({ received: true });
    }

    /* 4️⃣ Fetch cart */
    const cart = await Cart.findOne({ userId: userObjectId })
        .populate("items.productId")


    if (!cart || cart.items.length === 0) {
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

    /* 6️⃣ Build items */
    const items: OrderItem[] = cart.items.map((item: CartItemPopulated) => {
        const price = item.productId.pricing.price;
        const total = price * item.quantity;

        return {
            productId: item.productId._id,
            name: item.productId.productName,
            slug: item.productId.slug ?? "",
            image: item.image ?? "",
            size: item.size ?? "",
            color: item.color?.name ?? "",
            sku: item.variantSku,
            quantity: item.quantity,
            price,
            discount: 0,
            total,
        };
    });

    /* 7️⃣ Totals */
    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * 0.05);
    const shippingFee = subtotal >= 999 ? 0 : 50;
    const discountAmount = 0;
    const grandTotal = subtotal + tax + shippingFee - discountAmount;

    /* 8️⃣ Order number */
    const orderNumber = `TL-${Date.now().toString().slice(-8)}`;
    console.log("ORDER PAYLOAD", {
        items,
        shippingAddress: address,
        grandTotal,
    });

    /* 9️⃣ Create order */
    await Order.create({
        userId: userObjectId,
        checkoutToken,
        orderNumber,
        items,
        shippingAddress: address,
        billingAddress: address,
        subtotal,
        tax,
        shippingFee,
        discountAmount,
        grandTotal,
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

    /* 🔟 Clear cart */
    await Cart.deleteOne({ userId: userObjectId });

    return NextResponse.json({ success: true });
}

