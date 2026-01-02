const fs = require("fs/promises");
const path = require("path");
const cloudinary = require("./cloudinary.config.cjs");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

async function uploadFolder(folderPath) {
    try {
        const files = await fs.readdir(folderPath);

        for (const file of files) {
            const fullPath = path.join(folderPath, file);
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory()) {
                await uploadFolder(fullPath);
            } else {
                const ext = path.extname(file).toLowerCase();

                // skip non-images
                if (!IMAGE_EXTENSIONS.includes(ext)) {
                    console.log("⏭ Skipping:", file);
                    continue;
                }

                try {
                    console.log("⬆ Uploading:", fullPath);

                    const result = await cloudinary.uploader.upload(fullPath, {
                        folder: "evoque",
                        resource_type: "image",
                    });

                    console.log("✅ Uploaded:", result.secure_url);
                } catch (uploadErr) {
                    console.error("❌ Upload failed:", fullPath);
                    console.error(uploadErr); // IMPORTANT
                }
            }
        }
    } catch (err) {
        console.error("❌ Folder read failed:", folderPath);
        console.error(err);
    }
}

(async () => {
    try {
        const imagesDir = path.join(process.cwd(), "public/images");
        await uploadFolder(imagesDir);
        console.log("🎉 Upload complete");
    } catch (err) {
        console.error("🔥 Fatal error:", err);
    }
})();
