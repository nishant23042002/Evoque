import { Metadata } from "next";
import Wishlist from "./Wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved items at THE LAYER Co.",
};

export default function Page() {
  return <Wishlist />;
}