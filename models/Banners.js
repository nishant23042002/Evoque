import mongoose from "mongoose";

const BannerImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    width: { type: Number, required: true },
    format: { type: String, default: "webp" },
});

const BannerSchema = new mongoose.Schema(
    {
        title: String,
        desktopImages: [BannerImageSchema], // desktop sizes
        mobileImages: [BannerImageSchema],  // mobile sizes
        redirectUrl: String,
        order: Number,
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.Banners || mongoose.model("Banners", BannerSchema);
