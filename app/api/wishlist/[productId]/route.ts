import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Wishlist from "@/models/Wishlist";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await context.params;
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
        const productObjectId = new Types.ObjectId(productId);

        await Wishlist.updateOne(
            { userId: userObjectId },
            {
                $pull: {
                    items: { productId: productObjectId }
                }
            }
        );

        const wishlist = await Wishlist.findOne({ userId: userObjectId });

        if (wishlist && wishlist.items.length === 0) {
            await Wishlist.deleteOne({ userId: userObjectId });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Wishlist DELETE error:", error);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
