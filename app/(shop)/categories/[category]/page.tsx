import CategoryCircles from "@/components/CategoryCircles";
import { categoryMap } from "@/constants/categoryItems";
import { notFound } from "next/navigation";
import React from "react";

const ProductCategoryPage = ({
    params,
}: {
    params: Promise<{ category: string }>;
}) => {
    // ✅ unwrap async params
    const { category } = React.use(params);

    const categoryData = categoryMap[category];

    if (!categoryData) return notFound();

    return (
        <div>
            <CategoryCircles
                title={categoryData.title}
                categories={categoryData.items}
                categorySlug={category}
            />
        </div>
    );
};

export default ProductCategoryPage;
