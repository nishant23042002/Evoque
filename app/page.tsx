import Container from "@/components/Container";
import MasonryGrid from "@/components/MasonryGrid";
import { clothingItems } from "@/data/clothingItems";
import Image from "next/image";

const Home = () => {
  return (
    <Container className="bg-brand">
      <div className="max-[490px]:ml-15 ml-18 gap-5 p-2">
        {/* Banner */}
        <div className="relative w-full max-md:h-50 h-75 aspect-5/1 mb-6">
          <Image
            src="/banner.webp"
            alt="banner"
            fill
            priority
            className="rounded-xl max-md:object-fill object-cover"
          />
        </div>
        <MasonryGrid items={clothingItems} />
      </div>
    </Container>
  )
}

export default Home;