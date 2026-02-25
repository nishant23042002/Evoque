import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import mongoose from "mongoose";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id } = await context.params;

        console.log("PATCH ID:", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const body = await req.json();

        const updated = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json(updated);

    } catch (error) {
        console.error("PATCH ERROR:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;

    await Product.findByIdAndUpdate(id, {
        isDeleted: true,
        isActive: false,
    });

    return NextResponse.json({ success: true });
}