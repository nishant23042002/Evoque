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
        pricing: {
            price: number;
        };
    };
    quantity: number;
    variantSku: string;
}
interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  variantSku: string;
}
export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest("hex");

    if (expected !== signature) {
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

    const alreadyExists = await Order.findOne({ checkoutToken }).lean();
    if (alreadyExists) {
        return NextResponse.json({ received: true });
    }

    const cart = await Cart.findOne({ userId: userObjectId })
        .populate("items.productId");

    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ received: true });
    }

    const address = await Address.findOne({
        userId: userObjectId,
        isDefault: true,
    });

    if (!address) {
        return NextResponse.json({ received: true });
    }

    const items: OrderItem[] = cart.items.map((item: CartItemPopulated) => ({
        productId: item.productId._id,
        name: item.productId.productName,
        price: item.productId.pricing.price,
        quantity: item.quantity,
        variantSku: item.variantSku,
    }));

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


    const shipping = subtotal >= 999 ? 0 : 50;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + shipping + tax;

    await Order.create({
        userId: userObjectId,
        checkoutToken,
        razorpay: {
            orderId: payment.order_id,
            paymentId: payment.id,
            signature,
        },
        items,
        address,
        summary: {
            subtotal,
            shipping,
            tax,
            discount: 0,
            totalAmount,
        },
        status: "paid",
    });

    await Cart.deleteOne({ userId: userObjectId });

    return NextResponse.json({ success: true });
}
