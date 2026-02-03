"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

import { Variant, SizeVariant } from "@/types/ProductTypes";
import { sizeScaleMap } from "@/constants/productSizes";
import Product from "@/types/ProductTypes";


interface Props {
    open: boolean;
    product: Product;
    onClose: () => void;
    onConfirm: (payload: {
        product: Product;
        variant: Variant;
        size: SizeVariant;
        image: string;
    }) => void;
}

function inferSizeScale(activeVariant: Variant): string[] {
    const sizes = activeVariant.sizes.map(s => s.size);

    // numeric sizes → bottoms
    if (sizes.some(s => /^\d+$/.test(s))) {
        return sizeScaleMap["jeans"];
    }

    // alpha sizes → tops
    return sizeScaleMap["shirt"];
}




export default function SelectedVariantModal({
    open,
    product,
    onClose,
    onConfirm,
}: Props) {
    const [selectedColor, setSelectedColor] = useState(
        product.variants[0].color.slug
    );
    const [selectedSize, setSelectedSize] = useState<SizeVariant | null>(null);
    const [error, setError] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const effectiveColor =
        selectedColor ?? product.variants[0].color.slug;

    /* =========================
       ACTIVE VARIANT
    ========================= */
    const activeVariant = useMemo<Variant | null>(() => {
        if (!effectiveColor) return null;

        return (
            product.variants.find(v => v.color.slug === effectiveColor) ??
            product.variants[0]
        );
    }, [product, effectiveColor]);

    console.log("CATEGORY SLUG:", product.category.slug);
    console.log("AVAILABLE SIZE MAP KEYS:", Object.keys(sizeScaleMap));


    /* =========================
       IMAGE (SAFE)
    ========================= */
    const images = useMemo(() => {
        return activeVariant?.color.images ?? [];
    }, [activeVariant]);
    const primaryImageForCart =
        images.find(i => i.isPrimary)?.url ??
        images[0]?.url ??
        null;

    const image =
        activeImage ??
        images.find(i => i.isPrimary)?.url ??
        images[0]?.url ??
        null;


    /* =========================
       SIZES
    ========================= */
    const sizes = useMemo(() => {
        if (!activeVariant) return [];

        const sizeType = product.category?.sizeType?.type;

        const scale: string[] =
            sizeType && sizeScaleMap[sizeType]
                ? sizeScaleMap[sizeType]
                : inferSizeScale(activeVariant);

        const sizeMap = new Map<string, SizeVariant>(
            activeVariant.sizes.map(s => [s.size, s])
        );

        return scale.map((size: string) => {
            const variant = sizeMap.get(size);

            return {
                size,
                variant,
                exists: Boolean(variant),
                inStock: Boolean(variant && variant.stock > 0),
                isAvailable: Boolean(variant && variant.isAvailable),
            };
        });
    }, [activeVariant, product.category]);







    if (!open || !activeVariant) return null;

    /* =========================
       RENDER
    ========================= */
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative bg-white mx-4 w-full max-w-md rounded-[3px] overflow-hidden">
                {/* HEADER */}
                <div className=" flex justify-between p-3 border-b">
                    <h3 className="font-semibold">Select Variant</h3>
                    <button className="cursor-pointer" onClick={onClose}>
                        <X />
                    </button>
                </div>


                {/* IMAGE COLLAGE */}
                <div className="relative">
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 p-1 bg-gray-50">
                        {images.slice(0, 4).map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActiveImage(img.url);
                                    setPreviewImage(img.url);
                                }}
                                className={clsx(
                                    "relative aspect-square overflow-hidden rounded-[3px] border",
                                    image === img.url
                                        ? "ring-2 ring-primary border-primary"
                                        : "border-gray-200"
                                )}
                            >
                                <Image
                                    src={img.url}
                                    alt={`${product.productName}-${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* OVERLAY PREVIEW */}
                    {previewImage && (
                        <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center">

                            <div className="relative w-full h-full bg-white overflow-hidden">
                                <button
                                    onClick={() => setPreviewImage(null)}
                                    className="
                                        absolute top-3 right-3 z-30
                                        bg-black/40 text-white
                                        p-1 rounded-[3px] cursor-pointer
                                        hover:bg-black/80
                                        transition
                                    "
                                >
                                    <X size={20} />
                                </button>

                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>




                {/* CONTENT */}
                <div className="p-2 space-y-2">
                    {/* COLORS */}
                    <div className="w-full">
                        <p className="text-sm w-20">Colors: </p>
                        <div className="w-full gap-2 overflow-x-auto p-1 flex flex-nowrap">
                            {product.variants.map(v => (
                                <button
                                    key={v.color.slug}
                                    onClick={() => {
                                        setSelectedColor(v.color.slug);
                                        setSelectedSize(null);
                                        setActiveImage(null);
                                    }}
                                    className={clsx(
                                        "w-8 h-8 border rounded",
                                        v.color.slug === selectedColor &&
                                        "ring-2 ring-primary"
                                    )}
                                    style={{ backgroundColor: v.color.hex }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* SIZES */}
                    <div className="w-full">
                        <p className="text-sm w-20">Sizes: </p>
                        <div className="w-full gap-2 py-1 overflow-x-auto flex flex-nowrap">
                            {sizes.map(s => {
                                const disabled =
                                    !s.exists || !s.isAvailable || !s.inStock;

                                return (
                                    <button
                                        key={s.size}
                                        disabled={disabled}
                                        onClick={() => s.variant && setSelectedSize(s.variant)}
                                        className={clsx(
                                            "px-3 py-1 rounded-[3px] text-sm border font-bold transition",
                                            disabled
                                                ? "opacity-40 line-through cursor-not-allowed border-border"
                                                : selectedSize?.variantSku === s.variant?.variantSku
                                                    ? "bg-primary text-white border-primary"
                                                    : "border-border hover:border-primary"
                                        )}
                                    >
                                        {s.size}
                                    </button>

                                )
                            })}
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600">
                            Please select a size
                        </p>
                    )}

                    {/* ACTION */}
                    <button
                        onClick={() => {
                            if (!selectedSize || !activeVariant) {
                                setError(true);
                                return;
                            }

                            onConfirm({
                                product,
                                variant: activeVariant,
                                size: selectedSize,
                                image: primaryImageForCart!,
                            });

                            onClose();
                        }}
                        className="w-full py-2 bg-primary text-white font-semibold rounded"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
        </div>
    );
}
