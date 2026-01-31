import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shipping & Returns Policy | The Layer Co",
    description:
        "Learn about The Layer Co’s shipping timelines, delivery process, returns, exchanges, and refund policy for men’s clothing.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function ShippingAndReturnsPage() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 text-neutral-800">
            <header className="mb-10">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Shipping & Returns Policy
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                    Last updated: 1 February 2026
                </p>
            </header>

            <section className="space-y-8 leading-relaxed text-[15px]">
                <p>
                    This Shipping & Returns Policy outlines how orders placed on{" "}
                    <strong>The Layer Co</strong> are shipped, delivered, returned, exchanged,
                    and refunded. By placing an order on our men’s clothing website, you
                    agree to the terms described below.
                </p>

                {/* SHIPPING */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        1. Shipping Information
                    </h2>

                    <h3 className="font-medium mb-2">
                        1.1 Order Processing
                    </h3>
                    <p>
                        Orders are typically processed within 1–3 business days after
                        successful payment confirmation. Orders placed on weekends or public
                        holidays are processed on the next business day.
                    </p>

                    <h3 className="font-medium mt-4 mb-2">
                        1.2 Shipping Coverage
                    </h3>
                    <p>
                        Currently,The Layer Co ships across most serviceable locations within
                        India. Delivery availability may vary based on your pin code and
                        courier partner serviceability.
                    </p>

                    <h3 className="font-medium mt-4 mb-2">
                        1.3 Estimated Delivery Time
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Metro cities: 3–5 business days</li>
                        <li>Non-metro & remote locations: 5–8 business days</li>
                    </ul>
                    <p className="mt-2">
                        Delivery timelines are estimates and may be affected by factors
                        beyond our control such as weather conditions, logistics delays, or
                        regional restrictions.
                    </p>

                    <h3 className="font-medium mt-4 mb-2">
                        1.4 Shipping Charges
                    </h3>
                    <p>
                        Shipping charges, if applicable, will be displayed at checkout
                        before payment. We may offer free shipping on select orders or
                        promotional campaigns.
                    </p>
                </section>

                {/* RETURNS */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        2. Returns & Exchanges
                    </h2>

                    <h3 className="font-medium mb-2">
                        2.1 Return Eligibility
                    </h3>
                    <p>
                        We accept returns or exchanges within <strong>7 days</strong> from
                        the date of delivery, provided that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>The item is unused, unwashed, and unworn</li>
                        <li>Original tags, labels, and packaging are intact</li>
                        <li>No signs of damage, stains, or alterations</li>
                    </ul>

                    <h3 className="font-medium mt-4 mb-2">
                        2.2 Non-Returnable Items
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Items purchased during clearance or final sale</li>
                        <li>Products marked as non-returnable on the product page</li>
                        <li>Items damaged due to misuse or improper handling</li>
                    </ul>

                    <h3 className="font-medium mt-4 mb-2">
                        2.3 How to Initiate a Return
                    </h3>
                    <p>
                        To initiate a return or exchange, please contact our support team
                        with your order ID and reason for return at{" "}
                        <a
                            href="mailto:support@thelayerco.in"
                            className="underline hover:text-black"
                        >
                            support@thelayerco.in
                        </a>
                        . Our team will guide you through the process.
                    </p>
                </section>

                {/* REFUNDS */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        3. Refunds
                    </h2>

                    <p>
                        Once we receive and inspect the returned item, we will notify you
                        regarding approval or rejection of your refund.
                    </p>

                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>
                            Approved refunds are processed to the original payment method
                        </li>
                        <li>
                            Refunds typically take 5–10 business days to reflect, depending on
                            your bank or payment provider
                        </li>
                    </ul>

                    <p className="mt-2">
                        Shipping charges, if any, are non-refundable unless the return is due
                        to a defect or error on our part.
                    </p>
                </section>

                {/* DAMAGED / INCORRECT */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        4. Damaged or Incorrect Items
                    </h2>
                    <p>
                        If you receive a damaged, defective, or incorrect product, please
                        notify us within 48 hours of delivery with supporting images. We
                        will arrange a replacement or refund as applicable.
                    </p>
                </section>

                {/* CANCELLATIONS */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        5. Order Cancellations
                    </h2>
                    <p>
                        Orders can only be cancelled before they are shipped. Once an order
                        has been dispatched, cancellation requests will not be accepted.
                    </p>
                </section>

                {/* CONTACT */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        6. Contact Us
                    </h2>
                    <p>
                        <strong>The Layer Co</strong>
                        <br />
                        Email:{" "}
                        <a
                            href="mailto:support@thelayerco.in"
                            className="underline hover:text-black"
                        >
                            support@thelayerco.in
                        </a>
                        <br />
                        Support Hours: Monday – Saturday, 10:00 AM – 6:00 PM (IST)
                    </p>
                </section>
            </section>
        </main>
    );
}
