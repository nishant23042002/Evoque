import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/api/wishlist")) {
        console.log("🍪 middleware cookies:", req.cookies.get("token")?.value);
    }
    return NextResponse.next();
}
