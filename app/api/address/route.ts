import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await requireAuth();
    await connectDB();

    const addresses = await Address.find({ userId }).sort({
        isDefault: -1,
        createdAt: -1,
    });

    return NextResponse.json(addresses);
}

export async function POST(req: Request) {
    const { userId } = await requireAuth();
    await connectDB();

    const body = await req.json();

    if (body.isDefault) {
        await Address.updateMany(
            { userId },
            { $set: { isDefault: false } }
        );
    }

    const address = await Address.create({
        ...body,
        userId,
    });

    return NextResponse.json(address);
}
