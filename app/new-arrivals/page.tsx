import MasonryGrid from "@/components/Main/MasonryGrid"
import { clothingItems } from "@/data/clothingItems"

const NewArrivals = () => {
    return (
        <div className="max-[768px]:ml-17 ml-19 mr-2">
            <MasonryGrid items={clothingItems} />
        </div>
    )
}

export default NewArrivals