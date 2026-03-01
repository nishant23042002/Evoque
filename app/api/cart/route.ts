// /api/cart/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { requireAuth } from "@/lib/reqiureAuth";
import { Types } from "mongoose";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";


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

interface CartDoc {
  userId: Types.ObjectId;
  items: PopulatedCartItem[];
}

export async function GET() {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = auth;
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
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = auth;
    await connectDB();

    const item = await req.json();
    if (!item?.variantSku || !item?.size) {
      return NextResponse.json(
        { message: "Invalid payload" },
        { status: 400 }
      );
    }
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(item.productId);
    const requestedQty = Math.max(1, Number(item.quantity) || 1);

    /* ===============================
      🔎 1️⃣ VALIDATE PRODUCT + VARIANT
   ================================ */

    const product = await Product.findOne({
      _id: productObjectId,
      isActive: true,
      isDeleted: false,
      "variants.sizes.variantSku": item.variantSku,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product or variant not found" },
        { status: 404 }
      );
    }

    // 🔥 Strong typing derived from product
    type VariantDoc = (typeof product.variants)[number];
    type SizeDoc = VariantDoc["sizes"][number];

    const variant: VariantDoc | undefined =
      product.variants.find((v: VariantDoc) =>
        v.sizes.some(
          (s: SizeDoc) => s.variantSku === item.variantSku
        )
      );

    if (!variant) {
      return NextResponse.json(
        { message: "Variant not found" },
        { status: 404 }
      );
    }

    const size: SizeDoc | undefined =
      variant.sizes.find(
        (s: SizeDoc) => s.variantSku === item.variantSku
      );

    if (!size) {
      return NextResponse.json(
        { message: "Size not found" },
        { status: 404 }
      );
    }

    /* ===============================
       📦 2️⃣ CHECK EXISTING CART QTY
    ================================ */

    const existingCart = await Cart.findOne({
      userId: userObjectId,
      "items.variantSku": item.variantSku,
    }).lean<CartDoc | null>();
    
    let existingQty = 0;

    if (existingCart) {
      const existingItem = existingCart.items.find(
        i => i.variantSku === item.variantSku
      );
      existingQty = existingItem?.quantity ?? 0;
    }

    if (existingQty + requestedQty > size.stock) {
      return NextResponse.json(
        {
          message: `Only ${size.stock} items available in stock`,
        },
        { status: 409 }
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
        { userId: userObjectId },
        {
          $push: {
            items: {
              productId: productObjectId,
              variantSku: item.variantSku,
              quantity: requestedQty,
              image: item.image,
              size: item.size,
              color: item.color,
            },
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    });
  } catch (err) {
    console.error("CART POST ERROR:", err);
    return NextResponse.json(
      { message: "Failed to update cart" },
      { status: 500 }
    );
  }
}
