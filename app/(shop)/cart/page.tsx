import { Metadata } from "next";
import CartPage from "./CartPage";

export const metadata: Metadata = {
  title: "Shopping Bag | The Layer Co.",
  description: "Your saved items at THE LAYER Co.",
};

export default function Page() {
  return <CartPage />;
}