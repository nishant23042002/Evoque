import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      value: "upi",
      label: "UPI",
      img: "/images/upi-icon.svg",
      provider: "razorpay",
    },
    {
      value: "card",
      label: "Card",
      img: "/images/visa-icon.svg",
      provider: "razorpay",
    },
    {
      value: "netbanking",
      label: "Net Banking",
      img: "/images/net-banking-icon.svg",
      provider: "razorpay",
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      img: "/images/cod.svg",
      provider: "offline",
    },
  ]);
}
