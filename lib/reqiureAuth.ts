import jwt from "jsonwebtoken";

export function requireAuth(req: Request) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
    };

    return decoded.userId;
}
