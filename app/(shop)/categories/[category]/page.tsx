import CategoryCircles from "@/components/CategoryCircles";
import { categoryMap } from "@/constants/categoryItems";
import { notFound } from "next/navigation";

const ProductCategoryPage = ({
    params,
}: {
    params: { category: string };
}) => {
    const categoryData = categoryMap[params.category];

    if (!categoryData) return notFound();

    return (
        <div className="max-[490px]:ml-14 ml-17 mr-1">
            <CategoryCircles
                title={categoryData.title}
                categories={categoryData.items}
                categorySlug={params.category}
            />
        </div>
    );
};

export default ProductCategoryPage;
