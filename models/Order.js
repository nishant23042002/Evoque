import { Schema, model, models, Types } from "mongoose";

const OrderSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            index: true,
        },

        razorpay: {
            orderId: String,
            paymentId: String,
            signature: String,
        },

        items: [
            {
                productId: Types.ObjectId,
                name: String,
                quantity: Number,
                price: Number, // price at purchase
                variantSku: String,
                image: String,
            },
        ],

        address: {
            name: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            pincode: String,
        },

        summary: {
            subtotal: Number,
            shipping: Number,
            tax: Number,
            discount: Number,
            totalAmount: Number,
        },

        status: {
            type: String,
            enum: ["paid", "failed"],
            default: "paid",
        },
    },
    { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
