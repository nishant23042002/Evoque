import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { requireAuth } from "@/lib/reqiureAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        /* 1️⃣ Auth */
        const { userId } = await requireAuth();
        const userObjectId = new Types.ObjectId(userId);

        /* 2️⃣ DB */
        await connectDB();

        /* 3️⃣ Fetch orders */
        const orders = await Order.find({ userId: userObjectId })
            .sort({ createdAt: -1 }) // newest first           
            .lean();

        return NextResponse.json(orders);
    } catch (error) {
        console.error("❌ FETCH MY ORDERS ERROR:", error);
        return NextResponse.json(
            { message: "Unable to fetch orders" },
            { status: 500 }
        );
    }
}
