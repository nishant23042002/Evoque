"use client"

import Image from "next/image"
import { useProduct } from "../../ProductProvider"
import CloudinaryUploader from "@/app/(admin)/admin/CloudinaryUploader"
import { X } from "lucide-react"

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"

import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { ImageType } from "@/types/AdminProduct"
import { VariantType } from "@/types/AdminProduct"

interface Props {
    variantIndex: number
}

/* ================= SYNC THUMBNAIL ================= */

const syncThumbnail = (variants: VariantType[]) => {
    for (const variant of variants) {
        const primary = variant.color.images.find(img => img.isPrimary)
        if (primary) return primary.url
    }
    return ""
}

/* ================= SORTABLE IMAGE ================= */

function SortableImage({
    img,
    variantIndex,
}: {
    img: ImageType
    variantIndex: number
}) {
    const { setProduct } = useProduct()

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: img.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="w-28 border bg-zinc-900 p-2 rounded relative cursor-grab"
        >
            <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <Image
                    width={120}
                    height={120}
                    src={img.url}
                    className="object-cover w-full h-28 rounded"
                    alt=""
                />
            </div>

            {/* PRIMARY */}
            <label className="flex text-xs items-center gap-2 mt-2 cursor-pointer">
                <input
                    type="radio"
                    checked={img.isPrimary}
                    onChange={() => {
                        setProduct(prev => {
                            const updatedVariants = prev.variants.map((v, i) => {
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

                            return {
                                ...prev,
                                variants: updatedVariants,
                                thumbnail: syncThumbnail(updatedVariants), // 🔥 always sync
                            }
                        })
                    }}
                />
                Primary
            </label>

            {/* HOVER (ONLY ONE) */}
            <label className="flex text-xs items-center gap-2 mt-1 cursor-pointer">
                <input
                    type="checkbox"
                    checked={img.isHover}
                    onChange={() => {
                        setProduct(prev => {
                            const updatedVariants = prev.variants.map((v, i) => {
                                if (i !== variantIndex) return v

                                const updatedImages = v.color.images.map(image =>
                                    image.id === img.id
                                        ? { ...image, isHover: true }
                                        : { ...image, isHover: false }
                                )

                                return {
                                    ...v,
                                    color: { ...v.color, images: updatedImages },
                                }
                            })

                            return { ...prev, variants: updatedVariants }
                        })
                    }}
                />
                Hover
            </label>

            {/* DELETE */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setProduct(prev => {
                        const updatedVariants = prev.variants.map((v, i) => {
                            if (i !== variantIndex) return v

                            const filtered = v.color.images
                                .filter(image => image.id !== img.id)
                                .map((image, index) => ({
                                    ...image,
                                    order: index + 1,
                                    isPrimary: index === 0,
                                }))

                            return {
                                ...v,
                                color: { ...v.color, images: filtered },
                            }
                        })

                        return {
                            ...prev,
                            variants: updatedVariants,
                            thumbnail: syncThumbnail(updatedVariants), // 🔥 sync after delete
                        }
                    })
                }}
                className="absolute top-1 right-1 bg-black/70 p-1 rounded"
            >
                <X size={14} />
            </button>
        </div>
    )
}

/* ================= MAIN COMPONENT ================= */

export default function ImageUploader({ variantIndex }: Props) {
    const { product, setProduct } = useProduct()
    const variant = product.variants[variantIndex]

    const sensors = useSensors(useSensor(PointerSensor))

    return (
        <div className="space-y-6">

            {/* UPLOAD */}
            <CloudinaryUploader
                folder={`thelayerco/products/${product.categorySlug}/${product.slug}/${variant.color.slug}`}
                onUpload={({ url, publicId }) => {
                    setProduct(prev => {
                        const updatedVariants = prev.variants.map((v, i) => {
                            if (i !== variantIndex) return v

                            if (v.color.images.some(img => img.publicId === publicId))
                                return v

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
                                    images: [...v.color.images, newImage],
                                },
                            }
                        })

                        return {
                            ...prev,
                            variants: updatedVariants,
                            thumbnail: syncThumbnail(updatedVariants), // 🔥 sync after upload
                        }
                    })
                }}
            />

            {/* DRAG & DROP */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                    const { active, over } = event
                    if (!over || active.id === over.id) return

                    setProduct(prev => {
                        const updatedVariants = prev.variants.map((v, i) => {
                            if (i !== variantIndex) return v

                            const oldIndex = v.color.images.findIndex(
                                img => img.id === active.id
                            )

                            const newIndex = v.color.images.findIndex(
                                img => img.id === over.id
                            )

                            const reordered = arrayMove(
                                v.color.images,
                                oldIndex,
                                newIndex
                            ).map((img, idx) => ({
                                ...img,
                                order: idx + 1,
                            }))

                            return {
                                ...v,
                                color: { ...v.color, images: reordered },
                            }
                        })

                        return {
                            ...prev,
                            variants: updatedVariants,
                            thumbnail: syncThumbnail(updatedVariants), // 🔥 sync after drag
                        }
                    })
                }}
            >
                <SortableContext
                    items={variant.color.images.map(img => img.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="flex gap-4 flex-wrap">
                        {variant.color.images.map(img => (
                            <SortableImage
                                key={img.id}
                                img={img}
                                variantIndex={variantIndex}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}