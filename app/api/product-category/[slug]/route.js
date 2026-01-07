import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = params;

        const category = await Category.findOne({ slug });

        if (!category) {
            return NextResponse.json([], { status: 200 });
        }

        console.log(category);

        const products = await Product.find({
            category: category._id,
            isActive: true,
        })
            .populate("category", "name slug")
            .lean();

        return NextResponse.json(products);
    } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
