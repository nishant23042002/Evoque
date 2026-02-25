import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as { userId: string; role: string };

  if (decoded.role !== "admin") {
    throw new Error("Forbidden");
  }

  return decoded;
}