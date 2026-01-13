import { NextResponse } from "next/server";
import Banners from "@/models/Banners";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const RESPONSIVE_WIDTHS = [
    600, 700, 800, 1000, 1200,
    1400, 1600, 1800, 2000,
    2200, 2400, 2600, 2800, 3000
];

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const { title, desktopImage, mobileImage, redirectUrl, order, startDate, endDate, isActive } = body;

        // Basic validation
        if (!desktopImage || !mobileImage || !redirectUrl) {
            return NextResponse.json(
                { message: "desktopImage, mobileImage and redirectUrl are required" },
                { status: 400 }
            );
        }

        // Upload original desktop and mobile images to Cloudinary
        const uploadedDesktop = await cloudinary.uploader.upload(desktopImage, {
            folder: `thelayerco./banners/${title}/desktop`,
        });

        const uploadedMobile = await cloudinary.uploader.upload(mobileImage, {
            folder: `thelayerco./banners/${title}/mobile`,
        });


        // Generate responsive versions for desktop
        const desktopImages = RESPONSIVE_WIDTHS.map((width) => ({
            width,
            format: "webp",
            url: cloudinary.url(uploadedDesktop.public_id, {
                width,
                crop: "scale",
                format: "webp",
                quality: "auto",
            }),
        }));

        // Generate responsive versions for mobile
        const mobileImages = RESPONSIVE_WIDTHS.map((width) => ({
            width,
            format: "webp",
            url: cloudinary.url(uploadedMobile.public_id, {
                width,
                crop: "scale",
                format: "webp",
                quality: "auto",
            }),
        }));

        // Save banner
        const banner = await Banners.create({
            title,
            desktopImages,
            mobileImages,
            redirectUrl,
            order,
            startDate,
            endDate,
            isActive,
        });

        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create banner", error },
            { status: 500 }
        );
    }
}


export async function GET() {
    await connectDB();

    const banners = await Banners.find({
        isActive: true,
        $or: [
            { startDate: { $lte: new Date() } },
            { startDate: null }
        ]
    })
        .sort({ order: 1 })
        .lean();

    return NextResponse.json(banners);
}
