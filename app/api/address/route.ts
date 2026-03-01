import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Address from "@/models/Address";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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

        const addresses = await Address.find({ userId: userObjectId }).sort({
            isDefault: -1,
            createdAt: -1,
        });

        return NextResponse.json(addresses);
    } catch (err) {
        return NextResponse.json(
            { message: err || "Failed to fetch addresses" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth();
        if (!auth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId } = auth;
        await connectDB();

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { message: "Invalid userId" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const userObjectId = new Types.ObjectId(userId);

        // basic validation
        if (!body.name || !body.phone || !body.addressLine1) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (body.isDefault) {
            await Address.updateMany(
                { userId: userObjectId },
                { $set: { isDefault: false } }
            );
        }

        const address = await Address.create({
            name: body.name,
            phone: body.phone,
            email: body.email || "",
            addressLine1: body.addressLine1,
            addressLine2: body.addressLine2 || "",
            city: body.city,
            state: body.state,
            pincode: body.pincode,
            isDefault: body.isDefault || false,
            userId: userObjectId,
        });

        return NextResponse.json(address, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { message: err || "Failed to create address" },
            { status: 500 }
        );
    }
}
