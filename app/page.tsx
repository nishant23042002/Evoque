import Container from "@/components/Container";
import MasonryGrid from "@/components/Main/MasonryGrid";
import FeaturedCategories from "@/components/Main/FeaturedCategory";
import BannerSlider from "@/components/Main/Banner";

const topBanners = [
  "/images/banner.png",
  "/images/banner2.png",
];

const bottomBanners = [
  "/images/banner3.png",
  "/images/banner4.png",
];

const Home = () => {
  return (
    <Container className="bg-white">
      <div className="max-[768px]:ml-12 ml-15 gap-5 px-2">
        {/* Banner */}
        <BannerSlider banners={topBanners} />

        <FeaturedCategories />

        <BannerSlider banners={bottomBanners} />

        <MasonryGrid />

      </div>
    </Container>
  )
}

export default Home;