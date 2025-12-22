export interface CategoryCircle {
  id: string;
  label: string;
  image: string;
  href: string;
}

export const shirtsCategories: CategoryCircle[] = [
  {
    id: "all",
    label: "All",
    image: "/images/category-shirt.webp",
    href: "/shirts",
  },
  {
    id: "plain",
    label: "Plain",
    image: "/images/plain.webp",
    href: "/shirts/plain",
  },
  {
    id: "designer",
    label: "Designer",
    image: "/images/designer.webp",
    href: "/shirts/designer",
  },
  {
    id: "linen",
    label: "Linen",
    image: "/images/linen.webp",
    href: "/shirts/linen",
  },
  {
    id: "printed",
    label: "Printed",
    image: "/images/printed.webp",
    href: "/shirts/printed",
  },
  {
    id: "checks",
    label: "Checks",
    image: "/images/checks.webp",
    href: "/shirts/checks",
  },
];

export const jeansCategories = [
  {
    id: "all",
    label: "All",
    image: "/images/relaxed.webp",
    href: "/jeans",
  },
  {
    id: "slim",
    label: "Slim",
    image: "/images/slim.webp",
    href: "/jeans/slim",
  },
  {
    id: "regular-fit",
    label: "Regular-Fit",
    image: "/images/regular-fit.webp",
    href: "/jeans/regular-fit",
  },
  {
    id: "straight",
    label: "Straight",
    image: "/images/straight.webp",
    href: "/jeans/straight",
  },
];

export const trousersCategories = [
  {
    id: "all",
    label: "All",
    image: "/images/all-bottoms.webp",
    href: "/trousers",
  },
  {
    id: "formal",
    label: "Formal",
    image: "/images/formal.webp",
    href: "/trousers/formal",
  },
  {
    id: "casual",
    label: "Casual",
    image: "/images/casual.webp",
    href: "/trousers/casual",
  },
  {
    id: "chinos",
    label: "Chinos",
    image: "/images/chinos.webp",
    href: "/trousers/chinos",
  },
  {
    id: "cargo",
    label: "Cargo",
    image: "/images/cargo.webp",
    href: "/trousers/cargo",
  },
];

export const tshirtsCategories = [
  {
    id: "all",
    label: "All",
    image: "/images/all-tshirts.webp",
    href: "/tshirts",
  },
  {
    id: "plain",
    label: "Plain",
    image: "/images/plain-tshirt.webp",
    href: "/tshirts/plain",
  },
  {
    id: "oversized",
    label: "Oversized",
    image: "/images/oversized.webp",
    href: "/tshirts/oversized",
  },
  {
    id: "polo",
    label: "Polo",
    image: "/images/polo.webp",
    href: "/tshirts/polo",
  },
  {
    id: "half-sleeve",
    label: "Half Sleeve",
    image: "/images/half-sleeves.webp",
    href: "/tshirts/half-sleeve",
  },
];
