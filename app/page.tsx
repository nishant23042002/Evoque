import Container from "@/components/Container";
import MasonryGrid from "@/components/Main/MasonryGrid";
import { clothingItems } from "@/data/clothingItems";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";

const Home = () => {
  return (
    <Container className="bg-white">
      <div className="max-[768px]:ml-12 ml-15 gap-5 px-2">
        {/* Banner */}
        <BannerSlider />

        <FeaturedCategories />

        <MasonryGrid />

      </div>
    </Container>
  )
}

export default Home;