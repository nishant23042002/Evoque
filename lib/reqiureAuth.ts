import { getAuthToken } from "./getAuthToken";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function requireAuth() {
    try {
        const token = await getAuthToken(); // 🔥 FIX HERE
        if (!token) return null;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        if (
            typeof decoded !== "object" ||
            !decoded ||
            !("userId" in decoded)
        ) {
            return null;
        }

        return decoded as JwtPayload & { userId: string; role: string };
    } catch {
        return null;
    }
}