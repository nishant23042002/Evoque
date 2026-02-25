import { headers, cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function requireAdmin() {
    try {
        const cookieStore = await cookies();
        const tokenFromCookie = cookieStore.get("token")?.value;

        const headerList = await headers();
        const tokenFromHeader = headerList
            .get("authorization")
            ?.replace("Bearer ", "");

        const token = tokenFromHeader || tokenFromCookie;

        if (!token) return null;

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { userId: string; role: string };

        if (decoded.role !== "admin") return null;

        return decoded;

    } catch {
        return null;
    }
}