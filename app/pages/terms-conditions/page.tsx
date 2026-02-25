import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions | The Layer Co",
    description:
        "Review The Layer Co’s Terms & Conditions governing the use of our website and purchase of men’s clothing products.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsAndConditionsPage() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 text-neutral-800">
            <Link href={"/"} className="flex gap-2 items-center pb-12 group">
                <p className="group-hover:text-black/40"><ArrowLeft size={18} /></p>
                <span className="cursor-pointer group-hover:text-black/40">back to THE LAYER Co.</span>
            </Link>
            <header className="mb-10">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Terms & Conditions
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                    Last updated: 1 February 2026
                </p>
            </header>

            <section className="space-y-8 leading-relaxed text-[15px]">
                <p>
                    These Terms & Conditions (“Terms”) govern your access to and use of the 
                     {" "}<strong>The Layer Co</strong> website and services. By accessing, browsing,
                    or purchasing from our men’s-only clothing platform, you agree to be
                    bound by these Terms. If you do not agree, please refrain from using
                    our Website.
                </p>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        1. Eligibility
                    </h2>
                    <p>
                        You must be at least 18 years of age and capable of entering into a
                        legally binding contract under applicable law to use this Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        2. Account Registration
                    </h2>
                    <p>
                        You may be required to create an account to access certain features.
                        You are responsible for maintaining the confidentiality of your
                        login credentials and for all activities that occur under your
                        account.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        3. Products & Availability
                    </h2>
                    <p>
                        All products listed on The Layer Co are subject to availability. We
                        reserve the right to modify, discontinue, or limit quantities of any
                        product without prior notice.
                    </p>
                    <p className="mt-2">
                        Product images are for illustrative purposes only. Slight variations
                        in color or appearance may occur due to lighting or screen settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        4. Pricing & Payments
                    </h2>
                    <p>
                        All prices are displayed in Indian Rupees (INR) and are inclusive of
                        applicable taxes unless stated otherwise. Prices may change at any
                        time without prior notice.
                    </p>
                    <p className="mt-2">
                        Payments are processed through secure third-party payment gateways.
                        Layer Co does not store your payment details.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        5. Shipping & Delivery
                    </h2>
                    <p>
                        Delivery timelines are estimates and may vary based on location,
                        courier partner, or unforeseen circumstances. Layer Co shall not be
                        liable for delays beyond its reasonable control.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        6. Returns, Exchanges & Refunds
                    </h2>
                    <p>
                        Returns or exchanges are subject to our Return & Refund Policy.
                        Products must be unused, unwashed, and returned in original
                        condition with tags intact.
                    </p>
                    <p className="mt-2">
                        Refunds, if approved, will be processed to the original payment
                        method within a reasonable timeframe.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        7. Intellectual Property
                    </h2>
                    <p>
                        All content on this Website, including logos, designs, images,
                        text, and software, is the intellectual property of Layer Co and is
                        protected under applicable intellectual property laws. Unauthorized
                        use is strictly prohibited.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        8. User Conduct
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Engage in unlawful or fraudulent activity</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Interfere with the Website’s security or functionality</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        9. Limitation of Liability
                    </h2>
                    <p>
                        To the maximum extent permitted by law, Layer Co shall not be liable
                        for any indirect, incidental, or consequential damages arising from
                        your use of the Website or products purchased.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        10. Indemnification
                    </h2>
                    <p>
                        You agree to indemnify and hold harmless Layer Co from any claims,
                        losses, damages, or expenses arising out of your breach of these
                        Terms or misuse of the Website.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        11. Termination
                    </h2>
                    <p>
                        We reserve the right to suspend or terminate your access to the
                        Website at our discretion, without prior notice, if you violate
                        these Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        12. Governing Law & Jurisdiction
                    </h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with
                        the laws of India. Courts located in India shall have exclusive
                        jurisdiction over any disputes.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        13. Changes to These Terms
                    </h2>
                    <p>
                        The Layer Co reserves the right to update or modify these Terms at any
                        time. Continued use of the Website constitutes acceptance of the
                        revised Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-medium mb-3">
                        14. Contact Information
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
