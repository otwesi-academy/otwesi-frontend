"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    { name: "Sarah Johnson", text: "This platform transformed my learning journey. Highly recommended!" },
    { name: "Michael Lee", text: "The courses are top quality. Very easy to navigate and learn." },
    { name: "Blessing Okoro", text: "I gained real skills and landed a remote job — thank you!" },
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
                        <div className="p-6 bg-white/20 dark:bg-black/20 text-white rounded-xl backdrop-blur-md shadow-lg text-center">
                            <p className="text-lg mb-4 italic wrap-break-word">“{t.text}”</p>
                            <p className="font-bold">{t.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
