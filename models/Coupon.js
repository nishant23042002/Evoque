// models/Coupon.ts

import mongoose from "mongoose";


const CouponSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true, required: true },
        description: String,

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },

        discountValue: { type: Number, required: true },

        minOrderAmount: Number,
        maxDiscountAmount: Number,

        usageLimit: Number,
        usedCount: { type: Number, default: 0 },

        perUserLimit: Number,

        isActive: { type: Boolean, default: true },

        validFrom: Date,
        validUntil: Date,

        isNewUserOnly: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Coupon ||
    mongoose.model("Coupon", CouponSchema);