import Container from "@/components/Container";
import MasonryGrid from "@/components/MasonryGrid";
import { clothingItems } from "@/data/clothingItems";

const Home = () => {
  return (
    <Container className="bg-brand">
      <div className="ml-20 gap-5 p-4">
        <MasonryGrid items={clothingItems} />
      </div>
    </Container>
  )
}

export default Home;