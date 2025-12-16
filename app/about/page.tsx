export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            {/* Header */}
            <h1 className="text-4xl font-bold text-center mb-6">
                About Otwesi Digital Academy
            </h1>

            {/* <p className="text-center text-gray-600 dark:text-gray-300 mb-16 text-lg max-w-3xl mx-auto">
                Empowering learners with accessible, high-quality education in tech, business, and personal development.
            </p> */}

            {/* Our Mission */}
            <section className="mb-20">
                {/* <h2 className="text-3xl font-semibold mb-4">Our Mission</h2> */}
                <p className="text-gray-300 leading-relaxed text-lg">
                    We focus on digital literacy, social media literacy, personal branding and professional development;
                    by guiding beginners, undergraduates, and early-career professionals to build transferable skills, brand their digital identity, and monetize their value online.
                    <br /><br />
                    Our approach is simply a combination of structured coaching, practical learning, hands-on experience and 
                    supportive community, without pressure or shortcuts but accountability and proactiveness.
                    <br /><br />
                    At Otwesi, growth is intentional. We help you clarify your digital identity, develop valuable skills,
                    and build influence and digital assets that support long term impact, productivity and income.
                </p>
            </section>

            {/* What We Offer */}
            <section className="mb-20">
                <h2 className="text-3xl font-semibold mb-6">What We Offer</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-6 bg-gray-800 shadow rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Online Courses</h3>
                        <p className="text-gray-300">
                            High-quality courses created by industry experts, designed to help
                            you learn by doing.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-800 shadow rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">E-Books</h3>
                        <p className="text-gray-300">
                            Carefully crafted e-books that simplify complex topics into
                            easy-to-understand lessons.
                        </p>
                    </div>

                    <div className="p-6 bg-gray-800 shadow rounded-2xl">
                        <h3 className="text-xl font-semibold mb-2">Blog Articles</h3>
                        <p className="text-gray-300">
                            Weekly articles covering technology, productivity, and personal
                            growth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="mb-20">
                <h2 className="text-3xl font-semibold mb-6">Our Core Values</h2>

                <ul className="space-y-4 text-gray-300 text-lg">
                    <li>• <strong>Excellence</strong> – We deliver only the best learning experience.</li>
                    <li>• <strong>Accessibility</strong> – Education shouldn’t have barriers.</li>
                    <li>• <strong>Community</strong> – We grow together and support learners worldwide.</li>
                    <li>• <strong>Integrity</strong> – Knowledge built on honesty and transparency.</li>
                </ul>
            </section>

            {/* Team Note */}
            <section className="text-center bg-indigo-600 text-white py-12 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold mb-4">Join Us on This Journey</h2>
                <p className="max-w-3xl mx-auto text-lg opacity-90">
                    Whether you're here to gain new skills or improve your career,
                    Otwesi Academy is committed to supporting your learning path every step of the way.
                </p>
            </section>
        </div>
    );
}
