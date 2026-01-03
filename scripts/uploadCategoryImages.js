import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import Category from "../models/Category.js";
import connectDB from "../lib/db.js";

dotenv.config();

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];


/* -------------------- UPLOAD LOGIC -------------------- */
async function uploadCategoryImages(localFolderPath) {
    await connectDB()
    const files = await fs.readdir(localFolderPath);

    for (const file of files) {
        const fullPath = path.join(localFolderPath, file);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) continue;

        const ext = path.extname(file).toLowerCase();
        if (!IMAGE_EXTENSIONS.includes(ext)) {
            console.log("⏭ Skipping:", file);
            continue;
        }

        const slug = path.basename(file, ext);

        try {
            const category = await Category.findOne({ slug });

            if (!category) {
                console.log(`⚠ Category not found for slug: ${slug}`);
                continue;
            }

            console.log(`⬆ Uploading ${file} → evoque/categories/${slug}`);

            const result = await cloudinary.uploader.upload(fullPath, {
                folder: `evoque/categories/${slug}`,
                resource_type: "image",
            });

            category.image = {
                url: result.secure_url,
                public_id: result.public_id,
            };
            await category.save();

            console.log(`✅ Updated category "${slug}"`);
        } catch (err) {
            console.error(`❌ Failed for ${file}:`, err.message);
        }
    }
}

/* -------------------- RUN SCRIPT -------------------- */
(async () => {
    try {
        await connectDB();

        const localBaseDir = path.join(
            process.cwd(),
            "public/category-images"
        );

        await uploadCategoryImages(localBaseDir);

        console.log("🎉 Category image sync complete");
        process.exit(0);
    } catch (err) {
        console.error("🔥 Fatal error:", err.message);
        process.exit(1);
    }
})();
