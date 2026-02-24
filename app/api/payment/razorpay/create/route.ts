// /api/products/create/route.ts

import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import CheckoutSession from "@/models/CheckoutSession";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { userId } = await requireAuth();
        await connectDB();

        const { checkoutToken } = await req.json();

        const session = await CheckoutSession.findOne({ checkoutToken });

        if (!session) {
            return NextResponse.json(
                { message: "Invalid or expired checkout" },
                { status: 400 }
            );
        }

        if (session.expiresAt < new Date()) {
            return NextResponse.json(
                { message: "Checkout session expired" },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: Math.round(session.grandTotal * 100), // INR → paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
                userId,
                checkoutToken,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("RAZORPAY CREATE ERROR:", error.message);
        } else {
            console.error("RAZORPAY CREATE ERROR:", error);
        }

        return NextResponse.json(
            { message: "Payment order creation failed" },
            { status: 500 }
        );
    }
}
