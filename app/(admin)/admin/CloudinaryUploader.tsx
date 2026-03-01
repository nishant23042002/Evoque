"use client"

import { useEffect, useRef, useState } from "react"
import { UploadCloud, Loader2 } from "lucide-react"

interface Props {
    folder: string
    onUpload: (data: {
        url: string
        publicId: string
    }) => void
}

export default function CloudinaryUploader({ folder, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)
    const [fileNames, setFileNames] = useState<string[]>([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const preventDefault = (e: DragEvent) => e.preventDefault()
        window.addEventListener("dragover", preventDefault)
        window.addEventListener("drop", preventDefault)

        return () => {
            window.removeEventListener("dragover", preventDefault)
            window.removeEventListener("drop", preventDefault)
        }
    }, [])


    const uploadFiles = async (files: FileList) => {
        setUploading(true)
        setFileNames(Array.from(files).map(f => f.name))
        try {
            const signRes = await fetch(
                "/api/admin/cloudinary-signature",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ folder }),
                }
            )

            const signData = await signRes.json()

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
            setFileNames([])
        }
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) uploadFiles(e.target.files)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadFiles(e.dataTransfer.files)
        }
    }

    return (
        <div className="w-full space-y-3">
            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Drop Area */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
                ${dragActive ? "border-white bg-zinc-800" : "border-zinc-700 bg-zinc-900"}`}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin" size={28} />
                        <p className="text-sm text-zinc-300">
                            Uploading...
                        </p>
                    </div>
                ) : (
                    <>
                        <UploadCloud
                            size={32}
                            className="mx-auto mb-3 text-zinc-400"
                        />
                        <p className="text-sm text-zinc-300 font-medium">
                            Click or drag images here
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            PNG, JPG, WEBP
                        </p>
                    </>
                )}
            </div>

            {/* File Names */}
            {fileNames.length > 0 && (
                <div className="text-xs text-zinc-400 space-y-1">
                    {fileNames.map((name, i) => (
                        <p key={i} className="truncate">
                            {name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}