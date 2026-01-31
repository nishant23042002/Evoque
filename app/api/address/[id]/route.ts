import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Address from "@/models/Address";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await requireAuth();
    await connectDB();

    const { id } = await params;
    const userObjectId = new Types.ObjectId(userId);

    const updates = await req.json();

    if (updates.isDefault) {
        await Address.updateMany(
            { userId: userObjectId },
            { $set: { isDefault: false } }
        );
    }

    const address = await Address.findOneAndUpdate(
        { _id: id, userId: userObjectId },
        updates,
        { new: true }
    );

    if (!address) {
        return NextResponse.json(
            { message: "Address not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(address);
}


export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { userId } = await requireAuth();
    const { id } = await context.params;
    await connectDB();

    await Address.deleteOne({
        _id: id,
        userId,
    });

    return NextResponse.json({ success: true });
}
