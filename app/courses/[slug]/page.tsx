"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/clientApi";
import { Course } from "@/types/types";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();

    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchCourse = async () => {
            try {
                const { data } = await api.get<Course>(`/courses/${slug}`);
                setCourse(data);
            } catch (err) {
                console.error("Failed to load course:", err);
                router.push("/courses"); // redirect if not found
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [slug, router]);

    // Render star rating
    const renderStars = (rating: number = 4) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;

        return (
            <div className="flex items-center space-x-1 text-yellow-400">
                {Array.from({ length: full }).map((_, i) => (
                    <span key={`f${i}`}>★</span>
                ))}
                {half ? <span>½</span> : null}
                {Array.from({ length: empty }).map((_, i) => (
                    <span key={`e${i}`} className="text-gray-600">
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-20">Loading course...</div>;
    }

    if (!course) {
        return <div className="text-center py-20">Course not found</div>;
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <Link href="/courses" className="text-indigo-400 mb-6 inline-block">
                ← Back to Courses
            </Link>

            <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-64 sm:h-80 object-cover"
                />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

                    <div className="flex flex-wrap gap-4 items-center mb-4">
                        <span className="text-sm font-medium px-3 py-1 bg-indigo-700 text-white rounded-full">
                            {course.level.charAt(0).toUpperCase() +
                                course.level.slice(1)}
                        </span>

                        <span className="text-lg font-bold text-white">
                            ₦{course.price.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-2">
                            {renderStars(course.rating)}
                        </div>

                        <span className="text-sm text-gray-400">
                            50 enrolled
                        </span>
                    </div>

                    <p className="text-gray-300 mb-6">
                        {course.description}
                    </p>

                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}
