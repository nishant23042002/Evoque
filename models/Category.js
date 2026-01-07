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

        image: {
            type: String, // banner / hero image
        },

        subCategories: {
            type: [subCategorySchema],
            default: [],
        },

        isFeatured: {
            type: Boolean,
            default: true,
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
