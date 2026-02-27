"use client"

import { useState } from "react"

interface Props {
    folder: string
    onUpload: (data: {
        url: string
        publicId: string
    }) => void
}

export default function CloudinaryUploader({ folder, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files
        if (!files) return

        setUploading(true)

        try {
            // 1️⃣ Get signature
            const signRes = await fetch(
                "/api/admin/cloudinary-signature",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder }),
                }
            )

            const signData = await signRes.json()

            // 2️⃣ Upload all selected files
            for (const file of Array.from(files)) {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("api_key", signData.apiKey)
                formData.append("timestamp", signData.timestamp)
                formData.append("signature", signData.signature)
                formData.append("folder", folder)

                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                )

                const uploadData = await uploadRes.json()

                onUpload({
                    url: uploadData.secure_url,
                    publicId: uploadData.public_id,
                })
            }
        } catch (err) {
            console.error(err)
            alert("Upload failed")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                multiple   // ✅ THIS IS IMPORTANT
                onChange={handleUpload}
            />
            {uploading && <p>Uploading...</p>}
        </div>
    )
}