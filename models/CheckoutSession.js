import mongoose from "mongoose";

const checkoutSessionSchema = new mongoose.Schema(
    {
        checkoutToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        items: { type: Array, required: true },

        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true },
        shippingFee: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        grandTotal: { type: Number, required: true },

        coupon: {
            code: String,
            discountType: String,
            discountValue: Number,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.CheckoutSession ||
    mongoose.model("CheckoutSession", checkoutSessionSchema);