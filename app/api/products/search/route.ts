import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { ProductSearchFilters } from "@/models/Product.filters";


function parseIntent(query: string): ProductSearchFilters {
    const filters: ProductSearchFilters = {};
    const q = query.toLowerCase();

    // price: "under 1500"
    const priceMatch = q.match(/under\s?₹?(\d+)/);
    if (priceMatch) {
        filters["pricing.price"] = { $lte: Number(priceMatch[1]) };
    }

    // fabric
    if (q.includes("cotton")) filters["attributes.fabric"] = "cotton";
    if (q.includes("linen")) filters["attributes.fabric"] = "linen";
    if (q.includes("denim")) filters["attributes.fabric"] = "denim";

    // fit
    if (q.includes("slim")) filters["attributes.fitType"] = "slim";
    if (q.includes("regular")) filters["attributes.fitType"] = "regular";
    if (q.includes("oversized")) filters["attributes.fitType"] = "oversized";

    return filters;
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    

    if (!query.trim()) {
        return NextResponse.json({ products: [] });
    }

    await connectDB();

    const intentFilters = parseIntent(query);

    const products = await Product.find(
        {
            $text: { $search: query },
            isActive: true,
            ...intentFilters,
        },
        {
            score: { $meta: "textScore" },
        }
    )
        .sort({
            score: { $meta: "textScore" },
            "search.popularityScore": -1,
            "merchandising.priority": -1,
            isBestSeller: -1,
            isNewArrival: -1,
        })
        .lean();

    return NextResponse.json({
        products,
    });
}
