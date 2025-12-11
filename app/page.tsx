import Container from "@/components/Container";
import MasonryGrid from "@/components/MasonryGrid";

export const clothingItems = [
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
    brand: "Snitch",
    title: "Ice Blue Oversized Denim Jacket",
    price: "₹1,999",
    slug: "ice-blue-oversized-denim-jacket",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
    brand: "Snitch",
    title: "Charcoal Textured Sweatshirt",
    price: "₹1,299",
    slug: "charcoal-textured-sweatshirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2513-04-M38.jpg?v=1711023832&quality=80",
    brand: "Snitch",
    title: "Beige Premium Casual Shirt",
    price: "₹899",
    slug: "beige-premium-casual-shirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSW9046-0332.jpg?v=1728911677&quality=80",
    brand: "Snitch",
    title: "Navy Blue Knit Sweater",
    price: "₹1,099",
    slug: "navy-blue-knit-sweater",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/ce2c997ea9273310240f09b985063218.jpg?v=1731388480&quality=80",
    brand: "Snitch",
    title: "Olive Green Urban Shirt",
    price: "₹1,299",
    slug: "olive-green-urban-shirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-01_1_dcd91f0d-b0e7-4056-90cf-ef60c2629af0.jpg?v=1739862125&quality=80",
    brand: "Snitch",
    title: "Black Striped Shirt",
    price: "₹999",
    slug: "black-striped-shirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e0dea322b748b1375b15445293639f1d.webp?v=1724925899&quality=80",
    brand: "Snitch",
    title: "Vintage Brown Overshirt",
    price: "₹1,699",
    slug: "vintage-brown-overshirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/BaggyTrouser1221.jpg?v=1701496796&quality=80",
    brand: "Snitch",
    title: "Baggy Wide-Leg Trouser",
    price: "₹1,399",
    slug: "baggy-wide-leg-trouser",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-05-3270.jpg?v=1701670906&quality=80",
    brand: "Snitch",
    title: "Slate Grey Slim Fit Shirt",
    price: "₹999",
    slug: "slate-grey-slim-fit-shirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-02-3218.jpg?v=1701670730&quality=80",
    brand: "Snitch",
    title: "Sky Blue Relaxed Shirt",
    price: "₹899",
    slug: "sky-blue-relaxed-shirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },

  // ---- duplicates with same slugs ----

  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
    brand: "Snitch",
    title: "Ice Blue Oversized Denim Jacket",
    price: "₹1,999",
    slug: "ice-blue-oversized-denim-jacket",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
    brand: "Snitch",
    title: "Charcoal Textured Sweatshirt",
    price: "₹1,299",
    slug: "charcoal-textured-sweatshirt",
    colors: [
      { slug: "ice-blue-oversized-denim-jacket", hex: "#5B9BD5" },
      { slug: "black-oversized-denim-jacket", hex: "#000000" },
      { slug: "white-oversized-denim-jacket", hex: "#FFFFFF" },
    ],
  },
];



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