import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

type SearchStage = {
    index: string;
    compound: {
        must: object[];
        filter: object[];
    };
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q") || "";

    if (!query.trim()) {
        return NextResponse.json([]);
    }

    await connectDB();

    // 🔎 Extract price logic
    const priceRegex =
        /(under|below|less than|<=)\s?₹?\s?(\d+)/i;

    const match = query.match(priceRegex);

    let maxPrice: number | null = null;

    if (match) {
        maxPrice = parseInt(match[2]);
        query = query.replace(match[0], "").trim();
    }

    const searchStage: SearchStage = {
        index: "default",
        compound: {
            must: [],
            filter: []
        }
    };

    // Text search (original logic intact)
    if (query.length > 0) {
        searchStage.compound.must.push({
            text: {
                query,
                path: [
                    "productName",
                    "search.keywords",
                    "search.synonyms",
                    "attributes.fabric",
                    "attributes.sleeve",
                    "attributes.pattern",
                    "tags",
                    "variants.color.slug",
                    "styleTags"
                ],
                fuzzy: {
                    maxEdits: 1,
                    prefixLength: 2
                }
            }
        });
    }

    // Price filter
    if (maxPrice !== null) {
        searchStage.compound.filter.push({
            range: {
                path: "variants.pricing.price",
                lte: maxPrice
            }
        });
    }

    const products = await Product.aggregate([
        {
            $search: searchStage
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