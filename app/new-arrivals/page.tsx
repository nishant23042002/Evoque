import MasonryGrid from "@/components/Main/MasonryGrid"
import { clothingItems } from "@/data/clothingItems"

const NewArrivals = () => {
    return (
        <div className="max-[490px]:ml-16 ml-19 mr-1">
            <MasonryGrid items={clothingItems} />
        </div>
    )
}

export default NewArrivals