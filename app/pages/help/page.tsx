import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Help Center | Layer Co",
    description:
        "Find answers to common questions about orders, shipping, returns, payments, and products at Layer Co.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function HelpPage() {
    return (
        <main className="mx-auto px-4 py-12 text-neutral-800">
            <Link href={"/"} className="flex gap-2 items-center pb-12 group">
                <p className="group-hover:text-black/40"><ArrowLeft size={18} /></p>
                <span className="cursor-pointer group-hover:text-black/40">back to THE LAYER Co.</span>
            </Link>
            {/* HEADER */}
            <header className="mb-12">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Help Center
                </h1>
                <p className="mt-3 max-w-2xl text-neutral-600">
                    Need assistance? Find answers to common questions or get in touch with
                    our support team.
                </p>
            </header>

            {/* QUICK LINKS */}
            <section className="mb-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[
                    { title: "Orders & Payments", href: "#orders" },
                    { title: "Shipping & Delivery", href: "#shipping" },
                    { title: "Returns & Refunds", href: "#returns" },
                    { title: "Sizing & Products", href: "#products" },
                    { title: "Account & Privacy", href: "#account" },
                    { title: "Contact Support", href: "/contact" },
                ].map(link => (
                    <Link
                        key={link.title}
                        href={link.href}
                        className="rounded-[3px] border bg-(--linen-200) border-neutral-200 p-4 text-sm font-medium hover:border-(--border-strong) transition"
                    >
                        {link.title}
                    </Link>
                ))}
            </section>

            <section className="space-y-12 text-[15px] leading-relaxed">
                {/* ORDERS */}
                <section id="orders">
                    <h2 className="text-xl font-medium mb-3">
                        Orders & Payments
                    </h2>
                    <p>
                        Once an order is placed successfully, you will receive a confirmation
                        email with your order details. Orders cannot be modified after
                        confirmation.
                    </p>
                    <p className="mt-3">
                        We accept secure online payments via trusted third-party payment
                        gateways. Layer Co does not store your payment information.
                    </p>
                </section>

                {/* SHIPPING */}
                <section id="shipping">
                    <h2 className="text-xl font-medium mb-3">
                        Shipping & Delivery
                    </h2>
                    <p>
                        Orders are usually processed within 1–3 business days. Delivery times
                        may vary depending on your location and courier partner.
                    </p>
                    <p className="mt-3">
                        For detailed information, please visit our{" "}
                        <Link
                            href="/shipping-returns"
                            className="underline hover:text-black"
                        >
                            Shipping & Returns Policy
                        </Link>
                        .
                    </p>
                </section>

                {/* RETURNS */}
                <section id="returns">
                    <h2 className="text-xl font-medium mb-3">
                        Returns & Refunds
                    </h2>
                    <p>
                        We accept returns or exchanges within 7 days of delivery, provided
                        the product is unused, unwashed, and returned with original tags.
                    </p>
                    <p className="mt-3">
                        Refunds are processed after quality checks and typically reflect
                        within 5–10 business days.
                    </p>
                </section>

                {/* PRODUCTS */}
                <section id="products">
                    <h2 className="text-xl font-medium mb-3">
                        Products, Sizing & Care
                    </h2>
                    <p>
                        Product descriptions include sizing and fit information to help you
                        choose confidently. Minor color variations may occur due to screen
                        settings or lighting.
                    </p>
                    <p className="mt-3">
                        Care instructions are mentioned on the product page and label to
                        help maintain fabric quality and longevity.
                    </p>
                </section>

                {/* ACCOUNT */}
                <section id="account">
                    <h2 className="text-xl font-medium mb-3">
                        Account & Privacy
                    </h2>
                    <p>
                        Creating an account allows you to track orders, manage returns, and
                        save preferences. You are responsible for maintaining the
                        confidentiality of your login details.
                    </p>
                    <p className="mt-3">
                        Learn how we handle your data in our{" "}
                        <Link
                            href="/pages/privacy-policy"
                            className="underline hover:text-black"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </section>

                {/* STILL NEED HELP */}
                <section>
                    <h2 className="text-xl font-medium mb-3">
                        Still Need Help?
                    </h2>
                    <p>
                        If you couldn’t find what you were looking for, our support team is
                        happy to assist you.
                    </p>
                    <p className="mt-2">
                        Contact us at{" "}
                        <a
                            href="mailto:support@thelayerco.in"
                            className="underline hover:text-black"
                        >
                            support@thelayerco.in
                        </a>{" "}
                        or visit our{" "}
                        <Link
                            href="/pages/contact"
                            className="underline hover:text-black"
                        >
                            Contact Us
                        </Link>{" "}
                        page.
                    </p>
                </section>
            </section>
        </main>
    );
}
