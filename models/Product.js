import mongoose from "mongoose";
import { type } from "os";

/* -------------------- SUB SCHEMAS -------------------- */

// ⭐ Review schema (basic – extend if needed)
const reviewSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

// 🎨 Variant schema
const variantSchema = new mongoose.Schema(
    {
        size: String,
        color: {
            slug: String,
            hex: String,
        },
        stock: { type: Number, default: 0 },
    },
    { _id: false }
);

/* -------------------- MAIN PRODUCT SCHEMA -------------------- */

const productSchema = new mongoose.Schema(
    {
        // 🔑 Identity
        productName: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        sku: { type: String, unique: true },

        // 🏷 Classification
        brand: { type: String, index: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },

        fit: String,

        // 🖼 Media
        images: [{ type: String }],


        // 🏷 Offers
        offers: [
            {
                type: {
                    type: String, // bank, festival, coupon
                },
                title: String,
            },
        ],

        // 💰 Pricing
        pricing: {
            price: { type: Number, required: true },
            originalPrice: Number,
            discountPercentage: Number,
            taxInclusive: { type: Boolean, default: true },
            currency: { type: String, default: "INR" },
        },

        // ⭐ Reviews
        rating: { type: Number, default: 0 },
        reviews: [reviewSchema],

        // 🎨 Variants & Stock
        variants: [variantSchema],
        totalStock: { type: Number, default: 0 },

        // 📄 Product Info
        description: String,
        details: {
            material: String,
            fabricWeight: String,
            stretch: String,
            washCare: [String],
            fitType: String,
            rise: String,
            closure: String,
        },

        // 🔍 SEO
        seo: {
            title: String,
            description: String,
            keywords: [String],
        },

        // 🚚 Shipping
        shipping: {
            weight: Number,
            dimensions: String,
            codAvailable: { type: Boolean, default: true },
            returnDays: { type: Number, default: 7 },
        },

        // 🏷 Tags
        tags: [String],

        // ⚙ Admin Controls
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        launchDate: Date,
    },
    { timestamps: true }
);

export default mongoose.models.Product ||
    mongoose.model("Product", productSchema);
