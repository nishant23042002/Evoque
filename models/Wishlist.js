import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    },
    { _id: false }
);

const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: {
            type: [wishlistItemSchema],
            default: []
        }
    },
    { timestamps: true }
);

export default mongoose.models.Wishlist ||
    mongoose.model("Wishlist", wishlistSchema);
