// app/api/admin/cloudinary-signature/route.ts

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/requireAdmin"
import cloudinary from "@/lib/cloudinary"


export async function POST(req: Request) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { folder } = await req.json()

    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to generate signature" },
      { status: 500 }
    )
  }
}