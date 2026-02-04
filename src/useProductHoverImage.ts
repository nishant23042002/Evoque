import { useRef, useState } from "react";
import { Variant } from "@/types/ProductTypes";

export function useProductHoverImage() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [hoverVariants, setHoverVariants] = useState<Record<string, Variant>>({});
    const [transitioning, setTransitioning] = useState<string | null>(null);

    const hoverTimeoutRef = useRef<Record<string, NodeJS.Timeout | null>>({});

    const onCardEnter = (productId: string) => {
        setHoveredCard(productId);
    };

    const onCardLeave = (productId: string) => {
        setHoveredCard(null);
        clearVariant(productId);
    };

    const onVariantHover = (productId: string, variant?: Variant) => {
        if (hoverTimeoutRef.current[productId]) {
            clearTimeout(hoverTimeoutRef.current[productId]!);
        }

        setTransitioning(productId);

        hoverTimeoutRef.current[productId] = setTimeout(() => {
            setHoverVariants(prev => {
                if (!variant) {
                    const { [productId]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [productId]: variant };
            });

            setTransitioning(null);
        }, 120);
    };

    const clearVariant = (productId: string) => {
        setHoverVariants(prev => {
            const { [productId]: _, ...rest } = prev;
            return rest;
        });
    };

    return {
        hoveredCard,
        hoverVariants,
        transitioning,
        onCardEnter,
        onCardLeave,
        onVariantHover,
    };
}
