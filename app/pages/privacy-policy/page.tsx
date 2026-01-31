import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | The Layer Co",
    description:
        "Read Layer Co’s Privacy Policy to understand how we collect, use, and protect your personal information while shopping men’s fashion.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPolicyPage() {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 text-neutral-800">
            <header className="mb-10">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-sm text-neutral-500">
                    Last updated: 1 February 2026
                </p>
            </header>

            <section className="space-y-8 leading-relaxed text-[15px]">
                <p className="font-semibold">
                    Welcome to <strong>The Layer Co</strong> (collectively &quot;The Layer Co, we, our, us&quot;). We respect
                    your privacy and are committed to protecting your personal data. This
                    Privacy Policy explains how we collect, use, disclose, and safeguard
                    your information when you visit or make a purchase from our men’s-only
                    clothing website (the “Website”).
                </p>

                <p className="font-semibold">
                    This policy is designed to comply with applicable laws including the
                    Information Technology Act, 2000 (India), the Information Technology
                    (Reasonable Security Practices and Procedures and Sensitive Personal
                    Data or Information) Rules, 2011, and where applicable, the General Data
                    Protection Regulation (GDPR).
                </p>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        1. Information We Collect
                    </h2>

                    <h3 className="font-semibold mb-2">
                        1.1 Personal Information You Provide
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 ">
                        <li>Full name</li>
                        <li>Email address</li>
                        <li>Mobile number</li>
                        <li>Billing and shipping address</li>
                        <li>Account credentials (securely encrypted)</li>
                        <li>Order history and preferences</li>
                    </ul>

                    <h3 className="font-semibold mt-4 mb-2">
                        1.2 Payment Information
                    </h3>
                    <p>
                        We do not store your debit/credit card details, UPI IDs, or net
                        banking information. All payments are processed securely through
                        authorized third-party payment gateways compliant with PCI-DSS
                        standards.
                    </p>

                    <h3 className="font-semibold mt-4 mb-2">
                        1.3 Automatically Collected Information
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>IP address</li>
                        <li>Browser and device information</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring URLs</li>
                        <li>Cookies and similar technologies</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        2. How We Use Your Information
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To create and manage user accounts</li>
                        <li>To process orders and deliver products</li>
                        <li>To communicate order updates and support responses</li>
                        <li>To improve our website, products, and services</li>
                        <li>To personalize your shopping experience</li>
                        <li>To prevent fraud and unauthorized activity</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        3. Cookies and Tracking Technologies
                    </h2>
                    <p>
                        We use cookies and similar technologies to enable essential website
                        functionality, remember preferences, analyze usage, and improve
                        performance. You can manage cookies through your browser settings,
                        but disabling them may affect certain features.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        4. Sharing of Information
                    </h2>
                    <p>We do not sell or rent your personal data.</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>
                            Trusted service providers for payments, logistics, hosting, and
                            analytics
                        </li>
                        <li>Legal or regulatory authorities when required by law</li>
                        <li>
                            Business transfers such as mergers or acquisitions, subject to
                            confidentiality
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        5. Data Retention
                    </h2>
                    <p>
                        We retain personal information only for as long as necessary to
                        fulfill the purposes outlined in this policy or as required by law.
                        Data that is no longer required is securely deleted or anonymized.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        6. Data Security
                    </h2>
                    <p>
                        We implement reasonable technical and organizational measures such as
                        encrypted connections (HTTPS), access controls, and regular security
                        monitoring. However, no online system is completely secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        7. Your Rights
                    </h2>
                    <p>
                        You may request access, correction, or deletion of your personal
                        data, or opt out of marketing communications by contacting us.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        8. Children’s Privacy
                    </h2>
                    <p>
                        Layer Co does not knowingly collect personal data from individuals
                        under the age of 18.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        9. Changes to This Policy
                    </h2>
                    <p>
                        We may update this Privacy Policy periodically. Changes will be
                        posted on this page with an updated revision date.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-extrabold mb-3">
                        10. Contact Us
                    </h2>
                    <p>
                        <strong>Layer Co</strong>
                        <br />
                        Email:{" "}
                        <a
                            href="mailto:support@layerco.in"
                            className="underline hover:text-black"
                        >
                            support@layerco.in
                        </a>
                        <br />
                        Support Hours: Monday – Saturday, 10:00 AM – 6:00 PM (IST)
                    </p>
                </section>
            </section>
        </main>
    );
}
