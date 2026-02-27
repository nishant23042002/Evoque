"use client"

import { ImageType } from "@/types/AdminProduct"
import { useProduct } from "../../ProductProvider"
import CloudinaryUploader from "@/app/(admin)/admin/CloudinaryUploader"
import Image from "next/image"


interface Props {
    variantIndex: number
}

export default function ImageUploader({ variantIndex }: Props) {
    const { product, setProduct } = useProduct()
    const variant = product.variants[variantIndex]

    return (
        <div className="space-y-4">
            <CloudinaryUploader
                folder={`thelayerco/products/${product.slug}/${variant.color.slug}`}
                onUpload={({ url, publicId }) => {
                    setProduct(prev => {
                        const updatedVariants = prev.variants.map((v, i) => {
                            if (i !== variantIndex) return v

                            const newImage: ImageType = {
                                id: crypto.randomUUID(),
                                url,
                                publicId,
                                isPrimary: v.color.images.length === 0,
                                isHover: false,
                                order: v.color.images.length + 1,
                            }

                            return {
                                ...v,
                                color: {
                                    ...v.color,
                                    images: [...v.color.images, newImage], // ✅ immutable
                                },
                            }
                        })

                        return { ...prev, variants: updatedVariants }
                    })
                }}
            />

            <div className="flex gap-4 flex-wrap">
                {variant.color.images.map((img: ImageType, imgIndex) => (
                    <div key={img.id} className="w-24 h-24 border relative">
                        <Image
                            width={40}
                            height={40}
                            src={img.url}
                            className="object-cover w-full h-full"
                            alt=""
                        />
                        <input
                            type="radio"
                            checked={img.isPrimary}
                            onChange={() => {
                                setProduct(prev => {
                                    const updated = prev.variants.map((v, i) => {
                                        if (i !== variantIndex) return v

                                        const updatedImages = v.color.images.map(image => ({
                                            ...image,
                                            isPrimary: image.id === img.id,
                                        }))

                                        return {
                                            ...v,
                                            color: { ...v.color, images: updatedImages },
                                        }
                                    })

                                    return { ...prev, variants: updated }
                                })
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => {
                                setProduct(prev => {
                                    const updated = prev.variants.map((v, i) => {
                                        if (i !== variantIndex) return v

                                        const filtered = v.color.images
                                            .filter((_, index) => index !== imgIndex)
                                            .map((img, index) => ({
                                                ...img,
                                                order: index + 1,
                                                isPrimary: index === 0,
                                            }))

                                        return {
                                            ...v,
                                            color: { ...v.color, images: filtered },
                                        }
                                    })

                                    return { ...prev, variants: updated }
                                })
                            }}
                            className="absolute top-1 right-1 bg-black text-white text-xs px-1"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}