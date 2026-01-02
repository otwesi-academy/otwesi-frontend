import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
    return {
        title: "Terms of Service | Otwesi Academy",
        description:
            "Read the Terms of Service governing the use of Otwesi Academy’s website, courses, and educational services.",
        alternates: {
            canonical: "/terms",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
};


export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-12">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white">
                    Terms of Service
                </h1>
                <p className="mt-2 text-sm text-gray-200 italic">
                    Last updated: January 2026
                </p>
            </header>

            <section className="space-y-8 text-white leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-white">
                        1. About Otwesi Academy
                    </h2>
                    <p className="mt-2">
                        Otwesi Academy is an educational platform that
                        provides learning content, assessments, and related educational
                        services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        2. Eligibility
                    </h2>
                    <p className="mt-2">
                        You must be at least 13 years old to use our Services. If you are
                        under 18, you confirm that you have permission from a parent or
                        legal guardian.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        3. User Accounts
                    </h2>
                    <ul className="mt-2 list-disc pl-6 space-y-2">
                        <li>You may need to create an account to access certain features.</li>
                        <li>
                            You are responsible for keeping your login credentials secure.
                        </li>
                        <li>
                            You agree to provide accurate and up-to-date account information.
                        </li>
                        <li>
                            We may suspend or terminate accounts that violate these Terms.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        4. Acceptable Use
                    </h2>
                    <p className="mt-2">You agree not to:</p>
                    <ul className="mt-2 list-disc pl-6 space-y-2">
                        <li>Use the Services for unlawful or harmful purposes.</li>
                        <li>Attempt to gain unauthorized access to our systems.</li>
                        <li>Upload malicious software or harmful content.</li>
                        <li>
                            Copy, resell, or exploit our content without written permission.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        5. Intellectual Property
                    </h2>
                    <p className="mt-2">
                        All content on Otwesi Academy, including text, videos, graphics,
                        logos, and software, is owned by or licensed to us and protected
                        by intellectual property laws. You may not reproduce or distribute
                        our content without prior written consent.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        6. Educational Disclaimer
                    </h2>
                    <p className="mt-2">
                        All materials are provided for educational purposes only. We do not
                        guarantee that the content is error-free or suitable for every use.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        7. Payments (If Applicable)
                    </h2>
                    <p className="mt-2">
                        If paid services are offered, fees will be clearly displayed before
                        purchase. Payments are non-refundable unless stated otherwise.
                        Pricing may change with prior notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        8. Termination
                    </h2>
                    <p className="mt-2">
                        We reserve the right to suspend or terminate your access to the
                        Services if you breach these Terms or misuse the platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        9. Limitation of Liability
                    </h2>
                    <p className="mt-2">
                        To the fullest extent permitted by law, Otwesi Academy shall not be
                        liable for any indirect, incidental, or consequential damages
                        arising from your use of the Services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        10. Changes to These Terms
                    </h2>
                    <p className="mt-2">
                        We may update these Terms from time to time. Continued use of the
                        Services after updates means you accept the revised Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        11. Governing Law
                    </h2>
                    <p className="mt-2">
                        These Terms are governed by the laws of the Federal Republic of
                        Nigeria, without regard to conflict of law principles.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white">
                        12. Contact
                    </h2>
                    <p className="mt-2">
                        If you have questions about these Terms, please contact us through
                        the official communication channels listed on the Otwesi Academy
                        website.
                    </p>
                </section>
            </section>
        </main>
    );
}
