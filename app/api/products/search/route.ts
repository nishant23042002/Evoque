import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
        return NextResponse.json([]);
    }

    await connectDB();

    const products = await Product.aggregate([
        {
            $search: {
                index: "default",
                text: {
                    query: query,
                    path: [
                        "productName",
                        "search.keywords",
                        "search.synonyms",
                        "brand",
                        "tags",
                        "styleTags"
                    ],
                    fuzzy: {
                        maxEdits: 1,
                        prefixLength: 2
                    }
                }
            }
        },
        {
            $addFields: {
                score: { $meta: "searchScore" }
            }
        },
        {
            $sort: {
                score: -1,
                isBestSeller: -1,
                "analytics.purchases": -1
            }
        },
        { $limit: 20 }
    ]);

    return NextResponse.json(products);
}