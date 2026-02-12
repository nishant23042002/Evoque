import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/reqiureAuth";
import { Types } from "mongoose";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ variantSku: string }> }
) {
    try {
        const { variantSku } = await context.params;
        const { userId } = await requireAuth();
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

        const { userId } = await requireAuth();
        await connectDB();

        const userObjectId = new Types.ObjectId(userId);

        const result = await Cart.updateOne(
            {
                userId: userObjectId,
                "items.variantSku": variantSku,
            },
            {
                $set: { "items.$.quantity": quantity },
            }
        );

        return NextResponse.json({ success: true, result });
    } catch (err) {
        console.error("PATCH ERROR:", err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
