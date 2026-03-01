// /api/auth/me/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/reqiureAuth";
export const dynamic = "force-dynamic";

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

        const user = await User.findById(userId).select("_id phone role");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Auth /me error:", error);

        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
