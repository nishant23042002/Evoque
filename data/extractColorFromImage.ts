import sharp from "sharp";

/**
 * Extract average dominant HEX color from an image buffer
 */
export async function extractHexFromBuffer(
    buffer: Buffer
): Promise<string> {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        // Safe crop (center area)
        const cropWidth = Math.min(300, metadata.width || 300);
        const cropHeight = Math.min(300, metadata.height || 300);

        const left = Math.max(
            0,
            Math.floor(((metadata.width || cropWidth) - cropWidth) / 2)
        );
        const top = Math.max(
            0,
            Math.floor(((metadata.height || cropHeight) - cropHeight) / 2)
        );

        const { data, info } = await image
            .extract({ left, top, width: cropWidth, height: cropHeight })
            .resize(40, 40, { fit: "cover" })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        let r = 0, g = 0, b = 0;
        const pixelCount = info.width * info.height;

        for (let i = 0; i < data.length; i += info.channels) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
        }

        return rgbToHex(
            Math.round(r / pixelCount),
            Math.round(g / pixelCount),
            Math.round(b / pixelCount)
        );
    } catch (err) {
        console.error("Color extraction failed:", err);
        return "#000000"; // safe fallback
    }
}

function rgbToHex(r: number, g: number, b: number) {
    return (
        "#" +
        [r, g, b]
            .map(v => v.toString(16).padStart(2, "0"))
            .join("")
    );
}
