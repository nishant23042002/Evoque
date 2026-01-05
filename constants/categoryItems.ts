export interface CategoryCircle {
  id: string;
  label: string;
  image: string;
  slug: string; // sub-category slug
}

/* SHIRTS */
export const shirtsCategories: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-shirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain.png", slug: "plain" },
  { id: "designer", label: "Designer", image: "/images/designer.png", slug: "designer" },
  { id: "linen", label: "Linen", image: "/images/linen.png", slug: "linen" },
  { id: "checks", label: "Checks", image: "/images/checks.png", slug: "checks" },
  { id: "half-sleeves", label: "Half-Sleeves", image: "/images/half-sleeves.png", slug: "half-sleeves" },
];

/* JEANS */
export const jeansCategories: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-bottoms.webp", slug: "" },
  { id: "slim", label: "Slim", image: "/images/slim-fit-jeans.jpg", slug: "slim" },
  { id: "regular-fit", label: "Regular Fit", image: "/images/regular-fit-jeans.webp", slug: "regular-fit" },
  { id: "baggy-fit", label: "Baggy Fit", image: "/images/baggy-fit-jeans.jpg", slug: "baggy-fit" },
  { id: "straight", label: "Straight", image: "/images/straight-fit-jeans.jpg", slug: "straight" },
];

/* TROUSERS */
export const trousersCategories: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-bottoms.webp", slug: "" },
  { id: "formal", label: "Formal", image: "/images/formal.webp", slug: "formal" },
  { id: "casual", label: "Casual", image: "/images/casual.webp", slug: "casual" },
  { id: "chinos", label: "Chinos", image: "/images/chinos.webp", slug: "chinos" },
  { id: "cargo", label: "Cargo", image: "/images/cargo.webp", slug: "cargo" },
];

/* T-SHIRTS */
export const tshirtsCategories: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "solid", label: "Solid", image: "/images/solid.png", slug: "solid" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.png", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.png", slug: "polo" },
  { id: "sleeveless", label: "Sleeveless", image: "/images/sleeveless.png", slug: "sleeveless" },
];
export const hoodies: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];
export const sweaters: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];
export const essentials: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];
export const jackets: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];
export const newarrivals: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];
export const limitedDrops: CategoryCircle[] = [
  { id: "all", label: "View All", image: "/images/all-tshirts.webp", slug: "" },
  { id: "plain", label: "Plain", image: "/images/plain-tshirt.webp", slug: "plain" },
  { id: "oversized", label: "Oversized", image: "/images/oversized.webp", slug: "oversized" },
  { id: "polo", label: "Polo", image: "/images/polo.webp", slug: "polo" },
  { id: "half-sleeve", label: "Half Sleeve", image: "/images/half-sleeves.webp", slug: "half-sleeve" },
];

/* CATEGORY MAP */
export const categoryMap: Record<
  string,
  { title: string; items: CategoryCircle[] }
> = {
  "shirts": { title: "ALL SHIRTS", items: shirtsCategories },
  "jeans": { title: "ALL JEANS", items: jeansCategories },
  "trousers": { title: "ALL TROUSERS", items: trousersCategories },
  "t-shirts": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "hoodies": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "sweaters": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "essentials": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "jackets": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "new-arrivals": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "limited-drops": { title: "ALL T-SHIRTS", items: tshirtsCategories },
  "footwear": { title: "ALL T-SHIRTS", items: tshirtsCategories }
};
