import CategoryCircles from "@/components/Category"
import { jeansCategories } from "@/constants/categoryItems"

const Jeans = () => {
    return (
        <div className="max-[490px]:ml-16 ml-19 mr-1">
            <CategoryCircles
                title="ALL JEANS"
                categories={jeansCategories}
            />
        </div>
    )
}

export default Jeans