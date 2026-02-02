// models/Order.ts
import mongoose from "mongoose";

/* ---------------- ADDRESS ---------------- */
const addressSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, default: "" },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
    },
    { _id: false }
);

/* ---------------- ORDER ITEM ---------------- */
const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        slug: { type: String, default: "" },
        image: { type: String, default: "" },
        size: { type: String, default: "" },
        color: { type: String, default: "" },
        sku: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
    },
    { _id: false }
);

/* ---------------- PAYMENT ---------------- */
const paymentInfoSchema = new mongoose.Schema(
    {
        method: { type: String, enum: ["razorpay"], required: true },
        paymentId: { type: String, required: true },
        orderId: { type: String, required: true },
        signature: { type: String, required: true },
        status: {
            type: String,
            enum: ["paid", "failed"],
            default: "paid",
        },
        paidAt: { type: Date, required: true },
    },
    { _id: false }
);

/* ---------------- MAIN ORDER ---------------- */
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        checkoutToken: {
            type: String,
            required: true,
            unique: true,
        },

        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: { type: addressSchema, required: true },
        billingAddress: { type: addressSchema, required: true },

        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true },

        paymentInfo: { type: paymentInfoSchema, required: true },

        orderStatus: {
            type: String,
            enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "confirmed",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order ||
    mongoose.model("Order", orderSchema);
