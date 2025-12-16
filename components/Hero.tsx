"use client";

import { useTypewriter } from "./useTypewriter";
import VideoModal from "./VideoModal";
import TestimonialSlider from "./TestimonialSlider";
import Link from "next/link";
import { useState } from "react";

const Hero = () => {
    const headline = useTypewriter(
        [
            "Learn. Earn. Thrive",
            "Build Digital Assets.",
            "Brand your Identity.",
            "Monetize your skills.",
            "Maximize your value"
        ],
        120
    );
    const [openVideo, setOpenVideo] = useState(false);

    return (
        <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pb-16 pt-8 px-4 sm:px-6 lg:px-8">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-[#0758db] via-[#84aff5] to-[#1b6df2] dark:from-[#0b0f2c] dark:via-[#101637] dark:to-[#13204d]"></div>

            {/* Animated Floating Shapes */}
            <div className="absolute top-20 left-4 sm:left-20 w-20 sm:w-24 h-20 sm:h-24 bg-white/20 dark:bg-purple-400/20 rounded-xl blur-xl animate-[float_6s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-16 right-4 sm:right-32 w-24 sm:w-32 h-24 sm:h-32 bg-yellow-300/20 dark:bg-indigo-500/20 rounded-full blur-2xl animate-[float2_8s_ease-in-out_infinite]"></div>

            {/* Hero Content */}
            <div className="relative z-20 w-full max-w-3xl text-center">
                <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 p-6 sm:p-12 rounded-3xl border border-white/20 shadow-xl">

                    {/* Typewriter Headline */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4 sm:mb-6 leading-tight wrap-break-word">
                        {headline}
                        <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-orange-400">
                            Online.
                        </span>
                    </h1>

                    {/* Tagline */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-white/90 max-w-full sm:max-w-2xl mx-auto mb-6 sm:mb-8 wrap-break-word">
                        At Otwesi Academy, hundreds of African youths become empowered to brand their digital identity on social media, optimize digital tools and monetize their skills in 28 days.
                    </p>

                    <p className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-white/90 max-w-full sm:max-w-2xl mx-auto mb-6 sm:mb-8 wrap-break-word">
                        We offer online courses, powerful eBooks, Coaching sessions and capacity building programs on the go.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-6 sm:gap-10 text-gray-800 dark:text-white/90 mb-6 sm:mb-10 flex-wrap">
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold">100+</p>
                            <p className="text-sm sm:text-base opacity-70">Students</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold">10</p>
                            <p className="text-sm sm:text-base opacity-70">Modules</p>
                        </div>
                        <div>
                            <p className="text-2xl sm:text-3xl font-bold">28</p>
                            <p className="text-sm sm:text-base opacity-70">Days</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-6 sm:mb-10">
                        <Link
                            href="/waitlist"
                            className="px-6 py-3 sm:px-8 sm:py-3 rounded-full text-lg font-semibold bg-white text-indigo-700 hover:bg-gray-200 transition shadow-lg"
                        >
                            Join our waitlist
                        </Link>

                        <button
                            onClick={() => setOpenVideo(true)}
                            className="px-6 py-3 sm:px-8 sm:py-3 rounded-full text-lg font-semibold border border-white text-gray-800 dark:text-white hover:bg-white/20 transition shadow-lg"
                        >
                            ▶ Play Intro Video
                        </button>
                    </div>

                    {/* Testimonial Slider */}
                    <TestimonialSlider />
                </div>
            </div>

            {/* Video Modal */}
            <VideoModal isOpen={openVideo} onClose={() => setOpenVideo(false)} />
        </section>
    );
};

export default Hero;
