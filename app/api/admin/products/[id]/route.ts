import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

function extractPublicId(url: string) {
    try {
        const parts = url.split("/");
        const fileWithExtension = parts[parts.length - 1];
        return fileWithExtension.split(".")[0];
    } catch {
        return null;
    }
}

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
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid ID" },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(req.url);
        const hardDelete = searchParams.get("hard") === "true";

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // ================= SOFT DELETE =================
        if (!hardDelete) {
            product.isDeleted = true;
            product.isActive = false;
            await product.save();

            return NextResponse.json({
                message: "Product soft deleted",
            });
        }

        // ================= HARD DELETE =================

        // 🔥 Delete thumbnail (if stored with publicId extract logic)
        if (product.thumbnail) {
            const publicId = extractPublicId(product.thumbnail);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // 🔥 Delete variant images
        for (const variant of product.variants) {
            for (const image of variant.color.images) {
                if (image.publicId) {
                    await cloudinary.uploader.destroy(image.publicId);
                }
            }
        }

        await product.deleteOne();

        return NextResponse.json({
            message: "Product permanently deleted",
        });

    } catch (error) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}