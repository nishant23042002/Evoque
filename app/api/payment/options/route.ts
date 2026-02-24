import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      value: "upi",
      label: "UPI",
      img: "/images/upi-icon.svg",
      provider: "razorpay",
      description: "Get same-day refund after it passes our quality check. After selecting 'Complete purchase', enter your UPI ID or scan QR code to pay and view your order confirmation page."
    },
    {
      value: "card",
      label: "Card",
      img: "/images/visa-icon.svg",
      provider: "razorpay",
      description: 'Secure payment via Visa, Mastercard or RuPay. Enter your card details after selecting "Complete purchase". Refunds are processed to your original payment method.'
    },
    {
      value: "netbanking",
      label: "Net Banking",
      img: "/images/net-banking-icon.svg",
      provider: "razorpay",
      description: "Pay directly through your bank's secure portal. You will be redirected after clicking 'Complete purchase'."
    },
    {
      value: "cod",
      label: "Cash on Delivery",
      img: "/images/cod.svg",
      provider: "offline",
      description: "Pay in cash when your order is delivered. A small convenience fee may apply."
    },
  ]);
}
