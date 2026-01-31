import mongoose from "mongoose";


const CartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },

        size: {
            type: String,
            required: true,
        },

        image: {
            type: String
        },

        variantSku: {
            type: String,
            required: true,
        },

        color: {
            name: String,
            slug: String,
        },
    },
    { _id: false }
);

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },

        items: [CartItemSchema],
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Cart ||
    mongoose.model("Cart", CartSchema);
