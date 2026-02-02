import mongoose from "mongoose";


/* ---------------- SUB CATEGORY ---------------- */

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Plain, Slim, Baggy Fit
            trim: true,
        },
        slug: {
            type: String,
            required: true, // plain, slim, baggy-fit
            lowercase: true,
        },

        image: {
            type: String, // circle image
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        badge: {
            type: String, // "New", "Trending", "Best Seller"
        },

        description: {
            type: String, // short marketing copy
        },

        attributes: {
            pattern: String,   // plain / printed
            fit: String,       // slim / regular
            fabric: String,    // cotton / linen
            sleeve: String,    // full / half
        },

        priority: {
            type: Number,
            default: 0, // UI ordering
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

/* ---------------- MAIN CATEGORY ---------------- */

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Shirts, Jeans
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true, // shirts, jeans
            lowercase: true,
            unique: true,
            index: true,
        },

        sizeType: {
            type: { type: String },
            label: { type: String },
            chartImage: { type: String },
            order: { type: Number, default: 0 }
        },

        image: {
            type: String, // banner / hero image
        },

        leftMenuCategoryImage: {
            type: String, // specific image for sidemenu were different categories are mapping 
        },

        categoryPageBanner: {
            type: String
        },

        subCategories: {
            type: [subCategorySchema],
            default: [],
        },

        description: {
            type: String,
        },

        merchandising: {
            priority: { type: Number, default: 0 },
            collection: String, // "summer-edit"
        },

        seo: {
            title: String,
            description: String,
            keywords: [String],
        },

        isFeatured: {
            type: Boolean,
            default: true,
        },

        isTrending: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Category ||
    mongoose.model("Category", categorySchema);
