import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true,
        },

        description: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

categorySchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "category",
});
categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });


export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
