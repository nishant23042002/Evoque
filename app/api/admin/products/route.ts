import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();
  const products = await Product.find({ isDeleted: false }).lean();

  return NextResponse.json(products);
}