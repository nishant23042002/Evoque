import Container from "@/components/Container";
import MasonryGrid from "@/components/MasonryGrid";

const images: string[] = [
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2513-04-M38.jpg?v=1711023832&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSW9046-0332.jpg?v=1728911677&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/ce2c997ea9273310240f09b985063218.jpg?v=1731388480&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-01_1_dcd91f0d-b0e7-4056-90cf-ef60c2629af0.jpg?v=1739862125&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e0dea322b748b1375b15445293639f1d.webp?v=1724925899&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/BaggyTrouser1221.jpg?v=1701496796&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-05-3270.jpg?v=1701670906&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-02-3218.jpg?v=1701670730&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2513-04-M38.jpg?v=1711023832&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSW9046-0332.jpg?v=1728911677&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/ce2c997ea9273310240f09b985063218.jpg?v=1731388480&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-01_1_dcd91f0d-b0e7-4056-90cf-ef60c2629af0.jpg?v=1739862125&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e0dea322b748b1375b15445293639f1d.webp?v=1724925899&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/BaggyTrouser1221.jpg?v=1701496796&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-05-3270.jpg?v=1701670906&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-02-3218.jpg?v=1701670730&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2513-04-M38.jpg?v=1711023832&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSW9046-0332.jpg?v=1728911677&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/ce2c997ea9273310240f09b985063218.jpg?v=1731388480&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-01_1_dcd91f0d-b0e7-4056-90cf-ef60c2629af0.jpg?v=1739862125&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e0dea322b748b1375b15445293639f1d.webp?v=1724925899&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/BaggyTrouser1221.jpg?v=1701496796&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-05-3270.jpg?v=1701670906&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-02-3218.jpg?v=1701670730&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/1_c529531e-2167-4fcc-a043-4746d20d871b.jpg?v=1756882310&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/65d28cd81c2eb4d2d4627ccffe3c6372.jpg?v=1735046414&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS2513-04-M38.jpg?v=1711023832&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSW9046-0332.jpg?v=1728911677&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/ce2c997ea9273310240f09b985063218.jpg?v=1731388480&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSS3955-01_1_dcd91f0d-b0e7-4056-90cf-ef60c2629af0.jpg?v=1739862125&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/e0dea322b748b1375b15445293639f1d.webp?v=1724925899&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/BaggyTrouser1221.jpg?v=1701496796&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-05-3270.jpg?v=1701670906&quality=80",
  "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4MSR5076-02-3218.jpg?v=1701670730&quality=80",
  ];

const Home = () => {
  return (
    <Container className="bg-accent-rose">
      <div className="border ml-20 border-red-600 gap-5 p-4">
        <MasonryGrid images={images} />
      </div>
    </Container>
  )
}

export default Home;