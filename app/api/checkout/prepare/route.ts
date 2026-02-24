// /api/products/checkout/prepare/route.ts

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import crypto from "crypto";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import connectDB from "@/lib/db";
import { requireAuth } from "@/lib/reqiureAuth";
import Cart from "@/models/Cart";
import Address from "@/models/Address";
import CheckoutSession from "@/models/CheckoutSession";


interface PopulatedProduct {
    _id: Types.ObjectId;
    productName: string;
    thumbnail?: string;
    isAvailable: boolean;
    slug: string
    pricing: {
        price: number;
    };
}
interface PopulatedCartItem {
    productId: PopulatedProduct;
    quantity: number;
    variantSku: string;
    size: string;
    color: {
        name: string;
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await requireAuth();
        await connectDB();

        const body = await req.json();
        const couponCode = body?.couponCode?.toUpperCase()?.trim();
        console.log(couponCode);

        const userObjectId = new Types.ObjectId(userId);

        // 1️⃣ Fetch cart
        const cart = await Cart.findOne({ userId: userObjectId })
            .populate("items.productId")
            .lean<{ items: PopulatedCartItem[] }>();

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 }
            );
        }

        // 2️⃣ Fetch default address
        const addressId = body?.addressId;

        if (!addressId) {
            return NextResponse.json(
                { message: "Address is required" },
                { status: 400 }
            );
        }

        const address = await Address.findOne({
            _id: addressId,
            userId: userObjectId,
        }).lean();

        if (!address) {
            return NextResponse.json(
                { message: "Invalid address selected" },
                { status: 400 }
            );
        }


        
        let subtotal = 0;
        const checkoutItems = [];

        // 2️⃣ Recalculate prices & validate products
        for (const item of cart.items) {
            const product = item.productId;
            console.log("PRODUCT:", item.productId);

            if (!product || !product.isAvailable) {
                return NextResponse.json(
                    { message: "One or more products are unavailable" },
                    { status: 409 }
                );
            }

            const price = product.pricing.price;
            subtotal += price * item.quantity;

            checkoutItems.push({
                productId: product._id.toString(),
                name: product.productName,
                slug: product.slug,
                size: item.size,
                color: item.color?.name ?? "",
                variantSku: item.variantSku,
                quantity: item.quantity,
                price,
                image: product.thumbnail ?? "",
            });
        }

        //Detect first purchase of the user
        const paidOrders = await Order.countDocuments({
            userId: userObjectId,
            status: "paid",
        })
        const isFirstPurchase = paidOrders === 0;

        //coupon logic
        let coupon = null;
        let discount = 0;

        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
            })
        } else if (isFirstPurchase) {
            coupon = await Coupon.findOne({
                isNewUserOnly: true,
                isActive: true,
            })
        }

        if (coupon) {
            //expiry check
            if (coupon.validUntil && coupon.validUntil < new Date()) {
                return NextResponse.json({ message: "Coupon Expired" }, { status: 400 })
            }

            //usage limit check
            if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                return NextResponse.json({ message: "Coupon usage limit exceeded" }, { status: 400 })
            }

            //new user only check
            if (coupon.isNewUserOnly && !isFirstPurchase) {
                return NextResponse.json({ message: "Coupon valid for new users only" }, { status: 400 })
            }

            //minimum order check
            if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
                return NextResponse.json({ message: "Minimum order amount not met" }, { status: 400 })
            }

            //calculate discount
            if (coupon.discountType === "percentage") {
                discount = (subtotal * coupon.discountValue) / 100;

                if (coupon.maxDiscountAmount) {
                    discount = Math.min(discount, coupon.maxDiscountAmount);
                }
            } else {
                discount = coupon.discountValue;
            }
        }

        // 3️⃣ Pricing rules (can evolve later)
        const shipping = subtotal >= 999 ? 0 : 100;
        const tax = Math.round(subtotal * 0.05); // 5% GST example

        const totalAmount = subtotal - discount + shipping + tax;
        // 4️⃣ Create price hash (anti-tamper)
        const priceHash = crypto
            .createHash("sha256")
            .update(`${userId}:${totalAmount}:${Date.now()}`)
            .digest("hex");

        const checkoutToken = crypto.randomUUID();

        await CheckoutSession.deleteMany({
            userId: userObjectId,
            expiresAt: { $lt: new Date() }
        });

        // 7️⃣ Save checkout snapshot
        await CheckoutSession.create({
            checkoutToken,
            userId: userObjectId,
            items: checkoutItems,
            subtotal,
            tax,
            shippingFee: shipping,
            discountAmount: discount,
            grandTotal: totalAmount,
            coupon: coupon
                ? {
                    code: coupon.code,
                    discountType: coupon.discountType,
                    discountValue: coupon.discountValue,
                }
                : null,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        });



        // 5️⃣ Return checkout snapshot
        return NextResponse.json({
            items: checkoutItems,
            address,
            summary: {
                subtotal,
                shipping,
                tax,
                discount,
                totalAmount,
            },
            priceHash,
            checkoutToken,
        });
    } catch (err) {
        console.error("CHECKOUT PREPARE ERROR:", err);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
