import CategoryCircles from "@/components/Category"
import { tshirtsCategories } from "@/constants/categoryItems"


const TShirts = () => {
    return (
        <div className="max-[490px]:ml-16 ml-19 mr-1">
            <CategoryCircles
                title="ALL T-SHIRTS"
                categories={tshirtsCategories}
            />
        </div>
    )
}

export default TShirts