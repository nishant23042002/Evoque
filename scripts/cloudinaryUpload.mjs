import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";

dotenv.config();

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Recursively upload folder & preserve structure in Cloudinary
 */
async function uploadFolder(localFolderPath, cloudinaryBaseFolder) {
    try {
        const files = await fs.readdir(localFolderPath);

        for (const file of files) {
            const fullPath = path.join(localFolderPath, file);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                await uploadFolder(
                    fullPath,
                    `${cloudinaryBaseFolder}/${file}`
                );
            } else {
                const ext = path.extname(file).toLowerCase();

                if (!IMAGE_EXTENSIONS.includes(ext)) {
                    console.log("⏭ Skipping:", file);
                    continue;
                }

                try {
                    console.log("⬆ Uploading:", fullPath);

                    const result = await cloudinary.uploader.upload(fullPath, {
                        folder: cloudinaryBaseFolder,
                        resource_type: "image",
                    });

                    console.log("✅ Uploaded:", result.secure_url);
                } catch (uploadErr) {
                    console.error("❌ Upload failed:", fullPath);
                    console.error(uploadErr.message);
                }
            }
        }
    } catch (err) {
        console.error("❌ Folder read failed:", localFolderPath);
        console.error(err.message);
    }
}

(async () => {
    try {
        const localBaseDir = path.join(
            process.cwd(),
            "public/category-images"
        );

        const cloudinaryBaseFolder = "evoque/category-images";

        await uploadFolder(localBaseDir, cloudinaryBaseFolder);

        console.log("🎉 Upload complete");
    } catch (err) {
        console.error("🔥 Fatal error:", err.message);
    }
})();
