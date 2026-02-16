// /api/cart/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/reqiureAuth";
import { Types } from "mongoose";
import Wishlist from "@/models/Wishlist";


interface PopulatedProduct {
  _id: Types.ObjectId;
  productName: string;
  slug: string;
  brand: string;
  thumbnail?: string;
  image: string;
  pricing: {
    price: number;
    originalPrice?: number;
  };
}

interface PopulatedCartItem {
  productId: PopulatedProduct;
  quantity: number;
  size: string;
  variantSku: string;
  image: string;
  color: {
    name: string;
    slug: string;
  };
}

interface PopulatedCart {
  items: PopulatedCartItem[];
}



export async function GET() {
  try {
    const { userId } = await requireAuth();
    await connectDB();

    const userObjectId = new Types.ObjectId(userId);

    const cart = await Cart.findOne({ userId: userObjectId })
      .populate("items.productId")
      .lean<PopulatedCart | null>();

    if (!cart) return NextResponse.json([]);

    return NextResponse.json(
      cart.items.map(item => ({
        productId: item.productId._id.toString(),
        name: item.productId.productName,
        slug: item.productId.slug,
        image: item.image,
        price: item.productId.pricing.price,
        originalPrice: item.productId.pricing.originalPrice ?? 0,
        brand: item.productId.brand,
        quantity: item.quantity,
        size: item.size,
        variantSku: item.variantSku,
        color: item.color,
      }))
    );
  } catch {
    return NextResponse.json([], { status: 401 });
  }
}



export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth();
    await connectDB();

    const item = await req.json();
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(item.productId);

    if (!item?.variantSku || !item?.size) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }

    // 1️⃣ Remove from wishlist (correct)
    await Wishlist.updateOne(
      { userId: userObjectId },
      { $pull: { items: { productId: productObjectId } } }
    );

    // 2️⃣ ATOMIC UPSERT CART ITEM
    const result = await Cart.updateOne(
      {
        userId: userObjectId,
        "items.variantSku": item.variantSku,
      },
      {
        $inc: { "items.$.quantity": item.quantity ?? 1 },
        $set: {
          "items.$.size": item.size,
          "items.$.color": item.color,
          "items.$.image": item.image,
        },
      },
      { upsert: false }
    );

    // variant not found → push new
    if (result.matchedCount === 0) {
      await Cart.updateOne(
        { userId },
        {
          $push: {
            items: {
              productId: item.productId,
              variantSku: item.variantSku,
              quantity: item.quantity ?? 1,
              image: item.image,
              size: item.size,
              color: item.color,
            },
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error("CART POST ERROR:", err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
