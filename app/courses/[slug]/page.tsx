"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    slug: string;
    price: number;
    level: string;
    thumbnail_url: string;
    created_at: string;
    updated_at: string;
    rating?: number;
}

export default function CourseDetailPage() {
    const { slug } = useParams(); // get slug from URL
    console.log("slug" + slug);
    
    const router = useRouter();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        fetch(`http://localhost:8000/api/v1/courses/${slug}`)
            .then((res) => {
                if (!res.ok) throw new Error("Course not found");
                return res.json();
            })
            .then((data) => {
                setCourse(data);
            })
            .catch((err) => {
                console.error(err);
                router.push("/courses"); // redirect if not found
            })
            .finally(() => setLoading(false));
    }, [slug, router]);

    // Render star rating
    const renderStars = (rating: number = 4) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;

        return (
            <div className="flex items-center space-x-1 text-yellow-400">
                {Array(full).fill(0).map((_, i) => <span key={`f${i}`}>★</span>)}
                {half ? <span>½</span> : null}
                {Array(empty).fill(0).map((_, i) => (
                    <span key={`e${i}`} className="text-gray-300 dark:text-gray-600">★</span>
                ))}
            </div>
        );
    };

    if (loading) return <div className="text-center py-20">Loading course...</div>;
    if (!course) return <div className="text-center py-20">Course not found</div>;

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <Link href="/courses" className="text-indigo-600 dark:text-indigo-400 mb-6 inline-block">
                ← Back to Courses
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-64 sm:h-80 object-cover"
                />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

                    <div className="flex flex-wrap gap-4 items-center mb-4">
                        <span className="text-sm font-medium px-3 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white rounded-full">
                            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${course.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">{renderStars(course.rating)}</div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            50 enrolled
                        </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>

                    <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}
