import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | The Layer Co",
    description:
        "Discover The Layer Co — a men’s clothing brand focused on modern essentials, premium quality, and timeless design.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-5xl px-4 py-12 text-neutral-800">
            <header className="mb-12">
                <h1 className="text-3xl font-semibold tracking-tight">
                    About The Layer Co
                </h1>
                <p className="mt-3 max-w-2xl text-neutral-600">
                    Thoughtfully designed men’s clothing built for everyday comfort,
                    modern style, and long-lasting quality.
                </p>
            </header>

            <section className="space-y-12 leading-relaxed text-[15px]">
                {/* BRAND STORY */}
                <section>
                    <h2 className="text-xl font-medium mb-3">Our Story</h2>
                    <p>
                       The Layer Co was founded with a simple belief — great style starts with
                        great basics. In a world of fast fashion and fleeting trends, we set
                        out to create men’s clothing that feels timeless, dependable, and
                        refined.
                    </p>
                    <p className="mt-3">
                        Every piece we design focuses on fit, fabric, and function. From
                        daily essentials to elevated wardrobe staples, our collections are
                        made to move with you — whether at work, at leisure, or anywhere in
                        between.
                    </p>
                </section>

                {/* WHAT WE DO */}
                <section>
                    <h2 className="text-xl font-medium mb-3">What We Make</h2>
                    <p>
                        The Layer Co specializes exclusively in men’s apparel. Our product range
                        includes carefully crafted shirts, t-shirts, trousers, and
                        everyday essentials designed for versatility and comfort.
                    </p>
                    <p className="mt-3">
                        We prioritize clean silhouettes, neutral color palettes, and
                        premium materials to ensure our clothing remains relevant beyond
                        seasonal trends.
                    </p>
                </section>

                {/* QUALITY */}
                <section>
                    <h2 className="text-xl font-medium mb-3">Quality & Craftsmanship</h2>
                    <p>
                        Quality is at the core of everything we do. From fabric sourcing to
                        final stitching, each product goes through strict quality checks to
                        ensure durability, comfort, and consistency.
                    </p>
                    <p className="mt-3">
                        We work closely with trusted manufacturing partners and focus on
                        responsible production practices that respect both people and
                        process.
                    </p>
                </section>

                {/* CUSTOMER FIRST */}
                <section>
                    <h2 className="text-xl font-medium mb-3">Customer-First Approach</h2>
                    <p>
                        Our customers are central to our journey. We continuously refine
                        our designs based on real feedback, wear tests, and everyday use.
                    </p>
                    <p className="mt-3">
                        From seamless online shopping to responsive customer support, we aim
                        to deliver a reliable and transparent experience at every step.
                    </p>
                </section>

                {/* VISION */}
                <section>
                    <h2 className="text-xl font-medium mb-3">Our Vision</h2>
                    <p>
                        Our vision is to build a men’s clothing brand that values longevity
                        over trends, quality over quantity, and thoughtful design over
                        excess.
                    </p>
                    <p className="mt-3">
                        The Layer Co is for men who appreciate simplicity, comfort, and
                        confidence in what they wear — every day.
                    </p>
                </section>

                {/* CONTACT CTA */}
                <section>
                    <h2 className="text-xl font-medium mb-3">Get in Touch</h2>
                    <p>
                        Have questions or feedback? We’d love to hear from you.
                    </p>
                    <p className="mt-2">
                        Email us at{" "}
                        <a
                            href="mailto:support@thelayerco.in"
                            className="underline hover:text-black"
                        >
                            support@thelayerco.in
                        </a>
                    </p>
                </section>
            </section>
        </main>
    );
}
