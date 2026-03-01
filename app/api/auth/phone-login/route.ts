// /api/auth/phone-login/route.ts

import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body?.firebaseToken) {
            return NextResponse.json(
                { message: "Firebase token missing" },
                { status: 400 }
            );
        }

        const decoded = await admin
            .auth()
            .verifyIdToken(body.firebaseToken);

        if (!decoded.phone_number) throw new Error("Invalid phone")

        await connectDB();

        let user = await User.findOne({
            firebaseUid: decoded.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                phone: decoded.phone_number,
                role: "customer"
            });
        }

        user = await User.findById(user._id);

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const res = NextResponse.json({ success: true });

        res.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return res;
    } catch (error) {
        console.error("Phone login error:", error);

        return NextResponse.json(
            { message: "Authentication failed" },
            { status: 401 }
        );
    }
}
