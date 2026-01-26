import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function requireAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("🔐 TOKEN IN requireAuth:", token);
    if (!token) {
        throw new Error("Unauthorized");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { userId: string };

        console.log("✅ JWT DECODED:", decoded);

        return { userId: decoded.userId };
    } catch (err) {
        console.error("❌ JWT VERIFY FAILED:", err);
        throw new Error("Unauthorized");
    }
}
