import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
    {
        slug: String,
        hex: String,
    },
    { _id: false }
);

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String, required: true
        },

        brand: {
            type: String, required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        images: {
            type: [String],
            required: true,
        },

        price: {
            type: Number, required: true
        },

        originalPrice: {
            type: Number
        },

        rating: {
            type: Number, default: 0
        },

        sizes: {
            type: [String],
            default: [],
        },

        colors: {
            type: [colorSchema],
            default: [],
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },

        stock: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            default: ""
        },

        tags: [String],
    },
    { timestamps: true }
);


export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);