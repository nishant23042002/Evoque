import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Wishlist from "@/models/Wishlist";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function DELETE(
    _req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const { userId } = await requireAuth();
        await connectDB();

        await Wishlist.deleteOne({
            userId,
            productId: params.productId
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}
