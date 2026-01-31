import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us | The Layer Co",
    description:
        "Get in touch with The Layer Co for order support, product questions, or general enquiries.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function ContactPage() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-16 text-neutral-800">
            <header className="mb-12">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Contact Us
                </h1>
                <p className="mt-3 max-w-2xl text-neutral-600">
                    Have a question about your order, sizing, or our products?
                    We’re here to help.
                </p>
            </header>

            <section className="grid gap-12 md:grid-cols-2 text-[15px] leading-relaxed">
                {/* CONTACT INFO */}
                <section>
                    <h2 className="text-xl font-medium mb-4">
                        Customer Support
                    </h2>

                    <p className="mb-4">
                        For order-related queries, returns, exchanges, or general support,
                        please reach out to us using the contact details below. Our team
                        aims to respond within 24–48 business hours.
                    </p>

                    <div className="space-y-3">
                        <p>
                            <strong>Email:</strong>{" "}
                            <a
                                href="mailto:support@thelayerco.in"
                                className="underline hover:text-black"
                            >
                                support@thelayerco.in
                            </a>
                        </p>

                        <p>
                            <strong>Support Hours:</strong>
                            <br />
                            Monday – Saturday, 10:00 AM – 6:00 PM (IST)
                        </p>
                    </div>

                    <p className="mt-6 text-neutral-600">
                        For quick answers, you may also visit our{" "}
                        <Link
                            href="/pages/shipping-returns"
                            className="underline hover:text-black"
                        >
                            Shipping & Returns Policy
                        </Link>{" "}
                        or{" "}
                        <Link
                            href="/pages/terms-conditions"
                            className="underline hover:text-black"
                        >
                            Terms & Conditions
                        </Link>
                        .
                    </p>
                </section>

                {/* CONTACT FORM (UI ONLY) */}
                <section>
                    <h2 className="text-xl font-medium mb-4">
                        Send Us a Message
                    </h2>

                    <p className="mb-6 text-neutral-600">
                        Fill out the form below and we’ll get back to you as soon as
                        possible.
                    </p>

                    <form
                        className="space-y-4"
                        action="#"
                        method="post"
                        aria-label="Contact form"
                    >
                        <div>
                            <label className="block text-sm mb-1" htmlFor="name">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="w-full rounded-[3px] border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-[3px] border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1" htmlFor="orderId">
                                Order ID (optional)
                            </label>
                            <input
                                id="orderId"
                                name="orderId"
                                type="text"
                                className="w-full rounded-[3px] border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1" htmlFor="message">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                required
                                className="w-full rounded-[3px] border border-neutral-300 px-3 py-2 focus:border-black focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex items-center rounded-[3px] bg-black px-6 py-2 text-sm font-medium text-white hover:bg-neutral-900"
                        >
                            Send Message
                        </button>

                        <p className="text-xs text-neutral-500">
                            By submitting this form, you agree to our{" "}
                            <Link
                                href="/pages/privacy-policy"
                                className="underline hover:text-black"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </form>
                </section>
            </section>
        </main>
    );
}
