import admin from "@/lib/firebaseAdmin";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    const { idToken } = await req.json();

    if (!idToken) {
        return Response.json({ error: "Token missing" }, { status: 401 });
    }

    // 🔐 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const firebaseUid = decoded.uid;
    const phone = decoded.phone_number;

    if (!phone) {
        return Response.json({ error: "Phone not found" }, { status: 400 });
    }
    console.log("Firebase UID:", firebaseUid);
    console.log("Phone:", phone);

    // 🔁 Find or create user
    let user = await User.findOne({ firebaseUid });

    if (!user) {
        user = await User.create({
            firebaseUid,
            phone,
        });
    }
    console.log("DB user:", user._id);


    // 🎟️ Issue backend JWT
    const appToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return Response.json({
        token: appToken,
        user: {
            id: user._id,
            phone: user.phone,
        },
    });
}
