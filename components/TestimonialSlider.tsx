"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    { name: "Clinton, Undergraduate", text: "I was initially scared of buying the book because I thought I would not get the value for my money. But thank God I bought it...it was worth way more than I paid for." },
    { name: "Ibrahim, Undergraduate", text: "I just finished reading volume two of the book. It has opened my eyes to the fullest. I really enjoyed the book.  I would like to join your mentorship program." },
    // { name: "Blessing Okoro", text: "I gained real skills and landed a remote job — thank you!" },
];

export default function TestimonialSlider() {
    return (
        <div className="mt-8 max-w-xl mx-auto">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
            >
                {testimonials.map((t, i) => (
                    <SwiperSlide key={i}>
                        <div className="p-6 bg-white/20 dark:bg-black/20 text-gray-800 dark:text-white rounded-xl backdrop-blur-md shadow-lg text-center">
                            <p className="text-lg mb-4 italic wrap-break-word">“{t.text}”</p>
                            <p className="font-bold">{t.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
