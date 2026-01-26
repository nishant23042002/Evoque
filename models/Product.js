import mongoose from "mongoose";

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
const sizeVariantSchema = new mongoose.Schema(
    {
        size: { type: String, required: true },
        variantSku: { type: String, required: true },
        stock: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
    },
    { _id: false }
);

const colorVariantSchema = new mongoose.Schema(
    {
        color: {
            name: { type: String, required: true },
            slug: { type: String, required: true },
            hex: { type: String },
            images: [
                {
                    url: { type: String, required: true },
                    publicId: String,
                    isPrimary: { type: Boolean, default: false },
                    isHover: { type: Boolean, default: false },
                    order: { type: Number, default: 0 },
                },
            ],
        },
        sizes: [sizeVariantSchema],
        pricing: {
            price: { type: Number },
            originalPrice: { type: Number },
            discountPercentage: { type: Number },
        },
        totalStock: { type: Number, default: 0 },
    },
    { _id: false }
);


/* -------------------- MAIN PRODUCT SCHEMA -------------------- */

const productSchema = new mongoose.Schema(
    {
        attributes: {
            sleeve: { type: String, index: true },       // full, half
            pattern: { type: String, index: true },      // solid, printed
            occasion: [{ type: String, index: true }],   // casual, party
            fabric: { type: String, index: true },       // cotton, linen
            fitType: { type: String, index: true },      // slim, regular
            season: [{ type: String, index: true }],     // summer, winter
        },

        // 🔑 Identity
        productName: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        sku: { type: String, unique: true },

        // 🏷 Classification
        brand: { type: String, index: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
        subCategory: {
            name: String,
            image: String,
            slug: {
                type: String,
                lowercase: true,
                index: true
            }
        },

        fit: String,
        thumbnail: {
            type: String,
            required: true,
            index: true
        },

        // 🖼 Media
        variants: [colorVariantSchema],


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

        // 🎨 Stock
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

        sizeChart: {
            image: String,
            measurements: [
                {
                    size: String,
                    chest: String,
                    length: String,
                    shoulder: String,
                    sleeve: String,
                },
            ],
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
        badges: {
            type: [
                {
                    type: { type: String },
                    label: { type: String },
                },
            ],
            default: [],
        },


        merchandising: {
            priority: { type: Number, default: 0 },
            collection: String,        // summer-drop, party-edit
            displayOrder: Number,
        },

        search: {
            keywords: [String],
            synonyms: [String],
            popularityScore: { type: Number, default: 0 },
        },

        analytics: {
            views: { type: Number, default: 0 },
            cartAdds: { type: Number, default: 0 },
            purchases: { type: Number, default: 0 },
        },

        // ⚙ Admin Controls
        isActive: { type: Boolean, default: true },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false },
        launchDate: Date,
    },
    { timestamps: true }
);

productSchema.index({
    category: 1,
    "attributes.pattern": 1,
    "attributes.fabric": 1,
    "pricing.price": 1,
});

productSchema.index({
    isActive: 1,
    isFeatured: 1,
    "merchandising.priority": -1,
});

productSchema.pre("save", function () {
    if (!this.thumbnail && this.variants?.length) {
        const primaryImage =
            this.variants
                .flatMap(v => v.color?.images || [])
                .find(img => img.isPrimary) ||
            this.variants[0]?.color?.images?.[0];

        if (primaryImage?.url) {
            this.thumbnail = primaryImage.url;
        }
    }
});


productSchema.virtual("primaryImage").get(function () {
    const img =
        this.variants
            ?.flatMap(v => v.color?.images || [])
            ?.find(i => i.isPrimary);

    return img?.url || this.thumbnail;
});

productSchema.set("toJSON", { virtuals: true });

productSchema.set("toObject", { virtuals: true });

productSchema.methods.recalculateRating = function () {
    if (!this.reviews?.length) {
        this.rating = 0;
        return;
    }
    this.rating =
        this.reviews.reduce((a, r) => a + r.rating, 0) /
        this.reviews.length;
};


export default mongoose.models.Product ||
    mongoose.model("Product", productSchema);
