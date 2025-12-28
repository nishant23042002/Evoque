import CategoryCircles from "@/components/Category"
import { shirtsCategories } from "@/constants/categoryItems"

const Shirts = () => {
    return (
        <div className="max-[490px]:ml-14 ml-17 mr-1">
            <CategoryCircles
                title="ALL SHIRTS"
                categories={shirtsCategories}
            />
        </div>
    )
}

export default Shirts