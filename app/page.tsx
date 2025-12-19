import Container from "@/components/Container";
import MasonryGrid from "@/components/MasonryGrid";
import { clothingItems } from "@/data/clothingItems";
import FeaturedCategories from "@/components/FeaturedCategory";
import BannerSlider from "@/components/Banner";

const Home = () => {
  return (
    <Container className="bg-brand">
      <div className="max-[490px]:ml-15 ml-18 gap-5 px-2">
        {/* Banner */}
        <BannerSlider />

        <FeaturedCategories />

        <MasonryGrid items={clothingItems} />

      </div>
    </Container>
  )
}

export default Home;