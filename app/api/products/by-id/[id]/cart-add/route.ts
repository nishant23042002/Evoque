import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();

    const { id } = await params;

    await Product.findByIdAndUpdate(
        id,
        { $inc: { "analytics.cartAdds": 1 } }
    );

    return NextResponse.json({ success: true });
}
