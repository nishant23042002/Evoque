import { requireAuth } from "@/lib/reqiureAuth";
import User from "@/models/User";

export async function GET(req: Request) {
    const userId = requireAuth(req);
    const user = await User.findById(userId);

    return Response.json({
        user: {
            id: user._id,
            phone: user.phone,
        },
    });
}
