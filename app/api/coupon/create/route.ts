import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const coupon = await Coupon.create({
            code: body.code.toUpperCase(),
            description: body.description || "",
            discountType: body.discountType,
            discountValue: body.discountValue,
            minOrderAmount: body.minOrderAmount,
            maxDiscountAmount: body.maxDiscountAmount,
            usageLimit: body.usageLimit,
            perUserLimit: body.perUserLimit,
            isActive: body.isActive ?? true,
            validFrom: body.validFrom,
            validUntil: body.validUntil,
            isNewUserOnly: body.isNewUserOnly ?? false,
        });

        return NextResponse.json(coupon);

    } catch (error) {
        console.error("COUPON CREATE ERROR:", error);
        return NextResponse.json(
            { message: "Failed to create coupon" },
            { status: 500 }
        );
    }
}